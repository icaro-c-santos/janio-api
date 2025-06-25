/* eslint-disable class-methods-use-this */
import winston, { createLogger, format, transports } from 'winston';
import { Logger } from '../../aplication/ports/logger';
import { appConfig } from '../../config';

export class WinstonLogger implements Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(...this.getFormats()),
      defaultMeta: this.getMetaData(),
      transports: [new transports.Console()],
    });
  }

  info(message: string, context?: any) {
    this.logger.info(message, context);
  }

  warn(message: string, context?: any) {
    this.logger.warn(message, context);
  }

  error(message: string, context?: any) {
    this.logger.error(message, context);
  }

  private getFormats(): winston.Logform.Format[] {
    const formats = [format.timestamp(), format.json()];
    if (appConfig.APP_ENV === 'development') {
      return [...formats, format.prettyPrint()];
    }
    return formats;
  }

  private getMetaData() {
    const meta = { service: appConfig.API_SERVICE_NAME };
    return meta;
  }
}
