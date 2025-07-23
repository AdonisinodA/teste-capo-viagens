import { typePayment } from "../enum/payment.enum";

export type PaymentMethod = "pix" | "credit_card";
export type buyer = { name: string; email: string };
export type card = {
  number: string;
  cvv: string;
  expirationDate: string;
};
export const PaymentStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export class PaymentEntity {
  constructor(
    public readonly type: PaymentMethod,
    public readonly amount: number,
    public readonly buyer_name?: buyer["name"],
    public readonly buyer_email?: buyer["email"],
    public card_data?: string,
    public status: PaymentStatus = "PENDING"
  ) {
    this.amount = amount * 100;
  }

  public deleteCardData() {
    delete this.card_data;
  }
}

