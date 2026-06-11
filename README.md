# Earnings Counter

Live counter showing how much you've earned this month based on your monthly salary.

## Development

```bash
docker compose up
```

Open http://localhost:5173.

## Deployment

Deployed on Vercel. The `engines.node` field in `package.json` pins the Node.js version — Vercel uses it to match the local environment. Do not remove it.

## Scripts

- `npm run dev` — dev server
- `npm run build` — type-check + production build
- `npm run test` — run tests
- `npm run lint` — ESLint
- `npm run format` — Prettier
