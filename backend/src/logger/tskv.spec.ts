import { TskvLogger } from './tskv';

function parseTskvLog(output: string): Record<string, string> {
  return Object.fromEntries(
    output
      .trim()
      .split('\t')
      .map((pair) => pair.split('=', 2)),
  );
}

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('должен формировать TSKV для log', () => {
    logger.log('Message', 'Context');

    // Получаем первый аргумент первого вызова console.log
    const output = consoleLogSpy.mock.calls[0][0];
    const fields = parseTskvLog(output);

    expect(fields).toEqual({
      level: 'log',
      message: 'Message',
      context: 'Context',
      timestamp: expect.any(String),
    });
  });

  it('должен добавлять trace в error', () => {
    logger.error('Error', 'Trace', 'Context');

    const output = consoleLogSpy.mock.calls[0][0];
    const fields = parseTskvLog(output);

    expect(fields.trace).toBe('Trace');
  });

  it('должен обрабатывать null как пустую строку', () => {
    logger.log(null, 'Context');

    const output = consoleLogSpy.mock.calls[0][0];
    const fields = parseTskvLog(output);

    expect(fields.message).toBe('');
  });
});
