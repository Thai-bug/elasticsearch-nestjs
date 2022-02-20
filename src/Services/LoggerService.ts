import { ConsoleLogger } from '@nestjs/common';
import { getCurrentTime } from '@Utils/moment.utils';

export class MyLogger extends ConsoleLogger {
  log(message: string, optionalParams) {
    super.log(
      `[${getCurrentTime()}] ${message}`,
      JSON.stringify(optionalParams),
    );
  }

  error(message: string, trace: string, context: string) {
    super.error(`[${new Date().toISOString()}] ${message}`);
    super.error(trace);
  }

  warn(message: string, context: string) {
    super.warn(`[${new Date().toISOString()}] ${message}`);
  }
}
