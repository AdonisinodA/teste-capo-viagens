import {
  PaymentEntity,
  PaymentStatus,
} from "../../../domain/payment/entities/payment.entity";
import { PaymentRepository } from "../../../infra/db/repositories/payments/payment.repository";
import { FakePaymentGateway } from "../../../infra/gateways/fakePayment.gateway";
import { CreatePaymentInput } from "../../../presentation/http/validations/payments/create-payment.validation";

export type card = { number: string; cvv: string; expirationDate: string };

export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(
    body: CreatePaymentInput
  ): Promise<{ id: number; status: PaymentStatus }> {
    const payment = new PaymentEntity(
      body.method,
      body.amount,
      body.buyer.name,
      body.buyer.email,
      body.card?.encryptedData
    );

    const gatewayPayment = new FakePaymentGateway();

    await gatewayPayment.process(payment);

    const resultDatabase = await this.paymentRepository.create(payment);

    return {
      id: resultDatabase.insertId,
      status: payment.status,
    };
  }
}

