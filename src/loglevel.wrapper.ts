import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
import { LoggerConfig, LoggerInstance } from './logger.base';

export class LogLevelWrapper {
  private readonly rootNamespace = 'ROOT';
  private loggerInstance?: loglevel.Logger;

  public init(config: LoggerConfig) {
    this.loggerInstance = loglevel.getLogger(this.getName(config));
    this.loggerInstance.setLevel(config.level || 'info');

    if (config.structured || config.logFile) {
      throw new Error(
        'Structured logging is not supported, file logging is supported through an unmaintained plugin only.',
      );
    }

    prefix.reg(loglevel);
    prefix.apply(this.loggerInstance, {
      template: '[%t] %l (%n)',
    });
  }

  private getName(config: LoggerConfig) {
    return config.namespace
      ? `${this.rootNamespace}:${config.namespace}`
      : this.rootNamespace;
  }

  public getLogger() {
    return this.loggerInstance as LoggerInstance;
  }
}
