import z from "zod";

export const paramsRefundPartialSchema = z.object({
  id: z.string(),
});

export const bodyRefundPartialSchema = z.object({
  amount: z.number().positive(),
});

export type BodyRefundPartialInput = z.infer<typeof bodyRefundPartialSchema>;

export type ParamsRefundPartialInput = z.infer<
  typeof paramsRefundPartialSchema
>;

