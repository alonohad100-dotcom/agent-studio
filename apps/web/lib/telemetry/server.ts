/**
 * Server-side Telemetry
 * Structured logging for server actions and API routes
 */

export type ServerEvent =
  | { type: 'server_action'; action: string; duration: number; success: boolean; error?: string }
  | { type: 'api_request'; route: string; method: string; duration: number; status: number }
  | { type: 'database_query'; table: string; operation: string; duration: number }

/**
 * Log server event
 */
export function logServerEvent(event: ServerEvent) {
  // Structured logging for server-side events
  const timestamp = new Date().toISOString()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Server Event] ${timestamp}`, event)
  }

  // Future: Send to logging service (e.g., Datadog, CloudWatch)
  // Example: logger.info(event.type, event)
}

/**
 * Log server error
 */
export function logServerError(error: Error, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  
  console.error(`[Server Error] ${timestamp}`, error, context)

  // Future: Send to error tracking service
  // Example: Sentry.captureException(error, { extra: context })
}

/**
 * Measure server action performance
 */
export async function measureServerAction<T>(
  actionName: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now()
  
  try {
    const result = await fn()
    const duration = Date.now() - start
    
    logServerEvent({
      type: 'server_action',
      action: actionName,
      duration,
      success: true,
    })
    
    return result
  } catch (error) {
    const duration = Date.now() - start
    
    logServerEvent({
      type: 'server_action',
      action: actionName,
      duration,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    logServerError(error instanceof Error ? error : new Error(String(error)), {
      action: actionName,
    })
    
    throw error
  }
}

