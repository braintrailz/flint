# Flint specification

**Version:** 0.1.0 local implementation · November 19, 2026.
**State:** Skill, templates and Node helpers implemented; mechanical checks pass; independent effectiveness evaluation not run.
**Authority:** Marc authorized v0.1 implementation and the Node migration. Global installation/publication and model-evaluation runs remain gated by `TRAILCARD.md`.

**A1 — Node implementation (November 19, 2026).** All shipped scripts, tests, packaging and proposed-case review use JavaScript ES modules and Node built-ins, targeting Node 22+. No third-party dependency or second runtime is required. The method remains Markdown. A compatible existing Trailcard can satisfy the prerequisite without another install; already-authorized work does not need another approval ritual. Semantic/model performance remains unverified.

## 1. Governing contract

**FR-01 — Trailcard prerequisite.** Use the existing Trailcard skill to write/review the applicable card before governed action. Resolve it through the host or a supplied location, not a hard-coded user path. If neither skill nor suitable card is available, explain the prerequisite and stop before governed work. Do not silently impersonate or fork it.

**FR-02 — Intent and lineage.** Preserve original instructions verbatim, separately from interpretations, clarifications and decisions. Identify sources and dates; a new agent returns to the canonical artifacts rather than a summary of a summary. Label cards written after earlier work as retrospective for that work.

**FR-03 — Authority.** Carry Can / Needs approval / Never, expected judgment, escalation triggers, side effects and evidence into the assignment. Capability, a passing check and a plan do not independently grant authority. Leave bounded choice; do not reduce every assignment to a rigid script.

## 2. Framing and investigation

**FR-04 — Need and alternatives.** Identify beneficiary, desired outcome, present workaround and scope. Record whether demand is known, assumed or outside the exercise. Compare build/adapt/buy/use existing/do nothing where relevant.

**FR-05 — Value beyond parity.** Evaluate experience, complementary capability, continuity, fidelity and maintenance—not just missing features. A capable TUI does not invalidate a native UI; a prettier interface does not establish value by assertion.

**FR-06 — Delivery envelope.** Record time/deadline, human effort, compute/tooling cost, scope, quality floors, review capacity, dependencies and operating/maintenance burden. For each, state fixed/negotiable, source/owner and consequence. Unknowns need a resolution gate; never invent a budget or treat unknown as unlimited.

**FR-07 — Bounded research.** Define the question, permitted methods, expected evidence, effort limit or explicit unresolved limit, and stop condition. Prioritize uncertainties that can invalidate the approach. Public documentation is not a live qualification result.

## 3. Pursuit and definition

**FR-08 — Scoped decision.** Produce Proceed / Investigate / Rescope / Defer / Stop with evidence, blockers, alternatives and the named next investment. Hard constraints cannot be averaged away by a score. Do not assume every project must reach code.

**FR-09 — Proportional artifacts.** Produce `1-PROJECT`, `2-TERMS`, `3-SPEC`, `4-PLAN`, `5-DESIGN` when a definition is warranted. For small projects keep them short; for uncertain ideas start with a compact decision brief rather than automatically writing thousands of words.

**FR-10 — One fact, one home.** Charter owns purpose/constraints; terms owns vocabulary; spec owns behavior; plan owns sequencing/exits; design owns presentation. Trace requirements to source intent/clarifications and plan gates. A plan/design note cannot silently amend normative behavior.

**FR-11 — Measurable quality.** Consider security/privacy, correctness, performance/capacity, accessibility, compatibility, reliability/recovery, maintainability/operations and cost. Each relevant NFR includes a target, test/measurement, owner and gate. If a target is unknown, mark it unresolved; if not applicable, give a reason. Do not insert arbitrary numeric targets to look rigorous.

**FR-12 — Transition to execution.** Define the smallest authorized slice that tests the important hypothesis. Separate a visual prototype from backend qualification and from a release. Require explicit authority before executable scaffolding, installs, external changes or agent-run expansion.

## 4. Audit and handoff

**FR-13 — Fresh participant.** A capable new participant should find original purpose, accepted decisions, present evidence, unknowns and the next authorized action without this chat. Cross-model disagreement triggers inspection; it does not automatically prove every differing design is wrong.

