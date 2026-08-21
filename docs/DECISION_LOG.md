# `PBOS_DECISION_LOG.md`

# Step 11 — Architecture Decision Log & Future Expansion

**Version:** 1.0  
**Status:** Initial Specification

---

# 1. Purpose

This document records important architectural decisions.

It prevents future development from repeatedly asking:

> "Why was it designed this way?"

---

# 2. What Requires a Decision Record?

Record decisions that affect:

- domain structure
- execution model
- persistence model
- major UI architecture
- state management
- data integrity
- external integrations
- major technology choices
- significant UX behavior

Do not record trivial implementation details.

---

# 3. Decision Format

Each decision should use:

```text
## ADR-XXX — Title

Date:
Status: Accepted / Superseded / Rejected

Context:
What problem existed?

Decision:
What was decided?

Reason:
Why?

Alternatives:
What else was considered?

Consequences:
What does this decision make easier or harder?

Related Architecture:
Which document/section is affected?
```

---

# 4. Example

```text
## ADR-001 — Habit Execution Is Separate From Habit Definition

Status: Accepted

Context:
A Habit is recurring, while each day's execution must be historically preserved.

Decision:
Habit definition and daily Habit Execution are separate concepts.

Reason:
Changing a Habit in the future must not rewrite previous execution history.

Consequences:
The system requires an execution record for each applicable day.
```

---

# 5. Architecture Change Rule

When a future change contradicts an existing decision:

```text
Identify old decision
        ↓
Explain why it no longer works
        ↓
Create new ADR
        ↓
Update affected architecture document
        ↓
Update implementation
        ↓
Update tests
```

Never silently change a core architectural rule.

---

# 6. Superseding Decisions

If a decision changes:

```text
ADR-004
Status: Superseded by ADR-017
```

The old decision should remain in the log.

This preserves architectural history.

---

# 7. Future Expansion Rule

Future features should first be evaluated against:

```text
Domain Model
Execution Model
Data Architecture
UX Architecture
```

A feature should not be added merely because it sounds useful.

Ask:

1. Does it solve a real problem?
2. Does it fit the existing model?
3. Does it create a new dependency?
4. Does it increase daily cognitive load?
5. Does it threaten historical integrity?
6. Does it duplicate an existing concept?

---

# 8. Expansion Principle

Prefer:

```text
Extend existing concept
```

over:

```text
Create another similar concept
```

For example, before creating a new "Work Item" abstraction, determine whether the existing:

```text
Next Action
```

already solves the problem.

---

# 9. Avoid Abstraction Explosion

PBOS should not accumulate concepts simply to make the architecture sound sophisticated.

Every new abstraction must have a clear reason.

The system should prefer:

```text
Few strong concepts
```

over:

```text
Many overlapping concepts
```

---

# 10. Future Feature Evaluation

Before adding a major feature:

```text
Problem
 ↓
User value
 ↓
Domain impact
 ↓
Execution impact
 ↓
Data impact
 ↓
UX impact
 ↓
Testing impact
 ↓
Architecture decision
```

Only then should implementation begin.

---

# 11. Possible Future Expansion Areas

Potential future areas may include:

```text
Advanced analytics
AI coaching
Calendar integration
Notifications
Wearable/device integration
Cloud synchronization
Multi-device support
Mobile application
Advanced visualization
Personalized recommendations
```

These are **future possibilities**, not current requirements.

They must not influence the current architecture unless a real dependency exists.

---

# 12. AI Features

If AI is introduced later, AI must remain a supporting layer.

AI should not silently become the source of truth for:

```text
Habit completion
Session duration
Historical records
Goal progress
```

AI may:

```text
Analyze
Suggest
Summarize
Recommend
Coach
```

but core system facts must come from deterministic application data.

---

# 13. Analytics Expansion

Future analytics may identify patterns.

However:

```text
Pattern ≠ Causation
```

Analytics should continue using careful language unless causal evidence exists.

---

# 14. Synchronization Expansion

If cloud synchronization is added later, the architecture must preserve:

```text
Historical integrity
Conflict handling
Offline behavior
Unique identity
Timestamp consistency
```

