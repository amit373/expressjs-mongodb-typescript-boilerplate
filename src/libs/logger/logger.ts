import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createLogger, format, Logform, transports } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { config } from '@app/config';
import { utilities } from './logger.utilities';

// logs dir
const logDir: string = join(__dirname, config.LOGS.DIR);

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// Define log format
const logFormat: Logform.Format = format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = createLogger({
  // format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  format: format.combine(
    format.timestamp(),
    format.printf(info => utilities.format.getFormattedLogs(config.APP_NAME, info)),
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug', // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.ms(),
      utilities.format.consoleFormat(config.APP_NAME, {
        colors: true,
        prettyPrint: true,
      }),
    ),
  }),
  // new transports.Console({ format: format.combine(format.splat(), format.colorize()) })
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
