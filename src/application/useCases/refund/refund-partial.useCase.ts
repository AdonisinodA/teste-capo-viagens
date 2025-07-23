import AppError from "../../../common/error/AppError";
import { RefundEntity } from "../../../domain/refund/entity/refund.entity";
import { typeRefund } from "../../../domain/refund/enum/refund.enum";
import { PaymentRepository } from "../../../infra/db/repositories/payment/payment.repository";
import { RefundRepository } from "../../../infra/db/repositories/refund/refund.repository";
import { FakePaymentGateway } from "../../../infra/gateways/fakePayment.gateway";

export class RefundPartialUseCase {
  constructor(
    private readonly refundRepository: RefundRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentGateway: FakePaymentGateway
  ) {}

  async execute(payment_id: string, amountRefund: number) {
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
    const refund = new RefundEntity(
      payment_id,
      amountRefund,
      typeRefund.partial
    );
    // chamada fake ao gateway de pagamento para saber se é possível reembolsar

    const canAddRefunt = await this.paymentGateway.refund(
      this.paymentRepository,
      refund.payment_id,
      refund.amount
    );

    if (!canAddRefunt.canADD && Number(canAddRefunt.remaining_amount) > 0) {
      AppError(
        `Só é possível reembolsar até R$:${canAddRefunt.remaining_amount / 100}.`,
        400
      );
    } else if (!canAddRefunt.canADD) {
      AppError(`Não é possível reembolsar este pagamento.`, 400);
    }

    await this.refundRepository.create(refund);
  }
}

