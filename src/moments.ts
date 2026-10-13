import { completed, hackathons, ongoing, skills } from "./data/content";
import type { Project, Skill } from "./data/content";

export type Stage = "Completed" | "Hackathon" | "Ongoing";

export type Moment =
  | { id: string; area: string; label: string; kind: "hero" }
  | { id: string; area: string; label: string; kind: "about" }
  | { id: string; area: string; label: string; kind: "help" }
  | { id: string; area: string; label: string; kind: "skill"; skill: Skill }
  | { id: string; area: string; label: string; kind: "project"; stage: Stage; project: Project }
  | { id: string; area: string; label: string; kind: "beyond" }
  | { id: string; area: string; label: string; kind: "contact" };

/** Turns the content file into the ordered list of moments you fly through. */
export function buildMoments(): Moment[] {
  const list: Moment[] = [
    { id: "hero", area: "Arrival", label: "Arrival", kind: "hero" },
    { id: "about", area: "Who I am", label: "About me", kind: "about" },
    { id: "help", area: "How I can help", label: "How I can help", kind: "help" },
  ];
  skills.forEach((s, i) =>
    list.push({ id: `skill-${i}`, area: "How I can help", label: s.group, kind: "skill", skill: s })
  );
  const add = (items: Project[], stage: Stage, area: string) =>
    items.forEach((p, i) =>
      list.push({ id: `${stage}-${i}`, area, label: p.title, kind: "project", stage, project: p })
    );
  add(completed, "Completed", "Work I've done");
  add(hackathons, "Hackathon", "Hackathons");
  add(ongoing, "Ongoing", "Ongoing work");
  list.push({ id: "beyond", area: "Beyond the code", label: "Beyond the code", kind: "beyond" });
  list.push({ id: "contact", area: "Contact", label: "Contact", kind: "contact" });
  return list;
}

/** Every morph pattern. Each visit uses a random order, and no pattern repeats within that visit. */
export type ShapeKey =
  | "sphere" | "rings" | "torus" | "cube" | "helix" | "grid" | "burst"
  | "dna" | "octa" | "tetra" | "wave" | "spiral" | "lissajous" | "cylinder"
  | "flower" | "mobius" | "saddle" | "gyroscope" | "lattice" | "bicone"
  | "trefoil" | "vortex" | "pinwheel" | "hexagon";

export const ALL_SHAPES: ShapeKey[] = [
  "sphere", "rings", "torus", "cube", "helix", "grid", "burst",
  "dna", "octa", "tetra", "wave", "spiral", "lissajous", "cylinder",
  "flower", "mobius", "saddle", "gyroscope", "lattice", "bicone",
  "trefoil", "vortex", "pinwheel", "hexagon",
];

export function morphKeys(moments: Moment[]): ShapeKey[] {
  const pool = [...ALL_SHAPES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return moments.map((_, i) => pool[i % pool.length]);
}
