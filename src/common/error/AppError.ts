import { CustomError } from "./CustomError";

export default function AppError(
  message: string,
  statusCode = 400,
  messagePersists: boolean = false
) {
  throw new CustomError(message, statusCode, messagePersists);
}

