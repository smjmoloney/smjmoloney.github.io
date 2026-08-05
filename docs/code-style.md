# Code Style

Thread Tracker follows the principles in the [React + TypeScript Style Guide](https://github.com/mlane/react-typescript-style-guide): predictable feature ownership, separation of concerns, small components, explicit contracts, and minimal abstraction.

## Project conventions

- Keep interactive product code in `src/features/<feature-name>`. Astro files in `src/pages` define routes and hydration only.
- Use named arrow-function components. A component should have one responsibility and should generally remain below 150 lines.
- Order component code as hooks, derived values, effects, handlers, then JSX. Prefer early returns over nested conditionals.
- Define component props with `interface`. Use `type` for domain models, hook returns, unions, and utility contracts.
- Keep feature-specific hooks, utilities, and components inside their feature. Move code to shared `src/lib` or `src/types` only after more than one feature owns the concern.
- Presentational components receive data and intent-based callbacks. They do not import persistence APIs or unrelated feature state.
- Use explicit imports inside a feature. A feature-level `index.ts` exposes only its public API to routes or other features.
- Prefer descriptive names over comments. Comments explain only browser limitations, external constraints, or non-obvious decisions.
- Add abstractions when they remove demonstrated duplication or isolate a reason to change. Do not introduce generic wrappers, context, or global state speculatively.

## Exceptions

- Astro route components follow Astro syntax rather than React component conventions.
- Generated catalogue data is excluded from formatting and linting.
- Namespace imports are allowed for Radix primitive packages because each primitive family is intentionally consumed as one compound API.

## Pull request checks

Run `npm run check` and `npm run build`. Changes to interactive behavior also require focused component tests and mobile/desktop browser validation.
