import AppError from "../../../common/error/AppError";
import { PaymentRepository } from "../../../infra/db/repositories/payment/payment.repository";

export class GetPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(id: string) {
    const payment = await this.paymentRepository.getByID(id);

    if (!payment) {
      AppError("Pagamento não encontrado.", 404);
    }

    return payment;
  }
}

