/**
 * Sends lightweight telemetry events to `/api/analytics/event`
 * so the Founder Demand Dashboard tracks live page visits, tool clicks, and ROI sandbox runs.
 */
export function trackEvent(type: 'visit' | 'tool_click' | 'sandbox_run', slug?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({ type, slug });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/analytics/event',
        new Blob([payload], { type: 'application/json' })
      );
      return;
    }
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Ignore telemetry network errors
  }
}

