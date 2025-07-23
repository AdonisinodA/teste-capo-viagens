import { FastifyReply, FastifyRequest } from "fastify";
import { GetPaymentInput } from "../../validations/payments/get-payment.validation";
import { GetPaymentUseCase } from "../../../../application/useCases/payment/get-payment.useCase";
import pool from "../../../../infra/db/db.infra";
import { PaymentRepository } from "../../../../infra/db/repositories/payment/payment.repository";
import { CryptoService } from "../../../../infra/crypto/encrypt.infra";

class GetPaymentController {
  async execute(
    request: FastifyRequest<{ Params: GetPaymentInput }>,
    reply: FastifyReply
  ) {
    const { params } = request;
    const paymentRepository = new PaymentRepository(pool);
    const getPaymentUseCase = new GetPaymentUseCase(paymentRepository);
    const payment = await getPaymentUseCase.execute(params.id);
    if (payment.type === "credit_card") {
      payment.card_data_decrypt = JSON.parse(
        CryptoService.decrypt(payment.card_data!)
      );
    }
    payment.amount = payment.amount / 100;

    return reply.status(200).send({
      message: {
        result: payment,
      },
    });
  }
}

export default new GetPaymentController();

