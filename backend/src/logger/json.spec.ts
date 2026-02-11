import { JsonLogger } from './json';

function parseJsonLog(output: string): Record<string, any> {
  return JSON.parse(output);
}

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('должен формировать корректный JSON для log', () => {
    logger.log('Test message', 'TestContext');
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);

    const output = consoleLogSpy.mock.calls[0][0];
    const logEntry = parseJsonLog(output);

    expect(logEntry).toEqual({
      level: 'log',
      message: 'Test message',
      context: 'TestContext',
      timestamp: expect.any(String),
    });
  });

  it('должен включать trace в error', () => {
    logger.error('Error message', 'Stack trace', 'ErrorContext');

    // Проверяем вызов console.error
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    const output = consoleErrorSpy.mock.calls[0][0];
    const logEntry = parseJsonLog(output);

    expect(logEntry.trace).toBe('Stack trace');
    expect(logEntry.level).toBe('error');
    expect(logEntry.message).toBe('Error message');
    expect(logEntry.context).toBe('ErrorContext');
  });
});
