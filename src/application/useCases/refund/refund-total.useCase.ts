import AppError from "../../../common/error/AppError";
import { RefundEntity } from "../../../domain/refund/entity/refund.entity";
import { typeRefund } from "../../../domain/refund/enum/refund.enum";
import { PaymentRepository } from "../../../infra/db/repositories/payment/payment.repository";
import { RefundRepository } from "../../../infra/db/repositories/refund/refund.repository";
import { FakePaymentGateway } from "../../../infra/gateways/fakePayment.gateway";

export class RefundTotalUseCase {
  constructor(
    private readonly refundRepository: RefundRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentGateway: FakePaymentGateway
  ) {}

  async execute(payment_id: string) {
    const payment = await this.paymentRepository.getByID(payment_id);

    if (!payment) {
      AppError("Pagamento não encontrado.", 404);
    }

    if (payment.status === "DECLINED") {
      AppError(
        "Este pagamento não foi aprovado e por isso não pode ser reembolsado.",
        400
      );
    }

    // chamada fake ao gateway de pagamento para saber se é possível reembolsar
    const canAddRefunt = await this.paymentGateway.refund(
      this.paymentRepository,
      payment_id,
      payment.amount
    );

    if (Number(canAddRefunt.remaining_amount) > 0) {
      const refund = new RefundEntity(
        payment_id,
        canAddRefunt.remaining_amount / 100,
        typeRefund.total
      );

      await this.refundRepository.create(refund);
    } else {
      AppError(`Não é possível reembolsar este pagamento.`, 400);
    }
  }
}

