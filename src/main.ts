import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { routes } from "./routes/routes";


const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Documentação',
      description: '',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})


// rotas do sistema
app.after(()=>{
  routes(app)
})


app
  .listen({ port: 3333 })
  .then(() => {
    console.log('Servidor rodando em http://localhost:3333')
  })