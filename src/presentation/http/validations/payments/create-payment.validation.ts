import { z } from "zod";
import AppError from "../../../../common/error/AppError";
import { card } from "../../../../domain/payment/entity/payment.entity";
const cardSchema = z.object({
  number: z.string(),
  cvv: z.string(),
  expirationDate: z.string(),
});

export const createPaymentSchema = z
  .object({
    method: z.enum(["pix", "credit_card"]),
    amount: z.number().positive(),
    card: z
      .object({
        encryptedData: z.string(),
      })
      .optional(),
    buyer: z.object({
      name: z.string().min(5).max(255),
      email: z.email(),
    }),
  })
  .refine(
    (data) => {
      if (data.method === "credit_card") {
        return !!data.card;
      }
      return true;
    },
    {
      message: "Dados do cartão obrigatórios para método credit_card",
      path: ["card"],
    }
  );

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export class CreatePaymentValidation {
  validStringifyCard(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      cardSchema.parse(parsed);
      return true;
    } catch {
      return false;
    }
  }

  validateCardData(card: card): boolean {
    if (!card.number.match(/^\d{13,19}$/)) {
      AppError("Número do cartão inválido");
    }

    if (!card.cvv.match(/^\d{3,4}$/)) {
      AppError("CVV inválido");
    }

    if (!card.expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      AppError("Data de expiração inválida (MM/AA)");
    }

    const [mes, ano] = card.expirationDate.split("/").map(Number);
    const agora = new Date();
    const expiracao = new Date(2000 + ano, mes - 1, 1);

    if (expiracao < new Date(agora.getFullYear(), agora.getMonth(), 1)) {
      AppError("Cartão expirado");
    }

    return true;
  }
}

