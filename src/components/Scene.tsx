import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { SPACING } from "../constants";
import { layoutFor, mixLayout } from "../layout";
import { N, makeShape } from "../morph";
import type { ShapeKey } from "../moments";

type Props = {
  camRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  pulseRef: MutableRefObject<number>;
  total: number;
  keys: ShapeKey[];
};

const ACCENT = 0x7dd3fc;
const ACCENT_2 = 0xa5b4fc;
const PINK = 0xf0abfc;

/**
 * One point-and-line shape that morphs between sections, like PowerPoint's Morph transition.
 * Scrolling drives the morph: at each section the shape is the one for that section, and between
 * two sections every point glides from its place in one shape to its place in the next.
 */
export default function Scene({ camRef, pointerRef, pulseRef, keys }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 400);

    // Precompute every shape once. Point k always means the same thing, so morphs stay consistent.
    const shapes = keys.map((k) => makeShape(k));
    const current = new Float32Array(N * 3);
    current.set(shapes[0]);
    const posAttr = new THREE.BufferAttribute(current, 3);

    // Colour gradient along the path: sky, then indigo, then pink.
    const colors = new Float32Array(N * 3);
    const c1 = new THREE.Color(ACCENT);
    const c2 = new THREE.Color(ACCENT_2);
    const c3 = new THREE.Color(PINK);
    for (let k = 0; k < N; k++) {
      const t = k / (N - 1);
      const c = t < 0.5 ? c1.clone().lerp(c2, t * 2) : c2.clone().lerp(c3, (t - 0.5) * 2);
      colors.set([c.r, c.g, c.b], k * 3);
    }
    const colorAttr = new THREE.BufferAttribute(colors, 3);

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", posAttr);
    pointGeo.setAttribute("color", colorAttr);

    // Connect each point to the next one, so the shape reads as a single flowing line.
    const linePairs = new Uint16Array((N - 1) * 2);
    for (let k = 0; k < N - 1; k++) {
      linePairs[k * 2] = k;
      linePairs[k * 2 + 1] = k + 1;
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", posAttr);
    lineGeo.setAttribute("color", colorAttr);
    lineGeo.setIndex(new THREE.BufferAttribute(linePairs, 1));

    const group = new THREE.Group();
    const points = new THREE.Points(
      pointGeo,
      new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.95 })
    );
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5 })
    );

    // Soft glow behind the shape: a radial gradient sprite, no particles.
    const hc = document.createElement("canvas");
    hc.width = hc.height = 256;
    const hx = hc.getContext("2d")!;
    const grd = hx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(125,211,252,0.5)");
    grd.addColorStop(0.45, "rgba(165,180,252,0.16)");
    grd.addColorStop(1, "rgba(165,180,252,0)");
    hx.fillStyle = grd;
    hx.fillRect(0, 0, 256, 256);
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(hc),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    halo.scale.setScalar(11);

    group.add(halo, points, lines);
    scene.add(group);

    // Pulse rings: one per tap.
    const waves: { mesh: THREE.Mesh; born: number }[] = [];
    let seenPulse = pulseRef.current;
    let pulseVal = 0;

    // Drag turns the group with a small, quickly damped spin.
    let dragging = false;
    let moved = 0;
    let last = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a,button,.card,.list")) return;
      dragging = true;
      moved = 0;
      last = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      moved += Math.abs(dx) + Math.abs(dy);
      vel.y = Math.max(-0.03, Math.min(0.03, dx * 0.003));
      vel.x = Math.max(-0.03, Math.min(0.03, dy * 0.003));
      last = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      if (dragging && moved < 6) pulseRef.current += 1;
      dragging = false;
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    let raf = 0;
    const loop = (t: number) => {
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      camera.position.set(px * 1.2, -py * 0.8, 0);

      // Morph: the position between two slides, from App's smoothed scroll value.
      const W = window.innerWidth;
      const H = window.innerHeight;
      const p = Math.max(0, Math.min(keys.length - 1, camRef.current / SPACING));
      const i = Math.min(keys.length - 2, Math.floor(p));
      const f = p - i;
      const e = f * f * (3 - 2 * f);
      if (keys.length > 1) {
        const A = shapes[i];
        const B = shapes[i + 1];
        for (let q = 0; q < N * 3; q++) current[q] = A[q] + (B[q] - A[q]) * e;
        posAttr.needsUpdate = true;
      }
      // The orb follows the same layout as the content block, so it crosses to the other side.
      const L = mixLayout(layoutFor(i, W, H), layoutFor(i + 1, W, H), e);
      const baseScale = L.orbScale;
      group.position.set(L.orbX, L.orbY, -15);

      // Idle turn plus damped drag spin.
      group.rotation.y += vel.y + 0.0008;
      group.rotation.x += vel.x;
      if (!dragging) {
        vel.x *= 0.9;
        vel.y *= 0.9;
      }

      // Pulse: a soft swell and one ring.
      if (pulseRef.current !== seenPulse) {
        seenPulse = pulseRef.current;
        pulseVal = 1;
        const mesh = new THREE.Mesh(
          new THREE.TorusGeometry(3.4, 0.04, 8, 96),
          new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 })
        );
        mesh.position.copy(group.position);
        scene.add(mesh);
        waves.push({ mesh, born: t });
      }
      pulseVal *= 0.9;
      group.scale.setScalar(baseScale * (1 + pulseVal * 0.05));
      for (let k = waves.length - 1; k >= 0; k--) {
        const w = waves[k];
        const age = (t - w.born) / 1400;
        if (age >= 1) {
          scene.remove(w.mesh);
          w.mesh.geometry.dispose();
          (w.mesh.material as THREE.Material).dispose();
          waves.splice(k, 1);
          continue;
        }
        w.mesh.position.copy(group.position);
        w.mesh.scale.setScalar(baseScale * (1 + age * 1.4));
        (w.mesh.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - age);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", resize);
      scene.traverse((o) => {
        const obj = o as THREE.Mesh;
        obj.geometry?.dispose();
        const mat = obj.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
    };
  }, [camRef, pointerRef, pulseRef, keys]);

  return <canvas ref={canvasRef} className="gl" aria-hidden="true" />;
}
