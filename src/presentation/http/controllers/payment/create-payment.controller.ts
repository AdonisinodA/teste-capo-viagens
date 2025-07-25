import { FastifyReply, FastifyRequest } from "fastify";
import { PaymentRepository } from "../../../../infra/db/repositories/payment/payment.repository";
import pool from "../../../../infra/db/db.infra";
import {
  CreatePaymentInput,
  CreatePaymentValidation,
} from "../../validations/payments/create-payment.validation";
import AppError from "../../../../common/error/AppError";
import { CryptoService } from "../../../../infra/crypto/encrypt.infra";
import { card } from "../../../../domain/payment/entity/payment.entity";
import { CreatePaymentUseCase } from "../../../../application/useCases/payment/create-payment.useCase";

class CreatePaymentController {
  async execute(
    request: FastifyRequest<{ Body: CreatePaymentInput }>,
    reply: FastifyReply
  ) {
    const { body } = request;
    const createPaymentValidation = new CreatePaymentValidation();

    if (body.method === "credit_card") {
      const cardDataString = CryptoService.decrypt(body.card!.encryptedData);
      if (!createPaymentValidation.validStringifyCard(cardDataString)) {
        AppError(
          "Dados do cartão inválidos, deve seguir o padrão: {number:string, cvv:string, expirationDate:MM/AA} em base64"
        );
      }

      const cardDataObject = JSON.parse(cardDataString) as card;

      const cardIsValid = createPaymentValidation.validateCardData({
        number: cardDataObject.number,
        cvv: cardDataObject.cvv,
        expirationDate: cardDataObject.expirationDate,
      });

      if (!cardIsValid) {
        AppError("Dados do cartão inválidos.");
      }

      body.card = {
        encryptedData: CryptoService.encrypt(
          JSON.stringify({
            number: cardDataObject.number,
            cvv: cardDataObject.cvv,
            expirationDate: cardDataObject.expirationDate,
          })
        ),
      };
    } else if (body.method === "pix") {
      delete body.card;
    }

    const paymenteRepository = new PaymentRepository(pool);
    const createPaymentUseCase = new CreatePaymentUseCase(paymenteRepository);

    const result = await createPaymentUseCase.execute(body);
    return reply.status(201).send({
      message: {
        id: result.id,
        status: result.status,
        message: "Processamento de pagamento concluído.",
      },
    });
  }
}

export default new CreatePaymentController();

