import Lenis from 'lenis';
import { clamp } from './math';

export interface ScrollFrameState {
  scrollY: number;
  viewportHeight: number;
  viewportWidth: number;
  velocity: number;
  reducedMotion: boolean;
}

export type ScrollSubscriber = (state: ScrollFrameState) => void;

class SingleScrollEngine {
  private lenis: Lenis | null = null;
  private subscribers = new Set<ScrollSubscriber>();
  private rafId: number | null = null;
  private reducedMotion = false;
  private isRunning = false;
  private viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
  private viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;

  private handleResize = () => {
    this.viewportHeight = window.innerHeight;
    this.viewportWidth = window.innerWidth;
    this.notifySubscribers(window.scrollY, 0);
  };

  public init(reducedMotion: boolean) {
    if (typeof window === 'undefined') return;

    this.reducedMotion = reducedMotion;
    this.viewportHeight = window.innerHeight;
    this.viewportWidth = window.innerWidth;

    window.removeEventListener('resize', this.handleResize);
    window.addEventListener('resize', this.handleResize, { passive: true });

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    if (!reducedMotion) {
      this.lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.rafId = window.requestAnimationFrame(this.tick);
    }

    // Immediate initial layout pass
    this.notifySubscribers(window.scrollY, 0);
  }

  private tick = (time: number) => {
    if (!this.isRunning) return;

    if (this.lenis && !this.reducedMotion) {
      this.lenis.raf(time);
    }

    const scrollY = this.lenis && !this.reducedMotion ? this.lenis.scroll : window.scrollY;
    const velocity = this.lenis && !this.reducedMotion ? this.lenis.velocity : 0;

    this.notifySubscribers(scrollY, velocity);

    this.rafId = window.requestAnimationFrame(this.tick);
  };

  private notifySubscribers(scrollY: number, velocity: number) {
    const state: ScrollFrameState = {
      scrollY,
      viewportHeight: this.viewportHeight,
      viewportWidth: this.viewportWidth,
      velocity,
      reducedMotion: this.reducedMotion,
    };

    this.subscribers.forEach((callback) => {
      callback(state);
    });
  }

  public subscribe(callback: ScrollSubscriber): () => void {
    this.subscribers.add(callback);
    // Run immediately so initial DOM styles are synchronized
    if (typeof window !== 'undefined') {
      callback({
        scrollY: this.lenis && !this.reducedMotion ? this.lenis.scroll : window.scrollY,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        velocity: 0,
        reducedMotion: this.reducedMotion,
      });
    }
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public scrollTo(target: string | HTMLElement | number, offset = 0) {
    if (typeof window === 'undefined') return;

    if (this.lenis && !this.reducedMotion) {
      this.lenis.scrollTo(target, {
        offset,
        duration: 1.2,
      });
      return;
    }

    if (typeof target === 'number') {
      window.scrollTo({ top: target + offset, behavior: this.reducedMotion ? 'auto' : 'smooth' });
    } else if (typeof target === 'string') {
      const el = document.querySelector<HTMLElement>(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: this.reducedMotion ? 'auto' : 'smooth' });
      }
    } else if (target instanceof HTMLElement) {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: this.reducedMotion ? 'auto' : 'smooth' });
    }
  }

  public destroy() {
    this.isRunning = false;
    if (this.rafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}

export const scrollEngine = new SingleScrollEngine();

/**
 * Computes normalized 0..1 progress for a tall pinned container of height > 100vh.
 */
export function getPinnedScrollProgress(
  container: HTMLElement,
  viewportHeight: number
): number {
  const rect = container.getBoundingClientRect();
  const totalScrollable = Math.max(1, rect.height - viewportHeight);
  const scrolled = -rect.top;
  return clamp(scrolled / totalScrollable, 0, 1);
}

/**
 * Computes normalized 0..1 progress as an element travels through the viewport.
 */
export function getViewportPassProgress(
  element: HTMLElement,
  viewportHeight: number,
  startOffsetRatio = 0.85,
  endOffsetRatio = 0.15
): number {
  const rect = element.getBoundingClientRect();
  const startY = viewportHeight * startOffsetRatio;
  const endY = viewportHeight * endOffsetRatio - rect.height * 0.35;
  const span = Math.max(1, startY - endY);
  return clamp((startY - rect.top) / span, 0, 1);
}
