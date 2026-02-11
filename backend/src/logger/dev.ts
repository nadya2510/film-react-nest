import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {
  customLog(message: string) {
    this.log(`[Custom Message] ${message}`);
  }
}
