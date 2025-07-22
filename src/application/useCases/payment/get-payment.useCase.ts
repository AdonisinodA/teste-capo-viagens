import AppError from "../../../common/error/AppError";
import { paymentRepository } from "../../../infra/db/repositories/payments/payment.repository";

export class GetPaymentUseCase {
  constructor(private readonly paymentRepository: paymentRepository) {}

  async execute(id: number) {
    const payment = await this.paymentRepository.getByID(id);

    if (!payment) {
      AppError("Pagamento não encontrado.", 404);
    }

    return payment;
  }
}

