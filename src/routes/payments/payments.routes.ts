import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPaymentSchema } from "../../schemas/payments/create-payment.schema";

// rotas de pagamentos
export default function paymentsRoutes(app:FastifyInstance){
    // Criar um pagamento
    app.withTypeProvider<ZodTypeProvider>().post('/', {
        schema:{
            body:createPaymentSchema,
            response:{
                201: z.object({
                     message: z.string(),
                 }),
            }
        }
    }, async (request, reply) => {
    return reply.send({ message: 'Hello world!' })
  })


}