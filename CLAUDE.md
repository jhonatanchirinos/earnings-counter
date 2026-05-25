# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (Vite)
npm run build        # type-check then build (vue-tsc && vite build)
npm run preview      # preview production build locally
npm run test         # run tests once (Vitest)
npm run test:watch   # run tests in watch mode
npm run lint         # ESLint on .vue and .ts files
npm run format       # Prettier over src/ and tests/
```

## Dependencies

Install all packages with exact versions — no `^` or `~` prefixes. `.npmrc` sets `save-exact=true` so the flag is implicit, but keep it explicit if scripting installs.

```bash
npm install <package>
npm install --save-dev <package>
```

## Stack

- **Vue 3** — Composition API, `<script setup lang="ts">` everywhere
- **TypeScript** — strict mode, `moduleResolution: Bundler`
- **Pinia** — Composition API store style (`defineStore('id', () => { ... })`)
- **Tailwind CSS v4** — no config file; theme defined in `src/assets/main.css` via `@theme {}` block; integrated via `@tailwindcss/vite` plugin
- **Vitest** — `globals: true`, `environment: node`; fake timers via `vi.useFakeTimers()` + `vi.setSystemTime()`
- **Docker** — single-stage dev container (node:24-alpine) for local-only use; production deploys go to Vercel/Amplify (no Dockerfile build)

## Project Rules

Modular rule files live in `.claude/rules/`. They are inlined here via `@` imports so Claude Code auto-loads them; edit the source files, not this index.

@.claude/rules/architecture.md

@.claude/rules/styling.md

@.claude/rules/testing.md

@.claude/rules/code-style.md