**FR-14 — Evidence audit.** Use Trailcard's audit classifications and verdicts; report what was not verified. Preserve failures and stop decisions. Do not call the method effective solely because it was used to write its own documents.

**FR-15 — Validator boundary.** The Node validator checks the full five-file definition, Trailcard section names, basic sections, unfilled markers, requirement IDs and supported inline local links/anchors using synthetic positive/negative fixtures. Linked traceability sources are structurally checked only within the declared boundary. It does not assess semantic traceability, adequate requirements, factual truth, evidence sufficiency or permission.

## 5. Non-functional requirements for Flint

- **NFR-01 — Portability:** no mandatory vendor API, editor, model or absolute home path in the reusable skill. Verify with a fresh reader and relocated synthetic project.
- **NFR-02 — Privacy:** no secrets or private operational/account data in bundled examples. Inspect the distributable before release; synthetic examples identify their provenance.
- **NFR-03 — Proportionality:** scope/detail must have an explicit rationale; evaluate review burden and unnecessary output. A word-count target is not a quality measure.
- **NFR-04 — Determinism of mechanics:** validator tests run offline on temporary/synthetic files with no account state or network. Semantic evaluation is separate.
- **NFR-05 — Honest status:** specified, implemented, tested and accepted are distinct, with inspectable references. No benchmark or savings claim without measured evidence.
- **NFR-06 — Maintenance:** Trailcard dependency behavior is documented and version/provenance recorded when packaging. Ownership of future compatibility updates remains a release decision.

## 6. Planned acceptance cases

- **AC-01 — Small feasible tool:** proportionate definition, explicit constraints and an authorized next slice, not unnecessary architecture.
- **AC-02 — Unsupported integration:** identify the interface uncertainty, define a bounded investigation, never fabricate transport.
- **AC-03 — Hard constraint:** recommend rescope/defer/stop when a non-negotiable constraint cannot be met.
- **AC-04 — Complementary UI:** do not reject a native experience merely because the CLI has similar features; separate value from technical feasibility.
- **AC-05 — Fresh reader:** purpose, decisions, authority and next action survive handoff without a recap.
- **AC-06 — Missing Trailcard:** stop safely rather than silently substituting a different contract.
- **AC-07 — Bad artifacts:** validator rejects deliberate missing links/fields while disclaiming semantic judgment.

## 7. Status and traceability

FR-01–14 are expressed in `skills/flint/SKILL.md`, six templates and four references. Their ability to guide another agent is not independently evaluated. FR-15 is implemented in `skills/flint/scripts/validate.mjs` and tested with synthetic cases; AC-07 has mechanical rejection evidence. AC-01–06 remain proposed semantic/host evaluations, not passing model results.

Verified on Node v26.3.0/macOS: syntax checks and 32 `node:test` cases, root structural validation (zero errors; one warned outside-root source link), allowlisted deterministic ZIP creation, extracted-validator relocation and independent ZIP integrity. Node 22+ is the declared target, not a claim of testing every runtime/OS.

The validator accepts `PROJECT [--trailcard CARD] [--format text|json]`; exit codes are 0 (no structural errors), 1 (findings), 2 (usage/root error). Its documented Markdown subset excludes reference-style/HTML links, titled links, nested-parenthesis targets and setext headings. See `README.md` for output fields and limits.

FR-01–03 and FR-13–14 derive from Trailcard and Marc's article. FR-04–12 derive from the scaffold discussion, Waypoint/schwab-kit methodology and Marc's time/scope/quality concern. FR-05/AC-04 capture the later TUI/native-app clarification in [warp-code's card](../warp-code/TRAILCARD.md). The ordered work is [4-PLAN.md](4-PLAN.md).

## A2 — Distribution clarification (November 22, 2026)

Source is public under the existing MIT license. The portable skill directory and allowlisted archive must include that license unchanged. README distinguishes source installation, local packaging, and versioned GitHub release assets; publication is a separate owner action. Version remains 0.1.0. No skill workflow or validator semantics change in this amendment. Independent effectiveness and host compatibility remain unqualified.
