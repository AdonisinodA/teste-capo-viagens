import { PaymentStatus } from "../entity/payment.entity";
import { typePayment } from "../enum/payment.enum";

export type PaymentRefundStatus = {
  id: number;
  payment_amount: number;
  total_refunded: number;
  remaining_amount: number;
  canADD: boolean;
};

export type Payment = {
  id: number;
  type: typePayment;
  status: PaymentStatus;
  buyer_name: string;
  buyer_email: string;
  amount: number;
  card_data: string;
  created_at: Date;
  updated_at: Date;
};
