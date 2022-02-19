import { Response } from '@nestjs/common';
export const response = (statusCode: number, message: string, data: any) => {
  return {
    statusCode,
    message,
    data,
  };
};
