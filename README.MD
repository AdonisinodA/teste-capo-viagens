# Como inicializar o Projeto

# Banco de Dados

## Tabelas

### payments

Armazena os pagamentos registrados.

| Coluna     | Tipo                           | Descrição                                                            |
| ---------- | ------------------------------ | -------------------------------------------------------------------- |
| id         | INT AUTO_INCREMENT PRIMARY KEY | Identificador do pagamento.                                          |
| type       | ENUM('PIX', 'CREDIT_CARD')     | Tipo de pagamento.                                                   |
| amount     | INT NOT NULL                   | Valor do pagamento multiplicado por 100. Exemplo: 1000.23 -> 100023. |
| card_data  | TEXT                           | Dados do cartão (criptografados).                                    |
| created_at | TIMESTAMP                      | Data/hora de criação.                                                |
| updated_at | TIMESTAMP                      | Data/hora da última atualização.                                     |

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

