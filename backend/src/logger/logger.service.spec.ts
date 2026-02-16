import { ConfigService } from '@nestjs/config';
import { LoggerApp } from './logger.service';
import { DevLogger } from './dev';
import { JsonLogger } from './json';
import { TskvLogger } from './tskv';

describe('LoggerApp', () => {
  let configService: ConfigService;
  let loggerApp: LoggerApp;

  beforeEach(() => {
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockReturnValue('json');
  });

  it('должен использовать JsonLogger при LOG_FORMAT=json', () => {
    loggerApp = new LoggerApp(configService);
    expect(loggerApp.logger).toBeInstanceOf(JsonLogger);
  });

  it('должен использовать TskvLogger при LOG_FORMAT=tskv', () => {
    jest.spyOn(configService, 'get').mockReturnValue('tskv');
    loggerApp = new LoggerApp(configService);
    expect(loggerApp.logger).toBeInstanceOf(TskvLogger);
  });

  it('должен использовать DevLogger по умолчанию', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    loggerApp = new LoggerApp(configService);
    expect(loggerApp.logger).toBeInstanceOf(DevLogger);
  });
});
