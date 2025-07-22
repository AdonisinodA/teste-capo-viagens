import { GetPaymentUseCase } from "../../../../application/useCases/payment/get-payment.useCase";
import { PaymentEntity } from "../../../../domain/payment/entities/payment.entity";

const mockRepository = {
  getByID: jest.fn(),
};

describe("GetPaymentUseCase", () => {
  it("retorna o pagamento se existir", async () => {
    const fakePayment = {} as PaymentEntity;
    mockRepository.getByID.mockResolvedValue(fakePayment);

    const useCase = new GetPaymentUseCase(mockRepository as any);

    const result = await useCase.execute("123");

    expect(result).toBe(fakePayment);
    expect(mockRepository.getByID).toHaveBeenCalledWith("123");
  });

  it("lança erro se pagamento não encontrado", async () => {
    mockRepository.getByID.mockResolvedValue(undefined);

    const useCase = new GetPaymentUseCase(mockRepository as any);

    await expect(useCase.execute("not-found")).rejects.toThrow(
      "Pagamento não encontrado."
    );
  });
});

