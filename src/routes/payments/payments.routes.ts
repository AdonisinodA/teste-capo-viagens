import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

// rotas de pagamentos
export default function paymentsRoutes(app:FastifyInstance){
    // Criar um pagamento
    app.withTypeProvider<ZodTypeProvider>().post('/', {
        schema:{
            response:{
                200: z.object({
                          message: z.string(),
                 }),
            }
        }
    }, async (request, reply) => {
    return reply.send({ message: 'Hello world!' })
  })


}