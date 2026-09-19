<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project agent rules

## Quality gates (always)

Before considering work done, always:

1. Write or update tests for new behavior and bug fixes (`*.test.ts` / `*.test.tsx` next to the code, Vitest).
2. Run `npm run test`.
3. Run `npm run format` (Prettier + ESLint + typecheck).
4. Fix any failures before handing off.

Do not skip these steps for “small” changes. Husky runs `npm run format` on commit; CI also runs lint, typecheck, and tests.

## Follow existing patterns

- Match local naming, folder layout, imports (`@/…`), and component style before inventing new abstractions.
- Keep UI consistent with existing folio components, tokens, and Tailwind classes — no one-off design systems.
- Prefer focused diffs: only change what the task requires; avoid drive-by refactors and unsolicited docs.
