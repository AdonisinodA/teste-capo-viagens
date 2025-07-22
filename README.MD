# Como inicializar o Projeto

## Como rodar o projeto

1. **Pré-requisitos**
   - Node.js 18+
   - Yarn ou npm
   - Docker

2. **Subindo o banco de dados**

   ```bash
   docker-compose up -d
   ```

   - Aguarde o MySQL inicializar.
   - As tabelas do banco são criadas ao inicializar a aplicação no passo (5), mas também é possível executar o script a parte caso deseje com:
     `npx tsx src/scripts/db/createTables.script.ts createtables`

3. **Instalação**

   ```bash
   yarn install
   # ou
   npm install
   ```

4. **Configuração**
   - Crie o arquivo `.env` e preencha as variáveis necessárias:
     ```
     ENCRYPTION_KEY=chave-secreta
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=user
     DB_PASSWORD=password
     DB_DATABASE=payments
     ```

5. **Rodando o servidor**

   ```bash
   yarn start
   # ou
   npm start
   ```

6. **Acessando a documentação**
   - Acesse `http://localhost:3000/docs` para visualizar o Swagger.

7. **Rodando os testes**
   ```bash
   yarn test
   # ou
   npm test
   ```

# Banco de Dados

## Tabelas

### payments

Armazena os pagamentos registrados.

| Coluna      | Tipo                                    | Descrição                                                            |
| ----------- | --------------------------------------- | -------------------------------------------------------------------- |
| id          | INT AUTO_INCREMENT PRIMARY KEY          | Identificador do pagamento.                                          |
| type        | ENUM('PIX', 'CREDIT_CARD')              | Tipo de pagamento.                                                   |
| amount      | INT NOT NULL                            | Valor do pagamento multiplicado por 100. Exemplo: 1000.23 -> 100023. |
| card_data   | TEXT                                    | Dados do cartão (criptografados).                                    |
| type        | ENUM('PENDING', 'APPROVED', 'DECLINED') | status do pagamento.                                                 |
| buyer_name  | VARCHAR(255)                            | Nome do comprador.                                                   |
| buyer_email | VARCHAR(255)                            | Email do pagador.                                                    |
| created_at  | TIMESTAMP                               | Data/hora de criação.                                                |
| updated_at  | TIMESTAMP                               | Data/hora da última atualização.                                     |

---

### refunds

Armazena os estornos/refunds realizados.

| Coluna      | Tipo                           | Descrição                                                         |
| ----------- | ------------------------------ | ----------------------------------------------------------------- |
| id          | INT AUTO_INCREMENT PRIMARY KEY | Identificador do refund.                                          |
| payment_id  | INT NOT NULL                   | ID do pagamento associado.                                        |
| amount      | INT NOT NULL                   | Valor do refund multiplicado por 100. Exemplo: 1000.23 -> 100023. |
| refund_type | ENUM('TOTAL', 'PARTIAL')       | Tipo do estorno (total ou parcial).                               |
| created_at  | TIMESTAMP                      | Data/hora de criação.                                             |
| updated_at  | TIMESTAMP                      | Data/hora da última atualização.                                  |

- Chave estrangeira: `payment_id` referencia `payments(id)`.

---

## Observações

- Valores monetários são armazenados como **inteiros multiplicados por 100** para evitar problemas de arredondamento.
- Campos `created_at` e `updated_at` facilitam rastrear alterações.
- Não existe total reembolsado armazenado diretamente. Deve ser calculado somando os `amount` na tabela `refunds` para cada `payment_id`.

