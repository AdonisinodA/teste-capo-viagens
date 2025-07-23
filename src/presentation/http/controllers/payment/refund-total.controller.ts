import { FastifyReply, FastifyRequest } from "fastify";
import { PaymentRepository } from "../../../../infra/db/repositories/payment/payment.repository";
import pool from "../../../../infra/db/db.infra";
import { RefundRepository } from "../../../../infra/db/repositories/refund/refund.repository";
import { FakePaymentGateway } from "../../../../infra/gateways/fakePayment.gateway";
import { BodyRefundTotalInput } from "../../validations/payments/refund-total.validation";
import { RefundTotalUseCase } from "../../../../application/useCases/refund/refund-total.useCase";

class RefundTotalController {
  async execute(
    request: FastifyRequest<{
      Body: BodyRefundTotalInput;
    }>,
    reply: FastifyReply
  ) {
    const { body } = request;

    const paymentRepository = new PaymentRepository(pool);
    const refundRepository = new RefundRepository(pool);
    const paymentGateway = new FakePaymentGateway();
    const refundPartialUseCase = new RefundTotalUseCase(
      refundRepository,
      paymentRepository,
      paymentGateway
    );

    await refundPartialUseCase.execute(String(body.payment_id));

    return reply.status(200).send({
      message: "Reembolso total processado com sucesso.",
    });
  }
}

export default new RefundTotalController();

