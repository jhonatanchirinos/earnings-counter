# Code Style

## Function Body Spacing

Blank line between statements of different kinds (call vs assignment vs conditional vs `return`). Exceptions — group without blank line:

- Consecutive `const`/`let` declarations forming a single logical setup
- Consecutive state assignments forming one conceptual group (e.g. resetting multiple fields)
- Single-statement bodies

In tests: blank line before `expect` when setup lines precede it; consecutive `expect` calls on the same subject stay grouped.

```ts
// correct
function loadSalary(): number | null {
  const storedSalaryString = localStorage.getItem(STORAGE_KEY)
  if (!storedSalaryString) return null // declaration + guard grouped (same variable)

  const parsedSalaryValue = parseFloat(storedSalaryString)
  const validatedSalary =
    isNaN(parsedSalaryValue) || parsedSalaryValue <= 0 ? null : parsedSalaryValue

  return validatedSalary
}

function startCounter(): void {
  updateEarningsState() // call

  intervalId = setInterval(updateEarningsState, 1000) // assignment — different type
}

function stopCounter(): void {
  if (intervalId !== null) {
    clearInterval(intervalId) // call

    intervalId = null // assignment — different type
  }
}

// correct — tests
it('calculates correctly', () => {
  const expected = 3000 / (30 * 86400) // setup

  expect(getSalaryPerSecond({ monthlySalary: 3000, daysInMonth: 30 })).toBeCloseTo(expected) // assertion
})
```

## Return Statements

`return` must return a named `const`, not a raw expression. Name the variable to make the return value self-documenting.

Exceptions — raw expression OK when:

- Guard/early return of a literal: `return null`, `return 0`, `return ''`
- Object return of already-named variables: `return { saveSalary, loadSalary }`
- Single-expression arrow function (no `return` keyword): `computed(() => value.toFixed(2))`

```ts
// wrong
return Math.min((earnings.value / monthlySalary.value) * 100, 100)

// correct
const clampedProgressPercent = Math.min((earnings.value / monthlySalary.value) * 100, 100)

return clampedProgressPercent
```

## Parameter Style

Use an object parameter for functions with 2+ parameters. Use a bare parameter for a single parameter only when the function name makes the expected value unambiguous.

```ts
// 2+ params → always object
export function calculateEarnings({
  monthlySalary,
  elapsedSeconds,
  daysInMonth,
}: {
  monthlySalary: number
  elapsedSeconds: number
  daysInMonth: number
}): number { ... }

// 1 param, self-evident from function name → bare param OK
function saveSalary(salary: number): void { ... }
function getById(id: string): User { ... }

// 1 param, ambiguous → object
function process({ data }: { data: Blob }): void { ... }
```

## Naming Conventions

Apply these rules to all new and modified code:

- **No abbreviations** — use full words. Exceptions: `id`, `url`, `api`, `ref` (Vue template refs).
- **Local variables** — same descriptiveness standard as public names. `storedSalaryString`, not `stored`; `fractionalPart`, not `frac`.
- **Functions** — verb + noun that describes exactly what happens: `updateEarningsState`, `startCounter`, `loadSalary`. Avoid generic names like `tick`, `start`, `run`.
- **Booleans** — prefix `is`, `has`, `can`, or `should`: `isEditing`, `hasSalary`.
- **Event handlers** — prefix `handle` + event noun: `handleSubmit`, `handleKeydown`.
- **Event parameters** — spell out the full type: `keyboardEvent`, `mouseEvent`, not `e`.
- **Composables** — prefix `use` + domain noun: `useEarningsCounter`, `useSalaryStorage`.
- **Pinia stores** — prefix `use` + entity + `Store`: `useSalaryStore`.
- **Template refs** — suffix `Ref`: `inputRef`.

## Import Paths

Always use the `@` alias instead of relative paths. `@` maps to `src/`.

```ts
// correct
import { useSalaryStore } from '@/stores/salary'
import { useEarningsCounter } from '@/composables/useEarningsCounter'

// wrong
import { useSalaryStore } from '../stores/salary'
import { useEarningsCounter } from '../../composables/useEarningsCounter'
```

Exception: CSS side-effect imports in `main.ts` use relative paths (`'./assets/main.css'`) since TypeScript resolves CSS assets differently.
