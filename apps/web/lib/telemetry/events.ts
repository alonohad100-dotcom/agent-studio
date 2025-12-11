/**
 * Telemetry Events
 * Event tracking for analytics and observability
 */

export type TelemetryEvent =
  | { type: 'agent_created'; agentId: string; name: string }
  | { type: 'spec_block_generated'; agentId: string; blockName: string }
  | { type: 'lint_blocker_resolved'; agentId: string; blockerId: string }
  | { type: 'tests_generated'; agentId: string; count: number }
  | { type: 'tests_run'; agentId: string; versionId?: string; passRate: number }
  | { type: 'version_published'; agentId: string; versionId: string; versionNumber: number }
  | { type: 'export_downloaded'; agentId: string; versionId?: string; format: string }

/**
 * Track a telemetry event
 */
export function trackEvent(event: TelemetryEvent) {
  // In production, this would send to analytics service
  // For now, we'll log to console and could extend to send to Sentry/PostHog/etc.
  
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Telemetry]', event)
  }

  // Future: Send to analytics service
  // Example: analytics.track(event.type, event)
}

/**
 * Track error
 */
export function trackError(error: Error, context?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error('[Error]', error, context)
    
    // Future: Send to Sentry
    // Example: Sentry.captureException(error, { extra: context })
  }
}

/**
 * Track performance metric
 */
export function trackPerformance(metric: string, value: number, unit: string = 'ms') {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Performance] ${metric}: ${value}${unit}`)
  }

  // Future: Send to performance monitoring service
  // Example: performance.mark(metric, value)
}