Synchronization must not be added as a simple "upload database" feature.

---

# 15. Multi-Device Expansion

If PBOS eventually supports multiple devices:

```text
Local execution
      ↓
Sync
      ↓
Conflict resolution
      ↓
Consistent history
```

must be designed explicitly.

The current architecture should avoid unnecessary assumptions that make this impossible later.

---

# 16. Architecture Health Rule

Periodically ask:

> **"Is the architecture still helping the user, or are we now serving the architecture?"**

If internal complexity grows without improving:

```text
execution
clarity
reliability
reflection
```

the architecture should be simplified.

---

# 17. Final Architecture Principle

PBOS should evolve according to:

```text
Real User Problem
       ↓
Simple Domain Model
       ↓
Clear Execution Model
       ↓
Reliable Data
       ↓
Simple UX
       ↓
Measured Feedback
       ↓
Careful Expansion
```

Not:

```text
New Technology
       ↓
New Abstraction
       ↓
New Feature
       ↓
More Complexity
```

---

# 18. Final Rule for AI Agents

Before making a significant architectural change, the AI agent must ask:

> **Does this change preserve the existing domain model, execution model, data integrity, and daily UX?**

If **yes**, proceed.

If **no**, stop and document the architectural decision before implementation.

---

## ADR-001 — Resolve architecture document names and stage ordering

Date: 2026-08-21
Status: Accepted

Context:
The documents refer to `PBOS_*` filenames, but this repository stores the
same documents without that prefix. `ARCHITECTURE.md` also describes UI/UX as
Step 5 and technical architecture as Step 6, while the available staged
documents label System Architecture Step 5, Data Architecture Step 6,
Application Logic Step 7, and UI/UX Step 8.

Decision:
Treat the existing unprefixed files as the referenced architecture documents.
For implementation reading order, use the available staged documents in their
own declared sequence: domain and flows, system, data, application logic,
UI/UX, development protocol, testing, and decision log.

Reason:
This preserves the detailed documents and does not change the execution model.
The inconsistency is document ordering/naming only and does not block the
foundation.

Alternatives:
Rename all documents or rewrite the high-level roadmap now.

Consequences:
Future work has one explicit reading order. The high-level roadmap should be
reconciled in a documentation-focused task; no product behavior changes here.

Related Architecture:
`ARCHITECTURE.md`, `SYSTEM_ARCHITECTURE.md`, `DATA_ARCHITECTURE.md`,
`APPLICATION_LOGIC.md`, and `UI_UX_ARCHITECTURE.md`.

## ADR-002 — Defer storage technology until the application host is known

Date: 2026-08-21
Status: Accepted

Context:
PBOS requires durable, historical, relational, local-first-capable persistence,
but the repository contains no application host, runtime, packaging, or
deployment constraint. The data architecture explicitly leaves database
technology open.

Decision:
Do not select or install a database technology during Phase 0. Establish the
repository boundary and required persistence capabilities now; select a storage
adapter when the first approved implementation unit defines the application
host and validates offline, migration, and transaction needs.

Reason:
Selecting a browser-only, desktop-only, or remote database without a host
would be technology-led architecture and could force an unnecessary redesign.

Alternatives:
Adopt SQLite, IndexedDB, or a managed remote database immediately.

Consequences:
No persistence implementation or dependency exists yet. The first persistence
unit must record the concrete adapter decision and prove repository behavior,
historical preservation, active-session integrity, and migration strategy.

Related Architecture:
`SYSTEM_ARCHITECTURE.md` §§16–20, 53–57 and `DATA_ARCHITECTURE.md` §72.

## ADR-003 — Use native browser modules for the web-first Phase 0 shell

Date: 2026-08-21
Status: Accepted

Context:
PBOS is now explicitly web-first for desktop and mobile browsers. The
repository has no existing runtime or package manager, and the local
development environment does not provide Node.js. Phase 0 requires a runnable
and testable web shell, not product features.

Decision:
Use standards-based HTML, CSS, and native browser ES modules for the Phase 0
application shell. Use the Python standard library only to provide a local
static development server and foundation checks. Keep shared utilities free of
DOM and storage dependencies.

