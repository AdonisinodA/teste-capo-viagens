import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PaymentEntity } from "../../../../domain/payment/entity/payment.entity";
import { TPool } from "../../../../types/global";
import { ResponseGetpayment } from "../../../../presentation/http/validations/payments/get-payment.validation";
import {
  Payment,
  PaymentRefundStatus,
} from "../../../../domain/payment/types/payment.types";

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

  async getByID(id: string): Promise<Payment> {
    const query = "SELECT * FROM payments WHERE id = ?";

    const [[result]] = await this.connection.query<
      (Payment & RowDataPacket[])[]
    >(query, [id]);

    return result;
  }

  async canAddRefunt(
    payment_id: string,
    amountRefund: number
  ): Promise<PaymentRefundStatus> {
    const query = `SELECT
      p.id,
      p.amount AS payment_amount,
      COALESCE(SUM(r.amount), 0) AS total_refunded,
      (p.amount - COALESCE(SUM(r.amount), 0)) AS remaining_amount,
      CASE WHEN (p.amount - COALESCE(SUM(r.amount), 0)) >= ? THEN TRUE ELSE FALSE END AS canADD
      FROM payments p
      LEFT JOIN refunds r ON r.payment_id = p.id
      WHERE p.id = ?
      GROUP BY p.id, p.amount
  `;
    const [[result]] = await this.connection.query<
      (PaymentRefundStatus & RowDataPacket[])[]
    >(query, [amountRefund, payment_id]);

    return result;
  }

  async getInfoRefund(payment_id: string): Promise<PaymentRefundStatus> {
    const query = `SELECT
      p.id,
      p.amount AS payment_amount,
      COALESCE(SUM(r.amount), 0) AS total_refunded,
      (p.amount - COALESCE(SUM(r.amount), 0)) AS remaining_amount
      FROM payments p
      LEFT JOIN refunds r ON r.payment_id = p.id
      WHERE p.id = ?
      GROUP BY p.id, p.amount
  `;
    const [[result]] = await this.connection.query<
      (PaymentRefundStatus & RowDataPacket[])[]
    >(query, [payment_id]);

    return result;
  }
}

