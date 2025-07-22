// resolvi usar o base64 como criptografia fake, pois, facilita para teste no lado cliente
// não é uma criptografia real, apenas para fins de demonstração
export class CryptoService {
  static encrypt(text: string): string {
    return Buffer.from(text, "utf8").toString("base64");
  }

  static decrypt(encoded: string): string {
    return Buffer.from(encoded, "base64").toString("utf8");
  }
}

