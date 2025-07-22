import z from "zod";

export const getPaymentSchema = z.object({
  id: z.string(),
});

export const responseGetpaymentSchema = z.object({
  id: z.number().int(),
  type: z.enum(["PIX", "CREDIT_CARD"]),
  amount: z.number().int(),
  card_data: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.enum(["PENDING", "APPROVED", "DECLINED"]),
  buyer_name: z.string().max(255),
  buyer_email: z.email().max(255),
});

export type GetPaymentInput = z.infer<typeof getPaymentSchema>;

export type ResponseGetpayment = z.infer<typeof responseGetpaymentSchema>;

