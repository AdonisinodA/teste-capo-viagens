import { FastifyReply, FastifyRequest } from "fastify";
import {
  BodyRefundPartialInput,
  ParamsRefundPartialInput,
} from "../../validations/payments/refund-partial.validation";
import { PaymentRepository } from "../../../../infra/db/repositories/payment/payment.repository";
import pool from "../../../../infra/db/db.infra";
import { RefundRepository } from "../../../../infra/db/repositories/refund/refund.repository";
import { RefundPartialUseCase } from "../../../../application/useCases/refund/refund-partial.useCase";
import { FakePaymentGateway } from "../../../../infra/gateways/fakePayment.gateway";

class RefundPartialController {
  async execute(
    request: FastifyRequest<{
      Params: ParamsRefundPartialInput;
      Body: BodyRefundPartialInput;
    }>,
    reply: FastifyReply
  ) {
    const { body, params } = request;

    const paymentRepository = new PaymentRepository(pool);
    const refundRepository = new RefundRepository(pool);
    const paymentGateway = new FakePaymentGateway();
    const refundPartialUseCase = new RefundPartialUseCase(
      refundRepository,
      paymentRepository,
      paymentGateway
    );

    await refundPartialUseCase.execute(params.id, body.amount);

    return reply.status(200).send({
      message: "Reembolso processado com sucesso.",
    });
  }
}

export default new RefundPartialController();

