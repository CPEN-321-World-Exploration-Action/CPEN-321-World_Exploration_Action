export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends HttpError {
  constructor(message) {
    super(message, 400);
  }
}
