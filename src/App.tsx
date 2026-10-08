import { useEffect, useMemo, useRef, useState } from "react";
import Scene from "./components/Scene";
import MomentView from "./components/MomentView";
import Hud from "./components/Hud";
import { buildMoments } from "./moments";
import { SPACING } from "./constants";

export default function App() {
  const moments = useMemo(buildMoments, []);
  const N = moments.length;
  const total = (N - 1) * SPACING;

  const [active, setActive] = useState(0);
  const [vh, setVh] = useState(window.innerHeight);

  const els = useRef<(HTMLElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const cam = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const pulse = useRef(0);
  const activeRef = useRef(0);

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  const goTo = (i: number) => {
    const c = Math.max(0, Math.min(N - 1, i));
    window.scrollTo({ top: (c / (N - 1)) * maxScroll(), behavior: "smooth" });
  };
  const firePulse = () => {
    pulse.current += 1;
  };

  // Input: resize, pointer parallax, keyboard.
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
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
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  // Fly-through loop: scroll position drives depth, not vertical movement.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    const loop = () => {
      const target = Math.min(1, window.scrollY / Math.max(1, maxScroll())) * total;
      cam.current += (target - cam.current) * (reduce ? 1 : 0.08);
      tx += (pointer.current.x - tx) * 0.06;
      ty += (pointer.current.y - ty) * 0.06;
      if (tilt.current) tilt.current.style.transform = `rotateY(${tx * 6}deg) rotateX(${-ty * 4}deg)`;
      if (stage.current) stage.current.style.transform = `translateZ(${cam.current}px)`;

      let near = 0;
      let nearDist = Infinity;
      els.current.forEach((el, i) => {
        if (!el) return;
        const d = -i * SPACING + cam.current;
        const o = d < 0 ? 1 - Math.min(1, -d / (SPACING * 0.7)) : 1 - Math.min(1, d / 380);
        el.style.opacity = Math.max(0, o).toFixed(3);
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        el.style.visibility = o <= 0.01 ? "hidden" : "visible";
        if (Math.abs(d) < nearDist) {
          nearDist = Math.abs(d);
          near = i;
        }
      });
      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  return (
    <>
      <Scene camRef={cam} pointerRef={pointer} pulseRef={pulse} total={total} count={N} />
      <div className="view">
        <div ref={tilt} className="layer">
          <div ref={stage} className="layer">
            {moments.map((m, i) => (
              <section
                key={m.id}
                ref={(el) => {
                  els.current[i] = el;
                }}
                className="st"
                aria-label={m.label}
                style={{ transform: `translate(-50%, -50%) translateZ(${-i * SPACING}px)` }}
              >
                <MomentView m={m} />
              </section>
            ))}
          </div>
        </div>
      </div>
      <Hud moments={moments} active={active} onGo={goTo} onPulse={firePulse} />
      <div style={{ height: total / 3 + vh }} aria-hidden="true" />
    </>
  );
}
