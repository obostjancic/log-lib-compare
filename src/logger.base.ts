/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoggerConfig {
  name?: string;
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
  directory: string;
  logFile?: boolean;
  namespace?: string;
  structured?: boolean;
  consoleTimestamp?: boolean;
}

export interface LoggerInstance {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export interface LoggerWrapper {
  getLogger: () => LoggerInstance;
}
