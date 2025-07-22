import { FastifyInstance } from "fastify";
import paymentsRoutes from "./payments/payments.routes";

// Estrtura que facilita a adição de novas rotas
export function routes(app: FastifyInstance) {
  app.register(paymentsRoutes, { prefix: "/payments" });
}

