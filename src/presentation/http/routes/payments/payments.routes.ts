import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPaymentSchema } from "../../validations/payments/create-payment.validation";
import {
  getPaymentSchema,
  responseGetpaymentSchema,
} from "../../validations/payments/get-payment.validation";
import createPaymentController from "../../controllers/payment/create-payment.controller";
import getPaymentController from "../../controllers/payment/get-payment.controller";
import {
  bodyRefundPartialSchema,
  paramsRefundPartialSchema,
} from "../../validations/payments/refund-partial.validation";
import refundPartialController from "../../controllers/payment/refund-partial.payment.controller";

// rotas de pagamentos
export default function paymentsRoutes(app: FastifyInstance) {
  // Criar um pagamento
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: createPaymentSchema,
        response: {
          201: z.object({
            message: z.object({
              id: z.number(),
              status: z.enum(["PENDING", "APPROVED", "DECLINED"]),
              message: z.string(),
            }),
          }),
        },
      },
    },
    createPaymentController.execute
  );

  // Buscar Pagamento
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        params: getPaymentSchema,
        response: {
          200: z.object({
            message: z.object({
              result: responseGetpaymentSchema,
            }),
          }),
        },
      },
    },
    getPaymentController.execute
  );

  // Buscar Pagamento
  app.withTypeProvider<ZodTypeProvider>().post(
    "/:id/refund-partial",
    {
      schema: {
        body: bodyRefundPartialSchema,
        params: paramsRefundPartialSchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    refundPartialController.execute
  );
}

