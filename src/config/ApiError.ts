export class HttpException extends Error {
  message: string;
  statusCode: number;
  type: string;

  constructor(
    message: string,
    statusCode: number = 500,
    type: string = "HttpException"
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, 400, "BadRequestException");
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, 404, "NotFoundException");
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, 401, "UnauthorizedException");
  }
}

export const exceptions = {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
};
