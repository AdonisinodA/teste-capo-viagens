import { RefundTotalUseCase } from "../../../../application/useCases/refund/refund-total.useCase";
import { RefundEntity } from "../../../../domain/refund/entity/refund.entity";
import { PaymentRepository } from "../../../../infra/db/repositories/payment/payment.repository";
import { RefundRepository } from "../../../../infra/db/repositories/refund/refund.repository";
import { FakePaymentGateway } from "../../../../infra/gateways/fakePayment.gateway";

describe("RefundTotalUseCase", () => {
  const mockPaymentRepository = {
    getByID: jest.fn(),
  } as unknown as PaymentRepository;

  const mockRefundRepository = {
    create: jest.fn(),
  } as unknown as RefundRepository;

  const mockPaymentGateway = {
    refund: jest.fn(),
  } as unknown as FakePaymentGateway;

  const useCase = new RefundTotalUseCase(
    mockRefundRepository,
    mockPaymentRepository,
    mockPaymentGateway
  );

  it("deve lançar erro se pagamento não existir", async () => {
    mockPaymentRepository.getByID = jest.fn().mockResolvedValue(null);

    await expect(useCase.execute("fake-id")).rejects.toThrow(
      "Pagamento não encontrado."
    );
  });

  it("deve lançar erro se pagamento estiver declinado", async () => {
    mockPaymentRepository.getByID = jest
      .fn()
      .mockResolvedValue({ status: "DECLINED" });

    await expect(useCase.execute("fake-id")).rejects.toThrow(
      "Este pagamento não foi aprovado e por isso não pode ser reembolsado."
    );
  });

  it("deve lançar erro se não houver valor restante a reembolsar", async () => {
    mockPaymentRepository.getByID = jest.fn().mockResolvedValue({
      id: "fake-id",
      status: "APPROVED",
      amount: 1000,
    });

    mockPaymentGateway.refund = jest.fn().mockResolvedValue({
      canADD: false,
      remaining_amount: 0,
    });

    await expect(useCase.execute("fake-id")).rejects.toThrow(
      "Não é possível reembolsar este pagamento."
    );
  });

  it("deve criar refund total se tudo estiver correto", async () => {
    mockPaymentRepository.getByID = jest.fn().mockResolvedValue({
      id: "fake-id",
      status: "APPROVED",
      amount: 1000,
    });

    mockPaymentGateway.refund = jest.fn().mockResolvedValue({
      canADD: true,
      remaining_amount: 1000,
    });

    const createSpy = jest.spyOn(mockRefundRepository, "create");

    await useCase.execute("fake-id");

    expect(createSpy).toHaveBeenCalledWith(expect.any(RefundEntity));
  });
});

