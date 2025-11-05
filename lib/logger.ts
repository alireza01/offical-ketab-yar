/**
 * Centralized logging utility
 * 
 * Use this instead of console.log for better error tracking and debugging.
 * In production, this can be connected to services like Sentry, LogRocket, etc.
 * 
 * Agent 2 (Performance): Optimized for production with minimal overhead
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogOptions {
  context?: string
  metadata?: Record<string, unknown>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isServer = typeof window === 'undefined'

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString()
    const context = options?.context ? `[${options.context}]` : ''
    const env = this.isServer ? '[SERVER]' : '[CLIENT]'
    return `${env} [${timestamp}] ${level.toUpperCase()} ${context} ${message}`
  }

  info(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('info', message, options), options?.metadata || '')
    }
  }

  warn(message: string, options?: LogOptions): void {
    console.warn(this.formatMessage('warn', message, options), options?.metadata || '')
  }

  error(message: string, error?: unknown, options?: LogOptions): void {
    console.error(this.formatMessage('error', message, options), error, options?.metadata || '')

    // In production, send to error tracking service
    if (!this.isDevelopment) {
      this.sendToErrorTracking(message, error, options)
    }
  }

  debug(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, options), options?.metadata || '')
    }
  }

  private sendToErrorTracking(_message: string, _error?: unknown, _options?: LogOptions): void {
    // TODO: Integrate with Sentry or similar service
    // Example:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     extra: {
    //       message,
    //       ...options?.metadata,
    //     },
    //     tags: {
    //       context: options?.context,
    //     },
    //   })
    // }
  }

  /**
   * Performance logging (only in development)
   */
  performance(label: string, startTime: number): void {
    if (this.isDevelopment) {
      const duration = performance.now() - startTime
      console.log(`⚡ [PERFORMANCE] ${label}: ${duration.toFixed(2)}ms`)
    }
  }

  /**
   * Group logs (useful for debugging complex flows)
   */
  group(label: string, callback: () => void): void {
    if (this.isDevelopment) {
      console.group(label)
      callback()
      console.groupEnd()
    }
  }
}

export const logger = new Logger()

/**
 * Performance measurement utility
 */
export function measurePerformance<T>(
  label: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const startTime = performance.now()
  const result = fn()

  if (result instanceof Promise) {
    return result.finally(() => {
      logger.performance(label, startTime)
    })
  } else {
    logger.performance(label, startTime)
    return result
  }
}
