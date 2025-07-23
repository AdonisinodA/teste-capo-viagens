import z from "zod";

export const refundTotalSchema = z.object({
  payment_id: z.number().positive(),
});

export type BodyRefundTotalInput = z.infer<typeof refundTotalSchema>;

