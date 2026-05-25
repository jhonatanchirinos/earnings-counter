Generate a conventional commit message for the current staged changes and commit.

Steps:

1. Run `git diff --cached` to see staged changes. If nothing staged, run `git status` and tell the user.
2. Analyze the diff to determine:
   - **type**: `feat` | `fix` | `refactor` | `style` | `test` | `docs` | `chore` | `build` | `ci` | `perf`
   - **scope** (optional): the module/area affected (e.g. `store`, `composable`, `utils`, `ui`)
   - **subject**: imperative, lowercase, ≤50 chars total with type+scope, no period
   - **body** (optional): only if the _why_ is not obvious from the subject
   - **breaking change** (optional): `BREAKING CHANGE:` footer if applicable
3. Commit using: `git commit -m "$(cat <<'EOF'\n<message>\nEOF\n)"`

Format:

```
<type>(<scope>): <subject>

[optional body — the why, not the what]

[optional footer: BREAKING CHANGE: ...]
```

Examples:

```
feat(store): add salary persistence to localStorage

fix(composable): stop interval leak on unmount

refactor(utils): extract getSalaryPerSecond from calculateEarnings

chore: add commitizen config
```

Rules:

- Subject: imperative mood ("add" not "added"), lowercase, no period
- Body: only when WHY is non-obvious
- Co-Authored-By trailer: always append `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
