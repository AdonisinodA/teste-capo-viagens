import { CreatePaymentUseCase } from "../../../../application/useCases/payment/create-payment.useCase";
import { PaymentStatus } from "../../../../domain/payment/entities/payment.entity";
import { CreatePaymentInput } from "../../../../presentation/http/validations/payments/create-payment.validation";

const mockRepository = {
  create: jest.fn().mockResolvedValue({ insertId: 1 }),
};

const fakeBody: CreatePaymentInput = {
  method: "pix",
  amount: 150.5,
  buyer: {
    name: "João Silva",
    email: "joao.silva@example.com",
  },
  card: {
    encryptedData: "encryptedStringBase64",
  },
};

describe("CreatePaymentUseCase", () => {
  it("deve criar pagamento e retornar id e status", async () => {
    const useCase = new CreatePaymentUseCase(mockRepository as any);

    const result = await useCase.createPayment(fakeBody);

    expect(mockRepository.create).toHaveBeenCalled();
    expect(result).toHaveProperty("id", 1);
    expect(Object.values(PaymentStatus)).toContain(result.status);
  });
});

