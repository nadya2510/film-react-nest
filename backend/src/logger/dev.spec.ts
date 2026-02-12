import { ConsoleLogger } from '@nestjs/common';
import { DevLogger } from './dev';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
  });

  it('наследуется от класса — ConsoleLogger', () => {
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });
});
