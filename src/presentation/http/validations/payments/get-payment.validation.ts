import z, { email } from "zod";

export const getPaymentSchema = z.object({
  id: z.string(),
});

export const responseGetpaymentSchema = z.object({
  id: z.number().int(),
  type: z.enum(["pix", "credit_card"]),
  amount: z.number().int(),
  card_data: z.string().nullable(),
  card_data_decrypt: z
    .object({
      number: z.string(),
      cvv: z.string(),
      expirationDate: z.string(),
    })
    .optional(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.enum(["PENDING", "APPROVED", "DECLINED"]),
  buyer_name: z.string().max(255),
  buyer_email: z.email().max(255),
});

export type GetPaymentInput = z.infer<typeof getPaymentSchema>;

export type ResponseGetpayment = z.infer<typeof responseGetpaymentSchema>;

