export interface Logger {
  info(message: string, context?: any): void;
  error(message: string, context?: any): void;
  warn(message: string, context?: any): void;
}
