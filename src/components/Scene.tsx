import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { SPACING, WORLD_K } from "../constants";

type Props = {
  camRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  pulseRef: MutableRefObject<number>;
  total: number;
  count: number;
};

const BRASS = 0xc9a45c;
const SAGE = 0x8fa38a;
const CREAM = 0xefe4d0;

/**
 * Background world + the interactive "neural orb".
 * The orb stays in front of the camera as you fly. Drag it to spin it,
 * click empty space or press Space to send a pulse through it.
 */
export default function Scene({ camRef, pointerRef, pulseRef, total, count }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 400);
    const L = total * WORLD_K + 120;

    // Drifting particles along the whole flight path.
    const n = 1400;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const palette = [new THREE.Color(BRASS), new THREE.Color(CREAM), new THREE.Color(SAGE)];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 34;
      pos.set([Math.cos(a) * r, Math.sin(a) * r, 40 - Math.random() * L], i * 3);
      const c = palette[i % 3];
      col.set([c.r, c.g, c.b], i * 3);
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pg.setAttribute("color", new THREE.BufferAttribute(col, 3));
    scene.add(
      new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.8 }))
    );

    // One gate ring per moment.
    const gates: THREE.Mesh[] = [];
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(9, 0.05, 8, 64),
        new THREE.MeshBasicMaterial({ color: BRASS, transparent: true, opacity: 0.3 })
      );
      m.position.z = -i * SPACING * WORLD_K - 8;
      scene.add(m);
      gates.push(m);
    }

    // Floating wireframe crystals.
    const gems: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.2 + Math.random(), 0),
        new THREE.MeshBasicMaterial({ color: i % 2 ? SAGE : BRASS, wireframe: true, transparent: true, opacity: 0.4 })
      );
      const a = Math.random() * Math.PI * 2;
      const r = 12 + Math.random() * 10;
      m.position.set(Math.cos(a) * r, Math.sin(a) * r, -Math.random() * L);
      scene.add(m);
      gems.push(m);
    }

    // The neural orb.
    const orb = new THREE.Group();
    const shell = new THREE.IcosahedronGeometry(3.2, 2);
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(shell),
      new THREE.LineBasicMaterial({ color: BRASS, transparent: true, opacity: 0.5 })
    );
    const nodes = new THREE.Points(shell, new THREE.PointsMaterial({ color: CREAM, size: 0.13 }));
    const inner = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.9, 1)),
      new THREE.LineBasicMaterial({ color: SAGE, transparent: true, opacity: 0.6 })
    );
    const coreMat = new THREE.MeshBasicMaterial({ color: BRASS, transparent: true, opacity: 0.35 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 24), coreMat);
    orb.add(wire, nodes, inner, core);
    scene.add(orb);

    // Pulse rings that expand from the orb.
    const waves: { mesh: THREE.Mesh; born: number }[] = [];
    let seenPulse = pulseRef.current;
    let pulseVal = 0;

    // Drag to spin; a tap on empty space pulses.
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
      vel.y = dx * 0.01;
      vel.x = dy * 0.01;
      last = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      if (dragging && moved < 5) pulseRef.current += 1;
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
      const tx = pointerRef.current.x;
      const ty = pointerRef.current.y;
      camera.position.set(tx * 3, -ty * 2, -camRef.current * WORLD_K);

      const wide = camera.aspect > 1.1;
      orb.position.set(wide ? 6.8 : 0, wide ? -0.4 : 2.6, camera.position.z - 15);
      orb.rotation.y += vel.y + 0.003;
      orb.rotation.x += vel.x;
      if (!dragging) {
        vel.x *= 0.95;
        vel.y *= 0.95;
      }
      inner.rotation.y -= 0.006;

      if (pulseRef.current !== seenPulse) {
        seenPulse = pulseRef.current;
        pulseVal = 1;
        const mesh = new THREE.Mesh(
          new THREE.TorusGeometry(3.4, 0.05, 8, 64),
          new THREE.MeshBasicMaterial({ color: CREAM, transparent: true, opacity: 0.8 })
        );
        mesh.position.copy(orb.position);
        scene.add(mesh);
        waves.push({ mesh, born: t });
      }
      pulseVal *= 0.94;
      orb.scale.setScalar(1 + pulseVal * 0.22);
      coreMat.opacity = 0.35 + pulseVal * 0.5;
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        const age = (t - w.born) / 1100;
        if (age >= 1) {
          scene.remove(w.mesh);
          w.mesh.geometry.dispose();
          (w.mesh.material as THREE.Material).dispose();
          waves.splice(i, 1);
          continue;
        }
        w.mesh.position.copy(orb.position);
        w.mesh.scale.setScalar(1 + age * 3.5);
        (w.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - age);
      }

      gems.forEach((m, i) => {
        m.rotation.x = t * 0.0003 + i;
        m.rotation.y = t * 0.0004 + i;
      });
      gates.forEach((m, i) => {
        m.rotation.z = t * 0.0002 * (i % 2 ? 1 : -1);
      });
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
  }, [camRef, pointerRef, pulseRef, total, count]);

  return <canvas ref={canvasRef} className="gl" aria-hidden="true" />;
}
