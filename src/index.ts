import { LogRunner } from './log.runner';
import { rmSync, mkdirSync, existsSync } from 'fs';
import { PinoWrapper } from './pino.wrapper';
import { WinstonWrapper } from './winston.wrapper';
import { LogLevelWrapper } from './loglevel.wrapper';

const dir = './logs';
// rmSync(dir, { recursive: true, force: true });
if (!existsSync(dir)) {
  mkdirSync(dir);
}

const STDOUT_OPTS = {
  directory: './logs/',
  namespace: 'namespace-unstructured',
  consoleTimestamp: true,
};

const FILE_OPTS = {
  directory: './logs/',
  namespace: 'namespace-structured',
  consoleTimestamp: true,
  structured: true,
  logFile: true,
};

const loggerArg = process.argv[2];
const optsArg = process.argv[3];

const chosenOpts = optsArg === 'file' ? FILE_OPTS : STDOUT_OPTS;

if (loggerArg === 'pino') {
  new LogRunner(PinoWrapper, chosenOpts).run();
}
if (loggerArg === 'winston') {
  new LogRunner(WinstonWrapper, chosenOpts).run();
}
if (loggerArg === 'loglevel') {
  new LogRunner(LogLevelWrapper, chosenOpts).run();
}
