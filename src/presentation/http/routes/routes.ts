import { FastifyInstance } from "fastify";
import paymentsRoutes from "./payments/payments.routes";

// Estrutura que facilita a adição de novas rotas
export function routes(app: FastifyInstance) {
  app.register(paymentsRoutes, { prefix: "/payments" });

  app.setErrorHandler((error, request, reply) => {
    console.log("🚀 ~ app.setErrorHandler ~ error:", error);
    if (error.statusCode === 500 || !error.statusCode) {
      reply.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    reply.status(error.statusCode!).send({
      message: error.message,
    });
  });
}

