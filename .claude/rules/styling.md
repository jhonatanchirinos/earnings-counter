# Styling

Tailwind v4 custom design tokens live in `src/assets/main.css` under `@theme`:

| Token                 | Value                                            |
| --------------------- | ------------------------------------------------ |
| `--color-gold`        | `#c9a84c` — primary accent                       |
| `--color-gold-light`  | `#e8c76a` — hover accent                         |
| `--color-gold-dim`    | `#7a6530` — secondary accent                     |
| `--color-cream`       | `#f0ead6` — body text                            |
| `--color-cream-muted` | `#7a7060` — labels/metadata                      |
| `--color-bg`          | `#0d0d0b` — page background                      |
| `--color-bg-surface`  | `#131310` — input background                     |
| `--color-border`      | `#222018` — borders                              |
| `--color-error`       | `#c05050` — error text                           |
| `--font-display`      | Playfair Display (serif) — large numeric display |
| `--font-mono`         | DM Mono (monospace) — labels, inputs, metadata   |

Custom animations: `animate-float`, `animate-slide-down`, `animate-slide-up`, `animate-fade-in`.

The `.grain-bg` utility class (defined in `@layer utilities`) adds a subtle noise texture overlay.
