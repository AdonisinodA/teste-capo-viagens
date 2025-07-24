# Checklist

- [x] Clean Architecture
- [x] Validação com Zod
- [x] Documentação Swagger automática
- [x] Criptografia simulada (fakeEncrypt/fakeDecrypt)
- [x] Testes unitários para cada rota/caso de uso

# Estrutura de Pastas

```bash
src/
│
├── 📂 application      # Casos de uso (UseCases) e regras da aplicação
├── 📂 common           # Utilitários, helpers, classes de erro etc.
├── 📂 config           # Configurações globais
├── 📂 domain           # Entidades e regras de domínio
├── 📂 infra            # Implementações externas (DB, APIs, etc.)
├── 📂 presentation     # Camada HTTP (controllers, rotas, validações)
├── 📂 scripts          # Scripts auxiliares
├── 📂 test             # Testes unitários
├── 📂 types            # Tipagens globais
└── 📄 main.ts          # Ponto de entrada da aplicação

```

# Como inicializar o Projeto

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

No banco de dados, optei por criar duas tabelas (**payments** e **refunds**) por uma questão de boa prática de normalização. Mesmo que o cenário não seja real, separar os dados permite armazenar informações importantes, como o valor e a data de cada reembolso realizado, facilitando consultas e mantendo o histórico organizado.

## Tabelas

### payments

Armazena os pagamentos registrados.

| Coluna      | Tipo                                    | Descrição                                                            |
| ----------- | --------------------------------------- | -------------------------------------------------------------------- |
| id          | INT AUTO_INCREMENT PRIMARY KEY          | Identificador do pagamento.                                          |
| type        | ENUM('pix', 'credit_card')              | Tipo de pagamento.                                                   |
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
| refund_type | ENUM('total', 'partial')       | Tipo do estorno (total ou parcial).                               |
| created_at  | TIMESTAMP                      | Data/hora de criação.                                             |
| updated_at  | TIMESTAMP                      | Data/hora da última atualização.                                  |

- Chave estrangeira: `payment_id` referencia `payments(id)`.

---

### Observações

- Valores monetários são armazenados como **inteiros multiplicados por 100** para evitar problemas de arredondamento.

# Observação na rota de criar pagamento (CRIPTOGRAFIA)

## Rota: `POST /payments`

### Descrição

Esta rota cria um pagamento. O payload da requisição deve seguir o schema abaixo.

### Payload esperado

```json
{
  "method": "pix" | "credit_card",
  "amount": number (positivo),
  "card": { "encryptedData": string } (opcional, obrigatório para credit_card),
  "buyer": {
    "name": string,
    "email": string (formato válido)
  }
}
```

### Campo `card.encryptedData`

Para encriptar no lado cliente eu tinha duas alternativas em mente, criar uma função para encriptar os dados com uma **chave pública** e manter uma **chave privada** no servidor ou o base64, optei pelo o base64 pois acredito que facilitaria no teste

Contém os dados do cartão em formato **Base64**

Para converter JSON para Base64 use esta ferramenta:
https://codebeautify.org/json-to-base64-converter

Exemplo JSON esperado em base64:

```json
{
  "number": "4111111111111111",
  "cvv": "456",
  "expirationDate": "03/27"
}
```

Em `infra/crypto` possui os métodos de encriptar e desencriptar fake, em um cenário real optaria por **chave pública/privada**

