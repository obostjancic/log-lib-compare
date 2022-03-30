import { performance } from 'perf_hooks';
import { LoggerConfig, LoggerInstance, LoggerWrapper } from './logger.base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export class LogRunner {
  private readonly loggerName: string;
  private readonly logger: LoggerInstance;

  constructor(
    wrapperClass: Constructor<LoggerWrapper>,
    private readonly config: LoggerConfig,
  ) {
    this.loggerName = wrapperClass.name;
    this.logger = new wrapperClass(config).getLogger();
  }

  public run() {
    const begin = performance.now();

    this.logLevels();
    this.logError();
    this.logObject();
    this.logArray();

    this.reportDuration(begin);
  }

  private logLevels() {
    // this.logger.trace('Calling foo'); - Winston doesnt support trace
    this.logger.debug(`Bar: ${1 + 2}, foo: ${'abc'}`);
    this.logger.info('Sever started successfully on port %d', 3000);
    this.logger.warn(
      'Environment is not set, this might lead to unexpected behaviour',
    );
    this.logger.error('Failed to start server, port is already in use');
  }

  private logError() {
    this.logger.error(new Error('Something went wrong'));
  }

  private logObject() {
    const obj = {
      foo: 'foo value',
      bar: {
        baz: 'baz value',
      },
    };
    this.logger.info(obj, 'Current value of obj: ');
  }

  private logArray() {
    this.logger.info(['foo', { bar: 'bar' }, 'baz'], 'Array: ');
  }

  private reportDuration(begin: number) {
    const delayMs = 100;
    setTimeout(
      () =>
        console.log(
          `${this.loggerName} - ${
            this.config.structured ? 'struct' : 'unstruct'
          } - Run took: ${(performance.now() - begin - delayMs).toFixed(2)}ms`,
        ),
      delayMs,
    );
  }
}
