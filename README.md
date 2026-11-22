# The Flint Skill

You bring the kindling. Flint tests whether it can catch.

An Agent Skill that turns an idea into a justified next investment before you write code. Sometimes you get a project definition. Sometimes an experiment. Sometimes a reason not to build.

A [Braintrailz](https://braintrailz.com) composition by [codemarc](https://github.com/codemarc).

**Version:** 0.1.0, initial development. [Source is public](https://github.com/braintrailz/flint) under the [MIT license](LICENSE). For versioned packages and release notes, see [GitHub Releases](https://github.com/braintrailz/flint/releases).

## The idea

An agent can build a scaffold before anyone establishes whether it is the right thing to build. Five convincing documents can make the same mistake.

Flint separates the decision from the production. It researches constraints, names the uncertainty that matters, and leaves a definition the next person or agent can use without inheriting a chain of summaries.

**Trailcard governs the action. Flint defines the project.**

## What it does

- **Researches before prescribing.** Actual interfaces and source material, not plausible flags.
- **Sets the delivery envelope.** Time, scope, quality, cost, human capacity and ongoing burden.
- **Makes a scoped decision.** Proceed, Investigate, Rescope, Defer or Stop.
- **Leaves five artifacts when warranted.** Project, terms, spec, plan and design. Small project, short documents.
- **Evaluates experience as well as features.** A capable terminal does not settle the value of a complementary interface.
- **Preserves authority and evidence.** Uses Trailcard instead of inventing another governance model.
- **Stops when stopping is useful.** No scaffold as a consolation prize.

## Use it

Load [skills/flint/SKILL.md](skills/flint/SKILL.md) in an Agent Skills-compatible host.

- “Flint this: I want a local tool for checking project documents. No code yet.”
- “Scope this project from these repositories. What would make it worth pursuing?”
- “Revisit the definition. The interface we depended on is not supported.”
- “The CLI already does it, but review is awkward. Evaluate a native surface.”

The report starts with the decision, then evidence, actual artifacts, next authorized action and Trailcard audit. It does not force every task through a large questionnaire.

## Prerequisite and installation

Use the existing [Trailcard skill](https://github.com/braintrailz/trailcard), or supply the governing card and its approval state. Flint does not bundle or modify Trailcard. Dependency metadata is descriptive; hosts may not resolve it automatically.

### Install from public source

Clone the repository, or download its source ZIP from GitHub:

```bash
git clone https://github.com/braintrailz/flint.git
cd flint
```

Copy the whole `skills/flint/` directory into your host's supported skill directory. Keep `SKILL.md`, `LICENSE`, `assets/`, `references/` and `scripts/` together.

| Host | Destination |
| --- | --- |
| Claude Code | `~/.claude/skills/flint/` |
| Codex | `~/.codex/skills/flint/` |

Review an existing installation before replacing it. Follow your host's instructions for loading or discovering the skill.

### Install from a packaged release

Download the `.skill` asset for your chosen version from [GitHub Releases](https://github.com/braintrailz/flint/releases). It is a standard ZIP containing a top-level `flint/` directory. Use your host's supported skill importer, or extract that directory into its skill directory above. A public repository does not by itself mean a downloadable release asset exists.

To prepare your own archive from a checkout, use `npm run package`; see [Test and package](#test-and-package).

Cloning or packaging does not install the skill globally. End-to-end host/trigger compatibility is not yet qualified. The method is Markdown; optional helpers require **Node.js 22+**. All tooling is JavaScript with Node built-ins. No third-party dependencies or dependency installation.

## Check a full definition

From this repository:

```bash
node skills/flint/scripts/validate.mjs /path/to/project
node skills/flint/scripts/validate.mjs /path/to/project --format json
node skills/flint/scripts/validate.mjs /path/to/project --trailcard /path/to/agreed-card.md
```

The helper reads the five numbered artifacts and the card. It checks basic sections, unfilled template markers, duplicate requirement IDs, inline local links and heading fragments. It does not fetch web links or change the project.

Exit **0** means no structural errors, **1** means findings, **2** means usage/root error. Warnings do not fail the check. JSON includes `version`, `scope`, `root`, `filesChecked`, `errors`, `warnings` and `passed`; findings contain `path`, `code` and `message`.

Outside-root local references are warned about, not inspected. Symlinked artifacts/links escaping the boundary fail. An explicitly supplied external card is read within its own directory boundary. Reads are capped at 1 MiB per file with strict UTF-8 decoding. These checks are not a filesystem sandbox against concurrent hostile changes.

This is not a complete Markdown parser: reference-style links, HTML links, link titles, nested-parenthesis targets and setext headings are not validated. Factual accuracy, semantic traceability, adequate budgets, approval state and project viability still require review. A compact decision brief need not pass a full-definition check.

## Test and package

From this repository, with Node on PATH:

```bash
npm test
npm run check
npm run validate
npm run package
npm run evals
```

No install step is needed. You can run each command's Node script directly.

The packager creates `dist/flint-0.1.0.skill`, a standard ZIP containing 12 allowlisted skill resources plus the MIT `LICENSE`. It uses Node's built-in compression and a bounded ZIP32 writer, not a system ZIP executable. Root working documents, cards, tests and evaluation records stay out. Rebuilding an existing derived archive requires explicit `npm run package -- --force`. Nothing is installed, uploaded or published.

## How it's built

The entrypoint teaches the method. [Composition notes](skills/flint/references/braintrailz.md) explain the choices; [synthetic examples](skills/flint/references/examples.md) show useful decisions and failure modes.

The definition lives in [1-PROJECT.md](1-PROJECT.md) through [5-DESIGN.md](5-DESIGN.md). [TRAILCARD.md](TRAILCARD.md) records current implementation authority and the Node preference.

## v0.1 limits

Mechanical tests are not evidence of skill effectiveness. [Evaluation cases](evals/evals.json) are proposed, not executed model runs. `npm run evals` validates and displays them without calling a model or creating scores. Human review, with-skill/baseline runs, and real host qualification remain the next gate.

Node 22+ is the declared target; the build record names the runtime actually tested. Do not infer testing on every supported version or OS.

## License and sharing

Flint is available under the [MIT license](LICENSE), copyright Marc J. Greenberg. The skill directory and packaged archive include a copy of that license. Trailcard and neighboring projects retain their own licenses; their implementation source is not bundled.

The root Node package is marked `private: true` to prevent accidental npm publication. This does not make the GitHub source private or restrict distribution under MIT.

Version 0.1.0 identifies the current initial-development package. A 1.0.0 release would signal a stable documented contract for users to rely on; it is not required merely to publish a first downloadable bundle. Once a versioned bundle is released, publish subsequent changes under a new version rather than replacing that release's contents.
