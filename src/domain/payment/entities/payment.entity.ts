export type PaymentMethod = "pix" | "credit_card";
export type buyer = { name: string; email: string };
export type card = {
  number: string;
  cvv: string;
  expirationDate: string;
};

export class PaymentEntity {
  constructor(
    public readonly method: PaymentMethod,
    public readonly amount: number,
    public readonly buyer: buyer,
    public card?: { encryptedData: string }
  ) {}

  public validateCardData(card: card): boolean {
    if (!card.number.match(/^\d{13,19}$/)) {
      throw new Error("Número do cartão inválido");
    }

    if (!card.cvv.match(/^\d{3,4}$/)) {
      throw new Error("CVV inválido");
    }

    if (!card.expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      throw new Error("Data de expiração inválida (MM/AA)");
    }

    const [mes, ano] = card.expirationDate.split("/").map(Number);
    const agora = new Date();
    const expiracao = new Date(2000 + ano, mes - 1, 1);

    if (expiracao < new Date(agora.getFullYear(), agora.getMonth(), 1)) {
      throw new Error("Cartão expirado");
    }

    return true;
  }

  public deleteCardData() {
    delete this.card;
  }
}

