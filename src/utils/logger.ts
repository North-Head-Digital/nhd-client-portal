/**
 * Client-Side Logger Utility
 * Provides environment-aware logging for React application
 * 
 * Usage:
 *   import logger from '@/utils/logger';
 *   logger.info('User action', { action: 'click' });
 *   logger.error('API Error', error);
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogData {
  [key: string]: unknown;
}

class Logger {
  private readonly isDevelopment: boolean;
  private readonly isProduction: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
    this.isProduction = import.meta.env.MODE === 'production';
  }

  private formatMessage(level: LogLevel, message: string, data?: LogData | Error): string {
    const timestamp = new Date().toISOString();
    let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      if (data instanceof Error) {
        formattedMessage += `\nError: ${data.message}`;
        if (this.isDevelopment && data.stack) {
          formattedMessage += `\n${data.stack}`;
        }
      } else if (typeof data === 'object') {
        formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
      }
    }

    return formattedMessage;
  }

  error(message: string, error?: Error | LogData): void {
    // Always log errors, even in production
    const formattedMessage = this.formatMessage('error', message, error);
    console.error(formattedMessage);

    // In production, send to error tracking service
    if (this.isProduction) {
      // Future: Integrate with Sentry, LogRocket, or similar service
      // Example: Sentry.captureException(error);
    }
  }

  warn(message: string, data?: LogData): void {
    if (!this.isProduction) {
      const formattedMessage = this.formatMessage('warn', message, data);
      console.warn(formattedMessage);
    }
  }

  info(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('info', message, data);
      console.log(formattedMessage);
    }
  }

  debug(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('debug', message, data);
      console.log(formattedMessage);
    }
  }

  // API call logging helper
  api(method: string, url: string, status?: number, data?: LogData): void {
    if (this.isDevelopment) {
      const statusText = status ? `[${status}]` : '';
      const message = `API ${method} ${url} ${statusText}`;
      this.info(message, data);
    }
  }
}

export default new Logger();
