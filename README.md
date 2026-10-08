# Vaishnav Sunil Nair: Portfolio

An immersive, interactive portfolio where scrolling doesn't move you down a page. It moves you **forward through a 3D space**, one "moment" at a time, from who I am, to what I can do, to the work I've built.

## About me

B.Tech Computer Science and Engineering (Artificial Intelligence) student at Amrita Vishwa Vidyapeetham, Amritapuri Campus. I'm keen on solving real-world business problems using AI and ML, and I like building agents, models and software that do real work.

## What's in the portfolio

| Area | What you'll find |
| --- | --- |
| Who I am | A short introduction and my education |
| How I can help | My skills (languages, AI and ML, data, development, tools, concepts), each with what it means in practice |
| Work I've done | Completed projects: Smart Fire Evacuation Planner, AQI Prediction, SkillSwap, Digital Complaint Management System, CNN on MNIST |
| Hackathons | NyayaBot (Epochon 2.0) and Nirikshan (Smart India Hackathon 2026) |
| Ongoing work | Intelligent Ledger Orchestration System |
| Beyond the code | ACM SIG-AI membership and certifications |

## How to explore it

- **Scroll** to fly forward into the scene. Each section approaches you out of the depth.
- **Previous / Next**, the **arrow keys** and the **dots** at the bottom jump between moments.
- **The orb** is interactive: drag it to spin it, and click empty space or press **Space** to send a pulse through it.
- Move your mouse to tilt the scene slightly.

Reduced-motion preferences are respected, and the layout adapts to mobile screens.

## Built with

- [React](https://react.dev) and [TypeScript](https://www.typescriptlang.org)
- [Three.js](https://threejs.org) for the 3D tunnel, particles and the orb
- [Vite](https://vite.dev) for the build
- CSS 3D transforms for the content layers that fly toward you
- Hosted on [Vercel](https://vercel.com)

## How it works

The page is a list of "moments" built from a single content file. Scroll position is mapped to depth: instead of translating the page vertically, the content layers move along the Z axis while the Three.js camera travels the same distance through a field of particles and gates. The orb stays in front of the camera as you fly.

## Project structure

```
src/
  data/content.ts            All text: profile, skills, projects, certifications
  moments.ts                 Turns content into the ordered flight path
  App.tsx                    Scroll-to-depth flight, keyboard and layout
  components/Scene.tsx       Three.js background and the interactive orb
  components/MomentView.tsx  Layout for each kind of moment
  components/Hud.tsx         Top and bottom navigation HUD
  styles.css                 Palette, typography and layout
```

## Run it locally

Requires Node 20 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

To adapt it for your own portfolio, edit `src/data/content.ts`. See [DEPLOY.md](DEPLOY.md) for editing and deployment notes.

## Connect

- GitHub: [@mythicwarchief](https://github.com/mythicwarchief)
- LinkedIn: [Vaishnav Sunil Nair](https://www.linkedin.com/in/vaishnav-nair-31b811437)