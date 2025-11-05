import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isAddress } from 'viem';

import { ResponseStatus, ServiceResponse } from '../../common/models/serviceResponse';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { logger } from '../../server';
import { verifyJWT } from './authHelpers';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization) {
    const tokenMatch = req.headers.authorization.match(/^Bearer\s(.+)$/);
    if (tokenMatch) {
      token = tokenMatch[1];
    }
  }

  if (!token) {
    const serviceResponse = new ServiceResponse(ResponseStatus.Failed, 'Unauthorized', null, StatusCodes.UNAUTHORIZED);
    handleServiceResponse(serviceResponse, res);
    return;
  }
  try {
    const { payload } = await verifyJWT(token);
    const { address } = payload;
    if (!isAddress(address)) {
      logger.error({ context: 'authentication' }, 'Wrong token payload');
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Unauthorized',
        null,
        StatusCodes.UNAUTHORIZED
      );
      handleServiceResponse(serviceResponse, res);
    }
    req.user = { address: payload.address };
    next();
  } catch (error) {
    logger.error({ error, context: 'authentication' }, 'Authorization failed');
    const serviceResponse = new ServiceResponse(ResponseStatus.Failed, 'Unauthorized', null, StatusCodes.UNAUTHORIZED);
    handleServiceResponse(serviceResponse, res);
  }
};
