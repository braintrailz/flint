# Working in Flint

Flint is a project-definition skill using Trailcard, not a provider client or hosted service.

- Use JavaScript ES modules and Node.js 22+ for scripts/tests/tooling. Prefer built-ins; do not introduce another runtime or dependencies for convenience.
- `npm run check`: syntax checks and offline `node:test` cases. `npm run validate`: read-only structural validation of the root definition.
- `npm run package`: local allowlisted skill ZIP. Use `-- --force` only to rebuild an existing derived archive.
- `npm run evals`: inspect proposed cases. It does not invoke models or generate scores.
- Preserve original intent and later clarifications in `TRAILCARD.md`. Update the spec for behavior changes and distinguish implemented from independently evaluated.
- Keep private root cards and reference-project content out of the distributable. No global installation, commits or publication unless requested.
