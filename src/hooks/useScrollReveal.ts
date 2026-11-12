import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to elements marked with `[data-reveal]`
 * so sections and cards smoothly animate into view when scrolled to.
 */
export function useScrollReveal(dependencyKey?: string) {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.04,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    targets.forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [dependencyKey]);
}
