import { join, resolve } from 'path';
import { LoggerConfig, LoggerInstance } from './logger.base';
import winston from 'winston';

export class WinstonWrapper {
  private readonly rootNamespace = 'ROOT';
  private sharedFormats: winston.Logform.Format[];
  private loggerInstance: winston.Logger;

  constructor(config: LoggerConfig) {
    this.sharedFormats = [
      this.addTimestamp(config),
      this.addNamespace(config),
    ].filter(Boolean) as winston.Logform.Format[];

    this.loggerInstance = winston.createLogger({
      transports: this.getTransports(config),
    });
  }

  private addTimestamp(config: LoggerConfig) {
    return (
      config.consoleTimestamp &&
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    );
  }

  private addNamespace(config: LoggerConfig) {
    return winston.format((info) => {
      info.namespace = config.namespace
        ? `${this.rootNamespace}:${config.namespace}`
        : this.rootNamespace;
      return info;
    })();
  }

  private getTransports(config: LoggerConfig) {
    const transports = [];

    if (config.structured) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            ...[...this.sharedFormats, winston.format.json()],
          ),
        }),
      );
    } else {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            ...[
              ...this.sharedFormats,
              winston.format.colorize({ message: true }),
              winston.format.printf(
                (info) =>
                  `${info.timestamp} ${info.level}: (${info.namespace}) ${info.message}`,
              ),
            ],
          ),
        }),
      );
    }

    if (config.logFile) {
      transports.push(
        new winston.transports.File({
          filename: resolve(
            join(config.directory, `winston-${Date.now()}.log`),
          ),
          level: config.level,
          format: winston.format.combine(...this.sharedFormats),
        }),
      );
    }
    return transports;
  }

  public getLogger(): LoggerInstance {
    return this.loggerInstance;
  }
}
