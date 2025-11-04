import { Response } from 'express';
import { setGlobalErrorHandler } from 'express-zod-safe';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

setGlobalErrorHandler((errors, req, res) => {
  const errorMessages = errors
    .map((e) => e.errors.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '))
    .join('\n');

  const errorMessage = `Invalid input: ${errorMessages}`;
  const statusCode = StatusCodes.BAD_REQUEST;
  res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
});
