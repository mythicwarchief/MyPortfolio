/**
 * Where each slide's content block and the orb sit on screen.
 * Layouts alternate sides on desktop, so each transition is a visible move from one side to the other.
 * Numbers for the orb are in world units. The camera sees 21 units vertically at the orb's depth,
 * so one unit is H / 21 pixels.
 */
export type Layout = {
  left: number;   // block left, px
  top: number;    // block centre, px
  width: number;  // block width, px
  orbX: number;   // orb x, world units
  orbY: number;   // orb y, world units
  orbScale: number;
};

export function layoutFor(i: number, W: number, H: number): Layout {
  const portrait = W / H < 0.9;
  if (portrait) {
    return {
      left: W * 0.06,
      top: H * 0.56,
      width: W * 0.88,
      orbX: 0,
      orbY: 6.6,
      orbScale: 0.5,
    };
  }
  const onLeft = i % 2 === 0;
  const width = Math.min(640, W * 0.42);
  const unit = H / 21;
  const offset = (W * 0.2) / unit;
  return {
    left: onLeft ? W * 0.07 : W - width - W * 0.07,
    top: H * 0.5,
    width,
    orbX: onLeft ? offset : -offset,
    orbY: -0.4,
    orbScale: 1,
  };
}

/** Blend two layouts. e runs from 0 to 1 (already eased). */
export function mixLayout(a: Layout, b: Layout, e: number): Layout {
  const m = (x: number, y: number) => x + (y - x) * e;
  return {
    left: m(a.left, b.left),
    top: m(a.top, b.top),
    width: m(a.width, b.width),
    orbX: m(a.orbX, b.orbX),
    orbY: m(a.orbY, b.orbY),
    orbScale: m(a.orbScale, b.orbScale),
  };
}
