# The delivery envelope

Ask what changes the next decision. Do not turn these prompts into an interrogation.

## Time and capacity

Separate a desired date from an immovable deadline. Count human engineering, review, support and integration time, not just an agent's elapsed run.

Record the available capacity and who owns it. Estimates have a basis and range; a date without either is a wish, not a forecast.

## Scope, quality and cost

What is the minimum useful outcome? What can move if time is fixed? Which safety/correctness floors cannot move?

Separate development cost, agent/compute usage, tooling, operations and ongoing maintenance. Existing subscriptions are not proof of zero marginal cost. No amount was supplied means unknown, not unlimited.

For each unresolved limit, say who owns it, what depends on it, and before which commitment it must be decided. Do not hold authorized reading hostage to an unrelated future hosting budget.

## Dependencies and reversibility

What interface, license, owner or service could invalidate the approach? What do the public docs establish, and what still needs a real test?

What side effects would an experiment have? Can it be retried safely? What survives a partial failure? Which decisions are costly to reverse?

## NFR ledger

For every relevant quality requirement, record:

**ID | source/rationale | target or explicit unknown | measurement | owner | gate | evidence status**

Consider:

- **Correctness:** examples and edge cases that can falsify the result.
- **Security/privacy:** trust boundaries, sensitive data, permissions, exposure.
- **Performance/capacity:** expected workload, latency/resources and how to measure them.
- **Accessibility:** applicable users/input methods and review procedure.
- **Compatibility:** declared hosts/versions and real qualification.
- **Reliability/recovery:** failure states, partial completion, retry/idempotency, recovery.
- **Maintenance/operations:** deployment, observability, owner, support and upgrade burden.
- **Cost/resources:** per-run/recurring limits, measurement and spending authority.

Use a reasoned non-applicable entry when a category does not apply. For a dependency-free local validator, service uptime may be irrelevant; deterministic errors and safe read boundaries still matter.

**Synthetic example:** "NFR-01: Validate a five-file definition without network or writes. Measure using offline tests and before/after file inventories. Owner: builder. Gate: before local handoff. Status: specified." It is testable without an invented response-time target.

## End with a decision

What is fixed? What can be reduced? What evidence earns the next investment? Stop defining when the current authorized decision is answerable.
