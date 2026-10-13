import { useEffect, useMemo, useRef, useState } from "react";
import Scene from "./components/Scene";
import MomentView from "./components/MomentView";
import Hud from "./components/Hud";
import { buildMoments, morphKeys } from "./moments";
import { SPACING } from "./constants";
import { layoutFor, mixLayout } from "./layout";

/**
 * Slides on a fixed stage. Scrolling moves between slides with a PowerPoint-style morph:
 * the content block slides and blurs across, the orb crosses to the other side and its shape morphs.
 * The page is a stack of full-screen snap points, so each scroll step lands cleanly on a slide.
 */
export default function App() {
  const moments = useMemo(buildMoments, []);
  const keys = useMemo(() => morphKeys(moments), [moments]);
  const N = moments.length;

  const [active, setActive] = useState(0);
  const pointer = useRef({ x: 0, y: 0 });
  const pulse = useRef(0);
  const cam = useRef(0);
  const blockRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  const goTo = (i: number) => {
    const c = Math.max(0, Math.min(N - 1, i));
    window.scrollTo({ top: c * window.innerHeight, behavior: "smooth" });
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code === "Space" && tag !== "BUTTON" && tag !== "A") {
        e.preventDefault();
        pulse.current += 1;
      } else if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        goTo(activeRef.current + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(activeRef.current - 1);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  // Drive the morph from scroll: position between slides, with smoothing so it never jumps.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let p = 0;
    const loop = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const target = Math.max(0, Math.min(N - 1, window.scrollY / H));
      p += (target - p) * (reduce ? 1 : 0.14);
      cam.current = p * SPACING;

      const i = Math.min(N - 2, Math.floor(p));
      const f = p - i;
      const e = f * f * (3 - 2 * f);
      const L = mixLayout(layoutFor(i, W, H), layoutFor(i + 1, W, H), e);

      const block = blockRef.current;
      if (block) {
        const dip = Math.sin(Math.PI * f); // peaks mid-transition
        block.style.width = `${L.width}px`;
        block.style.transform = `translate3d(${L.left}px, ${L.top}px, 0) translateY(-50%)`;
        block.style.opacity = String(1 - 0.9 * dip);
        block.style.filter = `blur(${(6 * dip).toFixed(2)}px)`;
      }

      const near = Math.round(p);
      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [N]);

  return (
    <>
      <Scene camRef={cam} pointerRef={pointer} pulseRef={pulse} total={(N - 1) * SPACING} keys={keys} />
      <div className="stage">
        <div ref={blockRef} className="block">
          <MomentView m={moments[active]} />
        </div>
      </div>
      <Hud moments={moments} active={active} onGo={goTo} onPulse={() => (pulse.current += 1)} />
      <div className="snaps" aria-hidden="true">
        {moments.map((m) => (
          <div key={m.id} className="snap" />
        ))}
      </div>
    </>
  );
}
