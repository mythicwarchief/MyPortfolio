import type { Moment } from "../moments";

type Props = {
  moments: Moment[];
  active: number;
  onGo: (i: number) => void;
  onPulse: () => void;
};

export default function Hud({ moments, active, onGo, onPulse }: Props) {
  const N = moments.length;
  const cur = moments[active];
  const next = moments[Math.min(N - 1, active + 1)];
  return (
    <>
      <header className="top">
        <div className="brand">
          Vaishnav Nair<span className="area">{cur.area}</span>
        </div>
        <div className="right">
          <button className="pill" onClick={onPulse} aria-label="Pulse the orb">
            Orb <kbd>Space</kbd>
          </button>
          <span className="count">
            Moment {active + 1} / {N}
          </span>
        </div>
      </header>
      <footer className="bottom">
        <button className="step" onClick={() => onGo(active - 1)} disabled={active === 0}>
          Previous
        </button>
        <div className="track">
          <div className="meta">
            <span>{cur.label}</span>
            <span>{active < N - 1 ? `Next: ${next.label}` : "End of the flight"}</span>
          </div>
          <div className="bar">
            <i style={{ width: `${(active / (N - 1)) * 100}%` }} />
          </div>
          <div className="dots">
            {moments.map((m, i) => (
              <button
                key={m.id}
                className={i === active ? "on" : ""}
                onClick={() => onGo(i)}
                aria-label={`Go to ${m.label}`}
              />
            ))}
          </div>
        </div>
        <button className="step primary" onClick={() => onGo(active + 1)} disabled={active === N - 1}>
          Next
        </button>
      </footer>
    </>
  );
}
