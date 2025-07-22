import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPaymentSchema } from "../../validations/payments/create-payment.validation";
import paymentController from "../../controllers/payment/create-payment.controller";

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
    paymentController.create
  );
}

