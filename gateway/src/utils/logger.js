// @flow

import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Create the log directory if it does not exist
const logDir = 'log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const env = process.env.NODE_ENV || 'development';
const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'production' ? 'warn' : 'debug',
  format: format.combine(
    format.label({ label: path.basename(module.parent.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`),
      ),
    }),
    new transports.DailyRotateFile({
      level: 'info',
      filename: `${logDir}/%DATE%-foxiny-gateway.log`,
      datePattern: 'YYYY-MM-DD',
      format: format.combine(format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)),
    }),
  ],
});

export default logger;
