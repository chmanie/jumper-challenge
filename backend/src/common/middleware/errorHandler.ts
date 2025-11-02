import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '../models/serviceResponse';
import { handleServiceResponse } from '../utils/httpHandlers';

export const unexpectedRequest: RequestHandler = (_req, res) => {
  const serviceResponse = new ServiceResponse(ResponseStatus.Failed, 'Not found', null, StatusCodes.NOT_FOUND);
  handleServiceResponse(serviceResponse, res);
};

export const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

// express needs the _next argument to determine the middleware type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const defaultErrorResponse: ErrorRequestHandler = (_err, _req, res, _next) => {
  const serviceResponse = new ServiceResponse(
    ResponseStatus.Failed,
    'Internal Server Error',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
  handleServiceResponse(serviceResponse, res);
};
