import winston, { Logger } from 'winston'
import fs from 'fs';
import path from 'path';

let dir = path.join(process.cwd(), '/server/logfiles/');
if (!dir) dir = path.resolve(process.cwd(), '/server/logfiles/');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

class AppLogger {
  logger: Logger

  constructor() {
      this.logger = winston.createLogger({
          level: process.env.LOG_LEVEL || 'debug',
          format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), this.format),
          transports: [
              new winston.transports.File({
                  filename: `${dir}/app.log`,
                  level: process.env.LOG_LEVEL || 'debug',
                  handleExceptions: true,
                  maxsize: 100000,
                  maxFiles: 10,
                  tailable: true,
                  zippedArchive: true,
              }),
          ],
          exitOnError: false,
      })
  }

  format = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}] : ${message} `
      if (metadata) {
          msg += JSON.stringify(metadata)
      }
      return msg
  })
}

const logger = new AppLogger()
export default logger.logger