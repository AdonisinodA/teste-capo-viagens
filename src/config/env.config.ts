import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// criando um schema para validar as variáveis de ambiente
const envSchema = z.object({
  ENCRYPTION_KEY: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
});

// faz o parse das variáveis de ambiente e valida com o schema
const _env = envSchema.safeParse(process.env);

// se a validação falhar, exibe o erro e encerra o processo
if (!_env.success) {
  console.error(".ENV inválido:", _env.error.issues);
  process.exit(1);
}

export const env = _env.data;
