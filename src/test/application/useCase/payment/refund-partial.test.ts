import { RefundPartialUseCase } from "../../../../application/useCases/refund/refund-partial.useCase";
import { RefundEntity } from "../../../../domain/refund/entity/refund.entity";
import { PaymentRepository } from "../../../../infra/db/repositories/payment/payment.repository";
import { RefundRepository } from "../../../../infra/db/repositories/refund/refund.repository";
import { FakePaymentGateway } from "../../../../infra/gateways/fakePayment.gateway";

describe("RefundPartialUseCase", () => {
  const mockPaymentRepository = {
    getByID: jest.fn(),
  } as unknown as PaymentRepository;

  const mockRefundRepository = {
    create: jest.fn(),
  } as unknown as RefundRepository;

  const mockPaymentGateway = {
    refund: jest.fn(),
  } as unknown as FakePaymentGateway;

  const useCase = new RefundPartialUseCase(
    mockRefundRepository,
    mockPaymentRepository,
    mockPaymentGateway
  );

  it("deve lançar erro se pagamento não existir", async () => {
    mockPaymentRepository.getByID = jest.fn().mockResolvedValue(null);

    await expect(useCase.execute("fake-id", 500)).rejects.toThrow(
      "Pagamento não encontrado."
    );
  });

  it("deve lançar erro se pagamento estiver declinado", async () => {
    mockPaymentRepository.getByID = jest
      .fn()
      .mockResolvedValue({ status: "DECLINED" });

    await expect(useCase.execute("fake-id", 500)).rejects.toThrow(
      "Este pagamento não foi aprovado e por isso não pode ser reembolsado."
    );
  });

  it("deve lançar erro se gateway não permitir refund mesmo com valor restante", async () => {
    mockPaymentRepository.getByID = jest
      .fn()
      .mockResolvedValue({ status: "APPROVED", id: "fake-id" });

    mockPaymentGateway.refund = jest.fn().mockResolvedValue({
      canADD: false,
      remaining_amount: 300,
    });

    await expect(useCase.execute("fake-id", 1000)).rejects.toThrow(
      "Só é possível reembolsar até R$:3."
    );
  });

  it("deve lançar erro se gateway não permitir refund e não houver valor restante", async () => {
    mockPaymentRepository.getByID = jest
      .fn()
      .mockResolvedValue({ status: "APPROVED", id: "fake-id" });

    mockPaymentGateway.refund = jest.fn().mockResolvedValue({
      canADD: false,
      remaining_amount: 0,
    });

    await expect(useCase.execute("fake-id", 1000)).rejects.toThrow(
      "Não é possível reembolsar este pagamento."
    );
  });

  it("deve criar o refund se tudo estiver correto", async () => {
    mockPaymentRepository.getByID = jest
      .fn()
      .mockResolvedValue({ status: "APPROVED", id: "fake-id", amount: 1000 });

    mockPaymentGateway.refund = jest.fn().mockResolvedValue({
      canADD: true,
      remaining_amount: 10000,
    });

    const createSpy = jest.spyOn(mockRefundRepository, "create");

    await useCase.execute("fake-id", 1000);

    expect(createSpy).toHaveBeenCalledWith(expect.any(RefundEntity));
  });
});

