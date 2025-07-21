import { z } from "zod";

export const createPaymentSchema = z.object({
  method: z.enum(["pix", "credit_card"]),
  amount: z.number().positive(),
  card: z
    .object({
      encryptedData: z.string(),
    })
    .optional(),
  buyer: z.object({
    name: z.string(),
    email: z.email(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export const refundPartialSchema = z.object({
  amount: z.number().positive(),
});
