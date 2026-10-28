import { useEffect } from 'react';

/**
 * Uses a single IntersectionObserver instance to reveal ordinary sections
 * and sequential statement lines without scroll-frame React state updates.
 */
export function useReveals(reducedMotion: boolean): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    const statementElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-statement-line]')
    );

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.setAttribute('data-reveal', 'visible'));
      statementElements.forEach((el) =>
        el.setAttribute('data-statement-active', 'true')
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;

          if (target.hasAttribute('data-reveal')) {
            const delay = target.getAttribute('data-reveal-delay');
            if (delay) {
              target.style.transitionDelay = `${delay}ms`;
            }
            target.setAttribute('data-reveal', 'visible');
          }

          if (target.hasAttribute('data-statement-line')) {
            target.setAttribute('data-statement-active', 'true');
          }

          observer.unobserve(target);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.14,
      }
    );

    revealElements.forEach((el) => observer.observe(el));
    statementElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion]);
}
