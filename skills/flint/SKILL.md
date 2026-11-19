---
name: flint
description: Turn an idea or known need into a justified next investment before coding. Use when the user says "flint this", "scope this project", "is this worth building", "before we write code", asks for a documentation-only scaffold, project charter/spec/plan/design, or wants to turn reference projects into a new project definition. Also use to revisit a project when constraints or evidence change. Not for a routine bug fix, an already-approved implementation slice, market research alone, or merely editing a document.
metadata:
  author: Marc J. Greenberg (codemarc)
  version: "0.1.0"
  requires: trailcard
---

# Flint

You bring the kindling. Flint tests whether it can catch.

A buildable plan is not yet a reason to build. Find the next investment the evidence supports. Sometimes that is an experiment. Sometimes it is a smaller project. Sometimes it is nothing.

A [Braintrailz](https://braintrailz.com) composition by [codemarc](https://github.com/codemarc). Trailcard governs the action. Flint defines the project.

## First: establish the contract

Read the available **Trailcard** skill, or ask for its location. Use it to establish the applicable purpose, acceptable outcome, authority, judgment, action and evidence before acting.

If the user supplied a suitable card, work from it and its approval state. Do not demand another installation merely to read a card. If neither Trailcard nor a suitable card is available, explain the prerequisite and ask for one before governed work. Do not silently invent a substitute. You can still explain the method.

Preserve the original instruction verbatim and link later clarifications instead of rewriting the original. Do not republish secrets: record a clearly labeled redaction and source reference where needed.

Read the existing project instructions, definitions and relevant source material. Check actual files and supported interfaces. A README, prior agent's claim and observed behavior are different evidence.

## Pick the smallest honest treatment

- **Decision first:** when need, feasibility or constraints are uncertain, give a compact decision brief. Use [assets/DECISION.md](assets/DECISION.md). Do not generate five documents to hide an unanswered question.
- **Compact definition:** a small project can have five short files. Keep each fact in its own home; link instead of repeating.
- **Full definition:** use the five artifacts when scope, dependencies, interfaces or risk warrant the detail.
- **Revisit:** preserve approved decisions, identify the new evidence, and change only the affected scope, spec, plan and design.

Do not turn a routine fix into project inception. An existing approved slice should be implemented under its existing contract, not sent through this doorway again.

## 1. Name what matters

Who needs what outcome? What do they do today? What counts as useful, and what would satisfy the words while missing the point?

Separate **facts**, **user reports**, **assumptions**, **proposals** and **unknowns**. Cite the source of decisions. Demand may be known to the user, assumed, or outside this exercise. Do not turn technical feasibility into market validation.

Compare building, adapting, buying, using the existing tool and doing nothing where relevant. Evaluate experience, complementary capabilities, continuity, fidelity and maintenance as well as feature coverage. "The terminal already does it" does not settle whether another surface is valuable.

## 2. Establish the delivery envelope

Read [references/envelope.md](references/envelope.md) when setting constraints or NFRs.

Record time, scope, quality, cash/compute cost, human capacity, dependencies and ongoing burden. Distinguish deadlines from preferences, elapsed time from human effort, estimates from commitments, and fixed limits from negotiable scope.

Unknown is an honest value, not unlimited permission. Give it an owner, consequence and resolution gate. Ask only questions that change the next decision. Missing a total-product budget need not block already-authorized local research; it does block an unsupported delivery commitment.

For each relevant NFR, record a target or explicit unknown, measurement, owner and gate. Give a reason when a category is not applicable. A number without a basis is decoration.

## 3. Test the load-bearing uncertainty

What could make this approach wrong? Start there.

Define a bounded investigation: question, permitted methods and side effects, effort limit or unresolved limit, expected evidence, and stop condition. An inability to establish a supported interface is a finding, not a license to fabricate one.

Read [references/decisions.md](references/decisions.md) for the decision rubric.

Recommend **Proceed**, **Investigate**, **Rescope**, **Defer** or **Stop** for a named next investment. Show hard blockers, alternatives and what would change the recommendation. A weighted score cannot erase a fatal constraint.

The owner decides within the existing authority. Permission for the current research does not need to be asked for again; permission to research does not become permission to deploy.

## 4. Leave a definition someone can use

When warranted, use these templates as starting points, not a form-filling quota:

| Artifact | Owns | Template |
| --- | --- | --- |
| `1-PROJECT.md` | Purpose, outcome, decision, constraints, owners | [Project](assets/1-PROJECT.md) |
| `2-TERMS.md` | Vocabulary and crosswalks | [Terms](assets/2-TERMS.md) |
| `3-SPEC.md` | Behavior, NFRs and acceptance | [Spec](assets/3-SPEC.md) |
| `4-PLAN.md` | Vertical slices, dependencies, exits | [Plan](assets/4-PLAN.md) |
| `5-DESIGN.md` | Interaction, structure and tradeoffs | [Design](assets/5-DESIGN.md) |

Keep the Trailcard alongside or link to its agreed location. Do not duplicate or overwrite it with a competing governance model.

Trace requirements to source intent or an explicit clarification, and to the slice that addresses them. Spec governs behavior; a plan note does not silently amend it. Label design candidates as candidates.

Each slice includes the relevant code, tests, guidance and docs. Define the first useful end-to-end result, not all schemas followed by all APIs followed by all screens. A visual prototype, runtime qualification and release are different results.

Respect an explicit no-code instruction. Otherwise, if the current instruction already authorizes a bounded next slice, proceed when its gates are met. Do not manufacture an extra approval ritual.

## 5. Check the handoff

Use the read-only helper if Node.js 22+ is available:

`node <skill-directory>/scripts/validate.mjs <project-directory>`

It checks the full five-file definition, card shape, basic sections, placeholders, requirement IDs and a documented subset of Markdown links. `--format json` returns the same findings as data. It does not grade judgment, source truth, security or project viability. A decision brief need not pass a full-definition check.

Run these thinking tests as well:

- **Fresh reader:** can another capable participant find the original outcome, evidence, decisions, authority and next action without a recap?
- **Over-optimization:** what harmful shortcut would satisfy the goal? Is it outside authority?
- **Proportionality:** did the documents reduce uncertainty, or just increase volume?
- **Correction:** did contrary evidence change the recommendation, or merely acquire a footnote?

An independent reader or model run is a separate test. Do not claim one happened because you imagined it. Review divergent answers for missing specification or legitimate bounded choices.

## Report in this order

1. **Decision:** named next investment and recommendation.
2. **Why:** evidence, alternatives, constraints and blockers.
3. **Artifacts:** what was actually created or changed.
4. **Next action:** owner, authority, gate and evidence required.
5. **Audit:** use Trailcard's evidenced/asserted/missing claims and its verdict. Say what remains unverified.

If the correct answer is Stop, say it and preserve the reason. Do not generate a scaffold to make a stopped project look productive.

## The method behind the tool

Read [references/braintrailz.md](references/braintrailz.md) for the composition notes and [references/examples.md](references/examples.md) for synthetic cases. Keep private source projects out of distributable examples.
