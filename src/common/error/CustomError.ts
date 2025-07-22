export class CustomError extends Error {
  public message: string;

  public statusCode: number;

  public messagePersists: boolean;

  constructor(
    message: string,
    statusCode = 400,
    messagePersists: boolean = false
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.messagePersists = messagePersists; // para prevenir erro 500 ter sua mensagem substituída
  }

  toString() {
    return `Message: ${this.message}
            stack:${this.stack}
            statusCode:${this.statusCode}`;
  }
}

