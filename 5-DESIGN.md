# Flint design

**Updated:** November 19, 2026. Local v0.1 skill package implemented; human/model acceptance pending.

## 1. Experience

Flint should feel like a capable technical partner framing a decision, not an intake form that demands every field before thinking. Research what can be established, ask only what changes the decision, and show the recommendation with its evidence and limits.

Start with the idea and applicable Trailcard. Return a compact decision before generating extensive artifacts for an uncertain project. Expand the five-file scaffold when warranted; document volume is not progress.

## 2. Information order

1. What outcome is wanted, preserving the original instruction.
2. What is known, assumed, proposed and unknown.
3. The next-investment recommendation and alternatives.
4. Constraints and the evidence needed to cross the next gate.
5. Definition details, linked from their single authoritative home.
6. Completion audit and next authorized action.

Use plain language and explicit states. Distinguish “a user values this experience” from “a supported integration can deliver it.”

## 3. Five artifact surfaces

- **Project:** purpose, beneficiaries, alternatives, decision, delivery envelope, owners and milestones.
- **Terms:** vocabulary and provider/domain crosswalks; no silent redefinition.
- **Spec:** requirements, relevant NFRs, acceptance and traceability.
- **Plan:** dependency-ordered vertical slices, gates and observed exits.
- **Design:** interaction, information architecture and technical tradeoffs, not implementation authority.

The Trailcard is linked alongside the five, not duplicated in each. Original intent stays canonical and is never overwritten with a more convenient interpretation.

## 4. Implemented skill package

One small `skills/flint/SKILL.md` entrypoint with trigger/prerequisite/workflow/output guidance; load templates and references progressively. The package uses:

- `assets/`: proportionate artifact templates.
- `references/`: delivery-envelope questions, pursuit rubric, NFR guidance and sanitized examples.
- `scripts/validate.mjs`: limited mechanical validator in the skill.
- Root `scripts/package.mjs`: allowlisted, deterministic local archive builder using Node compression and ZIP32 headers.
- Root `scripts/review-evals.mjs` and `evals/evals.json`: proposed prompts, validated/displayed without model calls or invented results.
- Root `tests/flint.test.mjs`: Node's built-in test runner with synthetic temporary projects.

These files now exist. JavaScript ES modules and Node 22+ are the selected tooling; no dependencies, compiler or second runtime are required. Only the 12 allowlisted skill resources and the MIT LICENSE enter the archive. Root working cards, definitions, tests and evals are excluded. No vendor-specific API or orchestration framework belongs in the portable center.

## 5. NFR record shape

For each relevant quality concern, record: requirement ID, source/rationale, target or explicit unknown, measurement, owner, decision gate and evidence status.

Time/effort/cost records distinguish elapsed time, human engineering/review time, agent usage and recurring operations. An estimate carries its basis and uncertainty; no invented precision.

## 6. Pursuit decision shape

Show the decision, named next investment, rationale, hard blockers, evidence, alternatives and what would change the recommendation. Never let a composite score cancel a fatal constraint.

Evaluate experience and complementary function independently of feature duplication. In the warp-code example, a TUI inside the editor is a baseline; visual workflows and continuity are separate questions. Do not preselect either “no wrapper” or “full wrapper.”

## 7. Validation and evaluation

A validator may flag absent files, broken links, unresolved references and missing declarations. It must call itself a mechanical check, not an autonomous investment committee or security certification.

Human/model evaluation examines whether the method preserved intent, exercised useful bounded judgment and produced an appropriate next decision. Fresh-reader continuity and over-optimization tests complement formatting checks. Use Trailcard's existing audit rubric rather than inventing a competing verdict system.

## 8. Branding

Use **Braintrailz Flint** in introductory material and **Flint** in ordinary sentences. Sample: “Run Flint on this idea before we write code.” A defer/stop finding is a legitimate result, not a failed spark that the agent must force into a fire.

No logo, domain or extension ID is decided by this document. The current public source is https://github.com/braintrailz/flint under MIT; versioned GitHub release publication is an owner action.
