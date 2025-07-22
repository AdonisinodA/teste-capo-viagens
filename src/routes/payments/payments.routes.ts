import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPaymentSchema } from "../../schemas/payments/create-payment.schema";
import { CreatePaymentUseCase } from "../../useCases/payments/create-payment.useCase";
import { paymentRepository } from "../../infrastructure/db/respositories/payments/payment.repository";
import pool from "../../infrastructure/db/db.infra";

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
              message: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { body } = request;

      const paymenteRepository = new paymentRepository(pool);
      const createPaymentUseCase = new CreatePaymentUseCase(paymenteRepository);

      const result = await createPaymentUseCase.createPayment(body);

      return reply.send({
        message: {
          id: result.insertId,
          message: "Pagamento realizado com sucesso",
        },
      });
    }
  );
}

