import { activities, certifications, profile } from "../data/content";
import type { Moment } from "../moments";

function Chips({ items }: { items: string[] }) {
  return (
    <div className="chips">
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}

export default function MomentView({ m }: { m: Moment }) {
  switch (m.kind) {
    case "hero":
      return (
        <>
          <h1>{profile.name}</h1>
          <p className="lead">
            <em>{profile.role}</em>
          </p>
          <p className="hint">Scroll to fly in. Drag the orb, click empty space or press Space to pulse it.</p>
        </>
      );
    case "about":
      return (
        <>
          <div className="kicker">Who I am</div>
          <h2>A student who builds.</h2>
          <p>{profile.intro}</p>
          <div className="card">
            <strong>{profile.education.degree}</strong>
            <span>{profile.education.school}</span>
            <span>
              {profile.education.period} · CGPA {profile.education.cgpa} · {profile.location}
            </span>
          </div>
        </>
      );
    case "help":
      return (
        <>
          <div className="kicker">How I can help</div>
          <h2>What I bring to your team.</h2>
          <p>
            Six areas of skill, each with what it means in practice. Keep flying to see them, then the work they
            produced.
          </p>
        </>
      );
    case "skill":
      return (
        <>
          <div className="kicker">Skills</div>
          <h2>{m.skill.group}</h2>
          <Chips items={m.skill.items} />
          <p>{m.skill.help}</p>
        </>
      );
    case "project":
      return (
        <>
          <div className="kicker">{m.stage === "Ongoing" ? "Ongoing project" : `${m.stage} project`}</div>
          <h2>{m.project.title}</h2>
          <p>{m.project.blurb}</p>
          <Chips items={m.project.tags} />
        </>
      );
    case "beyond":
      return (
        <>
          <div className="kicker">Activities and certifications</div>
          <h2>Beyond the code.</h2>
          <ul className="list">
            {activities.map((a) => (
              <li key={a}>{a}</li>
            ))}
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="hint">Certificates available on request.</p>
        </>
      );
    case "contact":
      return (
        <>
          <div className="kicker">Contact</div>
          <h2>Let's build something.</h2>
          <p>Open to internships, collaborations and interesting problems.</p>
          <a className="btn" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="btn alt" href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="btn alt" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </>
      );
  }
}
