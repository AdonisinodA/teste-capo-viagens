import { PaymentEntity } from "../../domain/payment/entity/payment.entity";
import { PaymentRepository } from "../db/repositories/payment/payment.repository";

export class FakePaymentGateway {
  async process(payment: PaymentEntity): Promise<PaymentEntity> {
    const approved = Math.random() > 0.2;
    payment.status = approved ? "APPROVED" : "DECLINED";
    return payment;
  }

  async refund(
    paymentRepository: PaymentRepository,
    payment_id: string,
    amountRefund: number
  ) {
    const canAddRefunt = await paymentRepository.canAddRefunt(
      payment_id,
      amountRefund
    );

    return canAddRefunt;
  }
}

