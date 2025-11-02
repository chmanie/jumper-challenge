import { z } from 'zod';

export enum ResponseStatus {
  Success,
  Failed,
}

export class ServiceResponse<T = null> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;

  constructor(status: ResponseStatus, message: string, responseObject: T, statusCode: number) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T, statusCode: number) => {
  const isSuccess = statusCode >= 200 && statusCode < 300;
  return z.object({
    success: isSuccess ? z.literal(true) : z.literal(false),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.literal(statusCode),
  });
};
