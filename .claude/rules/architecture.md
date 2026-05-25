# Architecture

Layers with clear boundaries:

1. **`src/utils/`** — pure functions, no Vue reactivity. `earnings.ts` owns the earnings math:
   - `getDaysInCurrentMonth()`, `getElapsedSecondsThisMonth()` — time helpers
   - `calculateEarnings({ monthlySalary, elapsedSeconds, daysInMonth })` — main formula
   - `getSalaryPerSecond({ monthlySalary, daysInMonth })` — derived rate
   - Only these functions have unit tests.

2. **`src/composables/`** — Vue reactivity glue
   - `useEarningsCounter(monthlySalary: Ref<number | null>)` — runs `setInterval(updateEarningsState, 1000)` on mount, stops on unmount, re-runs on salary change. Returns `{ earnings, salaryPerSecond, daysInMonth, elapsedSeconds }`.
   - `useSalaryStorage()` — thin `localStorage` wrapper. Key: `'earnings-counter:salary'`. Returns `{ saveSalary, loadSalary, clearSalary }`.

3. **`src/stores/`** — Pinia
   - `useSalaryStore` — holds `monthlySalary: Ref<number | null>`, calls `useSalaryStorage` internally. `App.vue` calls `loadFromStorage()` on mount.

4. **`src/components/`** — Vue SFCs (`<script setup lang="ts">`)
   - `SalaryInput.vue` — owns the salary form, edit/error state, and writes through `useSalaryStore.setSalary`.
   - `EarningsDisplay.vue` — reads `monthlySalary` from the store and drives `useEarningsCounter` for the live numeric display.

5. **`src/types/`** — shared TypeScript types
   - `index.ts` — interfaces shared across layers (e.g. `EarningsSnapshot`).

Components consume the store via `storeToRefs` and pass the reactive ref down to composables. No component talks to `localStorage` directly.
