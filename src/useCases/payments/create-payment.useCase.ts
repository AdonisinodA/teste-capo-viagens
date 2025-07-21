import { PaymentEntity } from "../../domain/entities/payment.entity";
import { CryptoService } from "../../infrastructure/crypto/encrypt.infra";
import { CreatePaymentInput } from "../../schemas/payments/create-payment.schema";

export type card = { number: string; cvv: string; expirationDate: string };

export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: any) {}

  createPayment(body: CreatePaymentInput): Promise<void> {
    const payment = new PaymentEntity(
      body.method,
      body.amount,
      body.buyer,
      body.card
    );

    if (payment.method === "credit_card") {
      const cardDataString = CryptoService.decrypt(body.card!.encryptedData);

      const cardDataObject = JSON.parse(cardDataString) as card;

      const cardIsValid = payment.validateCardData({
        number: cardDataObject.number,
        cvv: cardDataObject.cvv,
        expirationDate: cardDataObject.expirationDate,
      });

      if (!cardIsValid) {
        throw new Error("Dados do cartão inválidos.");
      }
    } else if (payment.method === "pix") {
      payment.deleteCardData();
    }

    return this.paymentRepository.create(payment);
  }
}

