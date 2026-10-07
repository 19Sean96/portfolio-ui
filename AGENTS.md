# Portfolio

Sean's portfolio and browser lab, planned for seananthony.io. Started 2026-10-07 from the survey at `portfolio-research/past-portfolios.md` in the project files. Same toolchain as Berine: TanStack Start, React and TypeScript on Cloudflare Workers, pnpm, native CSS tokens.

## Rules

- **pnpm always.** Never `npm` or `yarn`.
- **Native CSS and custom properties.** Tokens live in `src/styles/tokens.css`. No Tailwind, no CSS-in-JS. No pixel font sizes; add a type role instead.
- **One canvas.** Pages and lab pieces never make a renderer. They ask the stage for a scene (`useStageScene`, or `ctx.showScene` in a lab piece).
- **One clock.** Anything that moves reads `src/motion/clock.ts`, directly or through a timeline. Reduced motion is handled there, once.
- **Content is typed data.** Projects are files under `src/content/projects/`, checked by `src/content/schema.ts` and the content test. No runtime fetch.
- **Show only built work.** A series (the AV pieces) lists its unfinished pieces as `in-progress` with no link, so the slot exists until it ships.
- **Case studies use diagrams, not screenshots of private work.** A `flow` block in a project body draws an animated flow chart on the shared timeline.
- **Absolute dates in docs.** Write "2026-10-07", never "today".

## Layout

| Path                 | What                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| `src/content/`       | The project schema, one file per project, bio copy                             |
| `src/stage/`         | The shared canvas: renderer, post chain (bloom, grain, vignette, fade), scenes |
| `src/motion/`        | The clock, timelines, page entrances                                           |
| `src/lab/`           | Capability checks, the experiment contract, the registry, experiments          |
| `src/audio/`         | The one AudioContext and its band levels                                       |
| `src/progress/`      | Saved discoveries in localStorage, and what counts toward the total            |
| `src/routes/`        | `/`, `/work`, `/work/$slug`, `/lab`, `/lab/$id`, `/about`                      |
| `public/media/work/` | Demo clips from portfolio-nextjs and the AV still                              |
| `public/lab/`        | Lab stills, shown in the index and as the fallback                             |

## Adding things

- **A project.** Write `src/content/projects/<slug>.ts`, list it in `src/content/index.ts`. Set `placeholder: true` while the copy is not real.
- **A scene.** A module under `src/stage/scenes/` whose default export is a `StageScene`. `fullscreenScene` covers a one-shader scene.
- **A lab piece.** A module under `src/lab/experiments/` whose default export is a `LabModule`, a still under `public/lab/`, and an entry in `src/lab/registry.ts` with what it `requires`. The lab page checks the browser and shows the still with the reason when a need is missing.
- **A discovery.** Call `progress().discover(id)`, and list the id in `src/progress/catalog.ts` if it should count toward the total.

## Checks

`pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`. `pnpm build` runs the Vite build and the typecheck. `pnpm dev` serves on http://localhost:3300.

## Deploy

Not deployed. `wrangler.jsonc` has no account or route yet; both wait on Sean saying where it ships.
