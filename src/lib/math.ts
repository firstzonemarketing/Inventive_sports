/**
 * Clamps a numeric value between min and max.
 */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Linear interpolation between start and end by t (0..1).
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Inverse linear interpolation: returns 0..1 progress of value within [inMin, inMax].
 */
export function invLerp(inMin: number, inMax: number, value: number): number {
  if (Math.abs(inMax - inMin) < 1e-6) return 0;
  return clamp((value - inMin) / (inMax - inMin), 0, 1);
}

/**
 * Remaps value from [inMin, inMax] to [outMin, outMax] with optional easing.
 */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  easingFn?: (t: number) => number
): number {
  const rawProgress = invLerp(inMin, inMax, value);
  const eased = easingFn ? easingFn(rawProgress) : rawProgress;
  return lerp(outMin, outMax, eased);
}

/**
 * Physically grounded easing curves for scroll choreography.
 */
export function easeOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}

export function easeOutQuart(t: number): number {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 4);
}

export function easeInOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}
