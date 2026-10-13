import type { ShapeKey } from "./moments";

/** Points per shape. Every shape uses the same count so each point can glide to its partner in the next shape. */
export const N = 240;
const R = 3.2;

type V = [number, number, number];

const lerp3 = (a: V, b: V, t: number): V => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Spreads N points evenly along the edges of a polyhedron (or polygon). */
function alongEdges(verts: V[], edges: [number, number][], k: number): V {
  const per = N / edges.length;
  const e = Math.floor(k / per);
  const t = (k % per) / (per - 1);
  const [a, b] = edges[e];
  return lerp3(verts[a], verts[b], t);
}

const CUBE_S = 2.4;
const cubeVerts: V[] = Array.from({ length: 8 }, (_, a) => [
  (a & 1 ? 1 : -1) * CUBE_S,
  (a & 2 ? 1 : -1) * CUBE_S,
  (a & 4 ? 1 : -1) * CUBE_S,
]);
const cubeEdges: [number, number][] = [];
for (let a = 0; a < 8; a++)
  for (let d = 0; d < 3; d++) {
    const bit = 1 << d;
    if (!(a & bit)) cubeEdges.push([a, a | bit]);
  }

const octaVerts: V[] = [[R, 0, 0], [-R, 0, 0], [0, R, 0], [0, -R, 0], [0, 0, R], [0, 0, -R]];
const octaEdges: [number, number][] = [];
for (let i = 0; i < 6; i++)
  for (let j = i + 1; j < 6; j++) {
    const opposite = Math.floor(i / 2) === Math.floor(j / 2);
    if (!opposite) octaEdges.push([i, j]);
  }

const tetraVerts: V[] = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(
  (v) => v.map((c) => c * 2.2) as V
);
const tetraEdges: [number, number][] = [];
for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) tetraEdges.push([i, j]);

const hexVerts: V[] = Array.from({ length: 6 }, (_, i) => [
  Math.cos((i * Math.PI) / 3) * R,
  Math.sin((i * Math.PI) / 3) * R,
  0,
]);
const hexEdges: [number, number][] = Array.from({ length: 6 }, (_, i) => [i, (i + 1) % 6]);

