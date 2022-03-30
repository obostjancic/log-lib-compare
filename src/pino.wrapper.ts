import { join, resolve } from 'path';
import pino, { Level, TransportTargetOptions } from 'pino';
import { LoggerInstance, LoggerConfig, LoggerWrapper } from './logger.base';

export class PinoWrapper implements LoggerWrapper {
  private readonly rootNamespace = 'ROOT';
  private loggerInstance = pino();

  constructor(config: LoggerConfig) {
    this.loggerInstance = pino({
      name: this.getName(config),
      transport: {
        targets: this.getTransports(config),
      },
      timestamp: config.consoleTimestamp,
    });
  }

  private getName(config: LoggerConfig) {
    return config.namespace
      ? `${this.rootNamespace}:${config.namespace}`
      : this.rootNamespace;
  }

  private getTransports(config: LoggerConfig): TransportTargetOptions[] {
    const transports: TransportTargetOptions[] = [];
    const createTransport = (target: string, options = {}) => {
      return {
        target,
        options,
        level: (config.level || 'info') as Level,
      };
    };

    if (config.structured) {
      transports.push(createTransport('pino/file'));
    } else {
      transports.push(createTransport('pino-pretty', { translateTime: true }));
    }

    if (config.logFile) {
      transports.push(
        createTransport('pino/file', {
          destination: resolve(
            join(config.directory, `pino-${Date.now()}.log`),
          ),
        }),
      );
    }
    return transports;
  }

  public getLogger(): LoggerInstance {
    return this.loggerInstance;
  }
}
