# Testing

- Test files live under `tests/` mirroring the `src/` layout (e.g. `src/utils/earnings.ts` → `tests/utils/earnings.test.ts`).
- Filename pattern: `<module>.test.ts`. Only pure functions under `src/utils/` are unit-tested; composables/components are exercised via the running app.
- Vitest runs with `globals: true` and `environment: node`. For time-sensitive code use `vi.useFakeTimers()` + `vi.setSystemTime()` and restore with `vi.useRealTimers()` in `afterEach`.

Run a single test file:

```bash
npx vitest run tests/utils/earnings.test.ts
```
