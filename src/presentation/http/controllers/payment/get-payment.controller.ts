import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetPaymentInput,
  ResponseGetpayment,
} from "../../validations/payments/get-payment.validation";
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
    const { payment, refund } = await getPaymentUseCase.execute(params.id);

    const responsePayment: ResponseGetpayment = {
      buyer_email: payment.buyer_email,
      buyer_name: payment.buyer_name,
      card_data: payment.card_data,
      created_at: payment.created_at,
      id: payment.id,
      payment_amount: payment.amount / 100,
      remaining_amount: refund.remaining_amount / 100,
      total_refunded: refund.total_refunded / 100,
      status: payment.status,
      type: payment.type,
      updated_at: payment.updated_at,
    };

    if (responsePayment.type === "credit_card") {
      responsePayment.card_data_decrypt = JSON.parse(
        CryptoService.decrypt(payment.card_data!)
      );
    }

    return reply.status(200).send({
      message: {
        result: responsePayment,
      },
    });
  }
}

export default new GetPaymentController();

