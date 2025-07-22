import { QueryResult, ResultSetHeader } from "mysql2";
import { PaymentEntity } from "../../../../domain/payment/entities/payment.entity";
import { TPool } from "../../../../types/global";

export class paymentRepository {
  constructor(private readonly connection: TPool) {}

  async create(payment: PaymentEntity): Promise<ResultSetHeader> {
    const query = "INSERT INTO payments SET ?";

    const [result] = (await this.connection.query(
      query,
      payment
    )) as ResultSetHeader[];

    return result;
  }

  async getByID(id: number): Promise<QueryResult> {
    const query = "SELECT * payments WHERE id = ?";

    const [result] = await this.connection.query(query, id);

    return result;
  }
}

