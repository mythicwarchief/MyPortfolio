# Developer notes: running, editing and deploying

React + TypeScript + Vite + Three.js. Scrolling moves you forward through a 3D tunnel of "moments".
Drag the orb, click empty space or press Space to pulse it. Arrow keys and the Previous/Next buttons also step through.

## Run it locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```
Needs Node 20 or newer.

## Edit or add content
Everything is in `src/data/content.ts`. To add a project, copy an entry into `completed`, `hackathons` or `ongoing`.
Nothing else needs to change: the flight path, progress bar and counter rebuild themselves.
Your GitHub, LinkedIn and email live in `profile` and appear only in the last moment.

## Put it on GitHub and Vercel
```bash
git init && git add . && git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
Then on vercel.com choose **Add New > Project**, import the repo and click **Deploy**.
Vercel detects Vite automatically (`vercel.json` is included). No environment variables are needed.

## Structure
- `src/data/content.ts`: all text and lists
- `src/moments.ts`: turns content into the ordered moments
- `src/App.tsx`: scroll-to-depth flight, keyboard and layout
- `src/components/Scene.tsx`: Three.js background and the neural orb
- `src/components/MomentView.tsx`, `Hud.tsx`: moment layouts and the top and bottom HUD
- `src/styles.css`: palette and layout