function point(key: ShapeKey, k: number): V {
  switch (key) {
    case "sphere": {
      const y = 1 - (2 * (k + 0.5)) / N;
      const r = Math.sqrt(1 - y * y);
      const th = k * 2.399963;
      return [Math.cos(th) * r * R, y * R, Math.sin(th) * r * R];
    }
    case "rings": {
      const ring = k % 3;
      const a = (2 * Math.PI * Math.floor(k / 3)) / (N / 3);
      const rad = [2.0, 3.1, 4.2][ring];
      return [Math.cos(a) * rad, Math.sin(a) * rad, 0];
    }
    case "torus": {
      const a = (2 * Math.PI * (k % 40)) / 40;
      const b = (2 * Math.PI * Math.floor(k / 40)) / 6;
      const d = 2.6 + 0.9 * Math.cos(b);
      return [d * Math.cos(a), d * Math.sin(a), 0.9 * Math.sin(b)];
    }
    case "cube":
      return alongEdges(cubeVerts, cubeEdges, k);
    case "helix": {
      const strand = k % 2;
      const t = Math.floor(k / 2) / (N / 2);
      const ang = t * Math.PI * 6 + strand * Math.PI;
      return [Math.cos(ang) * 2.6, (t - 0.5) * 8.5, Math.sin(ang) * 2.6];
    }
    case "grid": {
      const ix = k % 16;
      const iy = Math.floor(k / 16);
      return [(ix - 7.5) * 0.62, (iy - 7) * 0.62, Math.sin(ix * 0.7) * Math.cos(iy * 0.6) * 0.6];
    }
    case "burst": {
      const y = 1 - (2 * (k + 0.5)) / N;
      const r = Math.sqrt(1 - y * y);
      const th = k * 2.399963;
      const h = Math.sin(k * 12.9898) * 43758.5453;
      const rr = R * (0.55 + 0.9 * (h - Math.floor(h)));
      return [Math.cos(th) * r * rr, y * rr, Math.sin(th) * r * rr];
    }
    case "dna": {
      const strand = k % 3;
      const j = Math.floor(k / 3);
      const t = j / 80;
      const ang = t * Math.PI * 8;
      const y = (t - 0.5) * 9;
      if (strand < 2) {
        const a = ang + strand * Math.PI;
        return [Math.cos(a) * 2.4, y, Math.sin(a) * 2.4];
      }
      const s = (((j * 7) % 10) / 9) * 2 - 1;
      return [Math.cos(ang) * 2.4 * s, y, Math.sin(ang) * 2.4 * s];
    }
    case "octa":
      return alongEdges(octaVerts, octaEdges, k);
    case "tetra":
      return alongEdges(tetraVerts, tetraEdges, k);
    case "wave": {
      const ix = k % 16;
      const iy = Math.floor(k / 16);
      return [(ix - 7.5) * 0.6, 1.4 * Math.sin(ix * 0.9) * Math.cos(iy * 0.5), (iy - 7) * 0.6];
    }
    case "spiral": {
      const s = k / N;
      const ang = s * Math.PI * 8;
      const r = 0.4 + s * 3.0;
      return [Math.cos(ang) * r, Math.sin(ang) * r, (s - 0.5) * 0.6];
    }
    case "lissajous": {
      const t = (2 * Math.PI * k) / N;
      return [3 * Math.sin(3 * t), 3 * Math.sin(2 * t + Math.PI / 2), 2.2 * Math.sin(5 * t)];
    }
    case "cylinder": {
      const row = Math.floor(k / 20);
      const col = k % 20;
      const a = (2 * Math.PI * col) / 20;
      return [2.6 * Math.cos(a), (row - 5.5) * 0.75, 2.6 * Math.sin(a)];
    }
    case "flower": {
      const th = (2 * Math.PI * k) / N;
      const r = 3.4 * Math.cos(4 * th);
      return [r * Math.cos(th), r * Math.sin(th), 0.6 * Math.sin(3 * th)];
    }
    case "mobius": {
      const col = k % 60;
      const row = Math.floor(k / 60);
      const t = (2 * Math.PI * col) / 60;
      const s = -0.9 + 0.6 * row;
      const rad = 2.8 + s * Math.cos(t / 2);
      return [rad * Math.cos(t), rad * Math.sin(t), s * Math.sin(t / 2)];
    }
    case "saddle": {
      const x = ((k % 16) - 7.5) * 0.5;
      const y = (Math.floor(k / 16) - 7) * 0.5;
      return [x, y, (x * x - y * y) * 0.35];
    }
    case "gyroscope": {
      const ring = k % 3;
      const a = (2 * Math.PI * Math.floor(k / 3)) / 80;
      const r = 3.0;
      if (ring === 0) return [r * Math.cos(a), r * Math.sin(a), 0];
      if (ring === 1) return [r * Math.cos(a), 0, r * Math.sin(a)];
      return [0, r * Math.cos(a), r * Math.sin(a)];
    }
    case "lattice":
      return [((k % 5) - 2) * 1.1, ((Math.floor(k / 5) % 6) - 2.5) * 1.0, (Math.floor(k / 30) - 3.5) * 0.9];
    case "bicone": {
      const side = Math.floor(k / 120);
      const t = (k % 120) / 120;
      const a = t * Math.PI * 12;
      const r = 3 * (1 - t) + 0.1;
      return [r * Math.cos(a), (side ? -1 : 1) * t * 3.2, r * Math.sin(a)];
    }
    case "trefoil": {
      const t = (2 * Math.PI * k) / N;
      return [
        0.9 * (Math.sin(t) + 2 * Math.sin(2 * t)),
        0.9 * (Math.cos(t) - 2 * Math.cos(2 * t)),
        -0.9 * Math.sin(3 * t),
      ];
    }
    case "vortex": {
      const t = k / N;
      const a = t * Math.PI * 18;
      const r = 0.3 + 2.8 * t * t;
      return [r * Math.cos(a), (t - 0.5) * 8, r * Math.sin(a)];
    }
    case "pinwheel": {
      const blade = Math.floor(k / 40);
      const u = (k % 40) / 39;
      const a = (blade * Math.PI) / 3 + u * 0.6;
      const r = 0.5 + u * 3.2;
      return [r * Math.cos(a), r * Math.sin(a), 0];
    }
    case "hexagon":
      return alongEdges(hexVerts, hexEdges, k);
  }
}

/** Returns N points packed as x,y,z for one shape. */
export function makeShape(key: ShapeKey): Float32Array {
  const out = new Float32Array(N * 3);
  for (let k = 0; k < N; k++) out.set(point(key, k), k * 3);
  return out;
}
