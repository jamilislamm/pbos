# PBOS Implementation Foundation

**Status:** Phase 0 implementation complete; no product feature is implemented.

## Repository map

The repository now contains a runnable, dependency-free responsive web shell,
shared engineering utilities, a local development server, and foundation
checks. It has no PBOS domain feature, database, state store, or product data.

The current architecture documents use unprefixed filenames. They correspond
to the `PBOS_*` filenames referenced inside the documents. The available
`APPLICATION_LOGIC.md` is the applicable next-stage document; no separate
`NEXT_ARCHITECTURE_STAGE` document exists.

## Implementation boundaries

Use a modular monolith with four logical areas:

```text
presentation -> application -> domain
infrastructure -> application/domain contracts
```

- **Domain:** pure PBOS definitions, validation, state transitions, duration
  calculation, and historical-integrity rules.
- **Application:** commands and queries that coordinate domain logic,
  repositories, transactions, and view models.
- **Infrastructure:** repository implementations, storage/migration mechanics,
  and clock/timer adapters.
- **Presentation:** screens, components, navigation, temporary form state, and
  rendering. It calls application commands/queries only.

`Today` is a derived application query, not a persisted master record. A timer
measures time but does not decide Session or source completion.

## Execution guardrails

Keep these separate in code and persistence:

```text
Project -> Roadmap -> Node / Next Action -> Session
Habit -> Daily Habit Execution -> Session
```

Both sources use the same Session concept. Do not create `HabitSession`,
`ProjectSession`, or a permanent `NextSession` concept. A completed Session
records an ended period of work; explicit source evaluation decides whether a
Daily Habit Execution or Next Action changes state.

Historical records must retain their execution context, including the selected
Habit level and relevant configuration snapshot. Archive rather than delete
when history needs to remain interpretable. New configuration applies forward;
corrections must be explicit.

## Persistence preparation

No database technology is selected yet (ADR-002). The application host is now
defined as web-first, but storage belongs to Phase 2. The first persistence
implementation must:

- define repository contracts at the application boundary;
- support durable, local-first operation appropriate to the chosen host;
- provide identity, timestamps, relational integrity, transactions where a
  command changes multiple records, and schema migration/versioning;
- persist Session transitions, Daily Habit Execution identity, and historical
  configuration context;
- enforce one active focused Session and idempotent Daily Habit Execution
  generation.

The storage selection ADR must be superseded only after the host, offline
requirements, deployment, and synchronization scope are known.

## Testing preparation

Run `python -m unittest discover -s tests -p "test_*.py"` and
`powershell -ExecutionPolicy Bypass -File scripts/Test-Foundation.ps1` to
verify the foundation. Start the responsive shell with `python scripts/serve.py`.
The future test runner must cover the test layout and minimum first tests in
`tests/README.md`; add tooling only when a domain or persistence unit needs it.

## Architectural issue register

The high-level `ARCHITECTURE.md` describes UI/UX as Step 5 and technical
architecture as Step 6, while the actual staged documents label system
architecture Step 5, data architecture Step 6, application logic Step 7, and
UI/UX Step 8. This is a documentation-order contradiction, not a domain or
execution-model contradiction. ADR-001 records the resolution: use the
available staged documents as the implementation reading order until the
high-level roadmap is reconciled. It does not block Phase 0.
