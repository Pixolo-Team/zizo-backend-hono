import { config } from '@/config';

/**
 * Logger levels
 */
export const LOG_LEVEL = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

/**
 * Log level priority map
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LOG_LEVEL.ERROR]: 0,
  [LOG_LEVEL.WARN]: 1,
  [LOG_LEVEL.INFO]: 2,
  [LOG_LEVEL.DEBUG]: 3,
};

/**
 * Parse log level safely
 */
function parseLogLevel(level?: string): LogLevel {
  if (!level) return LOG_LEVEL.INFO;

  const normalized = level.toLowerCase();

  if (Object.values(LOG_LEVEL).includes(normalized as LogLevel)) {
    return normalized as LogLevel;
  }

  return LOG_LEVEL.INFO;
}

/**
 * Simple logger utility
 */
class Logger {
  private readonly logLevel: LogLevel;

  constructor(level?: string) {
    this.logLevel = parseLogLevel(level);
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string) {
    return `[${level.toUpperCase()}] ${new Date().toISOString()} - ${message}`;
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVEL.ERROR)) {
      console.error(this.formatMessage(LOG_LEVEL.ERROR, message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVEL.WARN)) {
      console.warn(this.formatMessage(LOG_LEVEL.WARN, message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVEL.INFO)) {
      console.info(this.formatMessage(LOG_LEVEL.INFO, message), ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVEL.DEBUG)) {
      console.debug(this.formatMessage(LOG_LEVEL.DEBUG, message), ...args);
    }
  }
}

export const logger = new Logger(config.logLevel);
export default logger;