Reason:
This provides a responsive browser application with no dependency installation,
build system, or framework coupling. It meets the immediate web requirement
while preserving the domain/application boundary required for a future Android
presentation layer.

Alternatives:
Adopt a JavaScript framework and build tool immediately, or wait for a Node.js
runtime before creating a runnable shell.

Consequences:
The first domain/persistence unit can add only the tooling it demonstrably
needs. Database selection remains a Phase 2 decision, now evaluated against
the confirmed web host and local-first requirements.

Related Architecture:
`SYSTEM_ARCHITECTURE.md` §§37–40, 53–57; `UI_UX_ARCHITECTURE.md` §§60–63;
and `IMPLEMENTATION_ROADMAP.md` Phase 0.

## ADR-004 — Use Supabase/PostgreSQL as the Canonical Database with IndexedDB Local Persistence

Date: 2026-08-22

Status: Accepted

Context:

PBOS is a web-first application that must support reliable daily execution,
historical records, relational domain data, future Android support, and
local-first operation.

The system contains execution-critical data such as:

- Daily Habit Executions
- Sessions
- Next Actions
- Reflections
- historical records
- Goals
- Projects
- relationships between domain entities

A purely remote database would make core daily execution unnecessarily
dependent on network availability.

A purely browser-local database would make future cloud backup,
multi-device usage, and Android synchronization significantly harder.

SQLite was also considered, but the current Phase 0 host is a browser-based
web application and introducing a browser-native SQLite architecture would
add unnecessary hosting/runtime complexity at this stage.

Decision:

PBOS Version 1 will use a hybrid local-first persistence architecture.

1. Supabase/PostgreSQL will be the canonical long-term persistent database.

2. IndexedDB will provide browser-local persistence for operational data,
   offline execution, active-session protection, local changes and sync
   queueing.

3. A dedicated synchronization boundary will synchronize local changes
   with the canonical Supabase/PostgreSQL database.

4. Core domain and application logic must not depend directly on either
   IndexedDB or Supabase.

5. Persistence adapters must remain behind the persistence boundary.

6. The Web UI must not directly manipulate the database.

7. Historical execution records must be preserved during synchronization
   and must not be silently overwritten by configuration changes.

8. Active Session integrity has priority over immediate cloud synchronization.
   A temporary network failure must not cause an active Session or completed
   execution to disappear.

9. Conflict handling must be explicitly defined before multi-device
   synchronization is enabled.

Reason:

This architecture satisfies PBOS's web-first requirement while preserving
offline-capable daily execution and a future path toward Android and
multi-device support.

It also keeps the domain/application layers independent from the concrete
storage technology.

Alternatives considered:

1. IndexedDB only:
   Excellent browser-local operation, but weak for cloud backup,
   multi-device support and future Android synchronization.

2. SQLite only:
   Strong relational storage, but introduces unnecessary runtime/hosting
   complexity for the current browser-first Phase 0 environment.

3. Supabase/PostgreSQL only:
   Strong relational and cloud capabilities, but core daily execution
   would become unnecessarily dependent on network availability.

4. Supabase/PostgreSQL + IndexedDB:
   Selected because it combines canonical cloud persistence with
   local-first browser operation.

Consequences:

Positive:

- Reliable offline-capable daily execution
- Durable cloud persistence
- Strong relational database
- Future Android integration remains possible
- Future multi-device support remains possible
- Domain/application logic remains storage-independent

Negative:

- More complex than using a single database
- A synchronization layer is required
- Conflict handling must eventually be designed
- Data consistency between local and remote storage must be tested carefully

Implementation constraints:

- Do not implement synchronization before the persistence model is defined.
- Do not introduce multi-device conflict resolution in Version 1 unless required.
- Do not allow UI components to directly access IndexedDB or Supabase.
- The persistence layer must expose application-level operations rather
  than storage-specific operations.

Related Architecture:

SYSTEM_ARCHITECTURE.md
DATA_ARCHITECTURE.md
APPLICATION_LOGIC.md
UI_UX_ARCHITECTURE.md
IMPLEMENTATION_ROADMAP.md
