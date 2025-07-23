import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PaymentEntity } from "../../../../domain/payment/entity/payment.entity";
import { TPool } from "../../../../types/global";
import { ResponseGetpayment } from "../../../../presentation/http/validations/payments/get-payment.validation";

export class PaymentRepository {
  constructor(private readonly connection: TPool) {}

  async create(payment: PaymentEntity): Promise<ResultSetHeader> {
    const query = "INSERT INTO payments SET ?";

    const [result] = (await this.connection.query(
      query,
      payment
    )) as ResultSetHeader[];

    return result;
  }

  async getByID(id: string): Promise<ResponseGetpayment> {
    const query = "SELECT * FROM payments WHERE id = ?";

    const [[result]] = await this.connection.query<
      (ResponseGetpayment & RowDataPacket[])[]
    >(query, [id]);

    return result;
  }
}

