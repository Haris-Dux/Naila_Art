
class CustomError extends Error {
  status;
  message;
  cause;
  constructor(message,statusCode) {
    super(message);
    this.name = "CustomError";
    this.status = statusCode;
    this.cause = message;
  }
}

export default CustomError;
