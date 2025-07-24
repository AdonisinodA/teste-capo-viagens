// tests/payments-routes.test.ts
import request from "supertest";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import paymentsRoutes from "../../../../../presentation/http/routes/payments/payments.routes";
import { createPaymentSchema } from "../../../../../presentation/http/validations/payments/create-payment.validation";

let app = Fastify().withTypeProvider<ZodTypeProvider>();
const prefixRoute = "/payments";

beforeAll(async () => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(paymentsRoutes, { prefix: prefixRoute });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe(`POST ${prefixRoute}`, () => {
  it("cria um pagamento", async () => {
    console.log("entrou");
    const res = await request(app.server)
      .post(prefixRoute)
      .send(
        createPaymentSchema.parse({
          method: "credit_card",
          amount: 199.0,
          card: {
            encryptedData:
              "ewogICJudW1iZXIiOiAiNDExMTExMTExMTExMTExMSIsCiAgImN2diI6ICI0NTYiLAogICJleHBpcmF0aW9uRGF0ZSI6ICIwMy8yNyIKfQ==",
          },
          buyer: {
            name: "João Silva",
            email: "joao.silva@example.com",
          },
        })
      );

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toHaveProperty("id");
  });
});

describe(`GET ${prefixRoute}/:id`, () => {
  it("busca pagamento por id", async () => {
    const { body } = await request(app.server)
      .post(prefixRoute)
      .send({
        method: "credit_card",
        amount: 199.0,
        card: {
          encryptedData:
            "ewogICJudW1iZXIiOiAiNDExMTExMTExMTExMTExMSIsCiAgImN2diI6ICI0NTYiLAogICJleHBpcmF0aW9uRGF0ZSI6ICIwMy8yNyIKfQ==",
        },
        buyer: {
          name: "João Silva",
          email: "joao.silva@example.com",
        },
      });

    const id = body.message.id;

    const res = await request(app.server).get(`${prefixRoute}/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message.result).toHaveProperty("id", id);
  });
});

describe(`POST ${prefixRoute}/:id/refund-partial`, () => {
  it("faz reembolso parcial", async () => {
    const { body } = await request(app.server)
      .post(prefixRoute)
      .send({
        method: "pix",
        amount: 199.0,
        buyer: {
          name: "João Silva",
          email: "joao.silva@example.com",
        },
      });

    const id = body.message.id;

    const res = await request(app.server)
      .post(`${prefixRoute}/${id}/refund-partial`)
      .send({ amount: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});

describe(`POST ${prefixRoute}/refund`, () => {
  it("faz reembolso total", async () => {
    const { body } = await request(app.server)
      .post(prefixRoute)
      .send({
        method: "pix",
        amount: 199.0,
        buyer: {
          name: "João Silva",
          email: "joao.silva@example.com",
        },
      });

    const id = body.message.id;

    const res = await request(app.server)
      .post(`${prefixRoute}/refund`)
      .send({ payment_id: id });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});

