export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
