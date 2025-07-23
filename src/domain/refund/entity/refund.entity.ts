import { typeRefund } from "../enum/refund.enum";

export class RefundEntity {
  constructor(
    public readonly payment_id: string,
    public readonly amount: number,
    public readonly refund_type: typeRefund
  ) {
    this.amount = amount * 100;
  }
}

