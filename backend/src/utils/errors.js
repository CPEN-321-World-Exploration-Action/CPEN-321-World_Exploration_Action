export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends HttpError {
  constructor(message, status = 400) {
    super(message, status);
  }
}

export class NotFoundError extends BadRequestError {
  constructor(message, status = 404) {
    super(message, status);
  }
}

export class UnauthorizedError extends BadRequestError {
  constructor(message, status = 401) {
    super(message, status);
  }
}
