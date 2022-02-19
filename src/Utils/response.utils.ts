import { HttpException } from '@nestjs/common';

export const response = (statusCode: number, message: string, result: any) => {
  throw new HttpException(
    {
      statusCode,
      message,
      result,
    },
    statusCode,
  );
};
