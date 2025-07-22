import { PaymentEntity } from "../../domain/payment/entities/payment.entity";

export class FakePaymentGateway {
  async process(payment: PaymentEntity): Promise<PaymentEntity> {
    const approved = Math.random() > 0.2;
    payment.status = approved ? "APPROVED" : "DECLINED";
    return payment;
  }
}

