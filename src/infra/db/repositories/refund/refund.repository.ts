import { ResultSetHeader, RowDataPacket } from "mysql2";
import { RefundEntity } from "../../../../domain/refund/entity/refund.entity";
import { TPool } from "../../../../types/global";

export class RefundRepository {
  constructor(private readonly connection: TPool) {}
  async create(refund: RefundEntity) {
    const query = `INSERT INTO refunds SET ?`;

    const [result] = (await this.connection.query(
      query,
      refund
    )) as ResultSetHeader[];

    return result;
  }

  async getByPaymentID(payment_id: string) {
    const query = "SELECT * FROM WHERE payment_id = ?";

    const [[result]] = await this.connection.query<({} & RowDataPacket[])[]>(
      query,
      [payment_id]
    );

    return result;
  }
}

