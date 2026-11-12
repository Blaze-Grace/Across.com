/**
 * Detects whether the current visitor is browsing from a mobile phone or narrow mobile viewport.
 * Used to restrict desktop-only application install/launch prompts to desktop viewers.
 */
export function isMobileViewer(): boolean {
  if (typeof window === 'undefined') return false;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isMobileViewport = window.innerWidth <= 768;
  return isMobileUA || isMobileViewport;
}

