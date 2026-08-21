# `PBOS_DEVELOPMENT_PROTOCOL.md`

# Step 9 — Development Phases & AI-Agent Protocol

**Version:** 1.0  
**Status:** Initial Specification

---

## 1. Purpose

This document defines how PBOS will be developed incrementally using an AI coding agent such as Antigravity.

The agent must **not attempt to build the entire system at once**.

Each phase must:

1. Read the existing architecture.
2. Understand the current implementation.
3. Implement only the assigned scope.
4. Test its work.
5. Check for regressions.
6. Update documentation when necessary.
7. Stop when the phase is complete.

---

## 2. Mandatory Architecture Files

Before implementing any feature, the AI agent must read:

```text
PBOS_ARCHITECTURE.md
PBOS_DOMAIN_MODEL.md
PBOS_FUNCTIONAL_REQUIREMENTS.md
PBOS_USER_FLOWS.md
PBOS_SYSTEM_ARCHITECTURE.md
PBOS_DATA_ARCHITECTURE.md
PBOS_NEXT_ARCHITECTURE_STAGE.md
PBOS_UI_UX_ARCHITECTURE.md
PBOS_DEVELOPMENT_PROTOCOL.md
PBOS_TESTING.md
PBOS_DECISION_LOG.md
```

If some files do not yet exist, the agent must use the available architecture documents and must **not invent conflicting architecture**.

---

# 3. Development Principle

Development follows:

```text
Architecture
    ↓
Foundation
    ↓
Core Domain
    ↓
Persistence
    ↓
Execution
    ↓
UI
    ↓
Integration
    ↓
Validation
    ↓
Polish
```

Never reverse this by building UI features first and inventing the underlying architecture afterward.

---

# 4. Development Phases

## Phase 0 — Project Foundation

Build:

- project structure
- development environment
- basic application shell
- configuration
- core conventions
- error-handling foundation
- testing foundation

No major business feature should be implemented here.

---

## Phase 1 — Domain Foundation

Implement the core domain concepts defined by the architecture.

Examples:

- Habit
- Goal
- Life Domain
- Project
- Next Action
- Session
- Reflection
- Recovery

The implementation must follow the domain model rather than creating ad-hoc objects for individual screens.

---

## Phase 2 — Persistence

Implement:

- database/storage layer
- repositories/data access
- persistence rules
- migrations/versioning if required
- historical data integrity

The UI must not directly manipulate raw persistence structures.

---

## Phase 3 — Habit System

Implement:

- Habit creation
- scheduling
- daily Habit Execution
- Target / Reduced / Minimum
- daily progress
- multiple Sessions for one Habit execution
- completion
- missed execution
- recovery-related behavior
- history

---

## Phase 4 — Project & Next Action System

Implement:

- Projects
- project structure
- Next Actions
- action states
- starting work
- completing actions
- continuing unfinished work

Next Actions must remain executable units, not generic categories.

---

## Phase 5 — Session Execution System

Implement the unified execution system.

It must support Sessions originating from:

```text
Habit
Next Action
```

The execution experience must remain consistent regardless of origin.

Implement:

- Session creation
- start
- pause
- resume
- interruption recovery
- timer
- completion
- Session history
- reflection

---

## Phase 6 — Today

Build the operational home screen.

It should combine:

```text
Active Session
Today's Habits
Useful Next Actions
Recovery
```

Today must prioritize action rather than displaying every piece of information.

---

## Phase 7 — Goals, Life Domains & Relationships

Implement:

- Goals
- Life Domains
- Habit → Goal relationships
- Habit → Life Domain relationships
- Project → Goal relationships
- other defined relationships

Cross-domain Habit influence must remain **non-blocking and soft**.

---

## Phase 8 — Mind Map

Implement the visual relationship system.

It must distinguish:

```text
Structural relationship
```

from:

```text
Influence/support relationship
```

The Mind Map must not become the primary execution interface.

---

## Phase 9 — Reflection, Recovery & Insights

Implement:

- contextual reflection
- recovery flows
- execution patterns
- habit patterns
- project patterns
- useful analytics

The system must avoid unsupported causal claims.

---

## Phase 10 — UI / UX Completion

Implement the complete UI architecture defined in Step 8.

Validate:

- navigation
- responsive layout
- accessibility
- empty states
- loading states
- error states
- confirmations
- mobile experience
- desktop experience

---

## Phase 11 — Integration & Final Validation

Verify the complete system as one product.

Focus on:

```text
Habit
   ↓
Daily Execution
   ↓
Session
   ↓
Reflection
   ↓
History

Project
   ↓
Next Action
   ↓
Session
   ↓
Completion
   ↓
History
```

All major flows must work together without contradictory behavior.

---

# 5. AI-Agent Execution Protocol

For every phase the agent must follow:

```text
READ
 ↓
UNDERSTAND
 ↓
INSPECT CURRENT CODE
 ↓
PLAN
 ↓
IMPLEMENT
 ↓
TEST
 ↓
CHECK REGRESSION
 ↓
DOCUMENT
 ↓
REPORT
```

---

# 6. Agent Must Inspect Before Editing

Before changing code, the agent must inspect:

- existing files
- existing architecture
- existing data structures
- related features
- tests
- dependencies
- current implementation state

The agent must not overwrite existing functionality merely because a new implementation appears simpler.

---

# 7. Scope Control

The agent must only implement the assigned phase.

It must not:

- redesign unrelated features
- introduce unnecessary frameworks
- refactor the entire project without reason
- change established behavior unnecessarily
- add speculative features

If an architectural problem blocks implementation, the agent must identify it before making a major architectural change.

---

# 8. Contradiction Detection

Before implementation, the agent must check:

```text
Domain contradiction
State contradiction
Data contradiction
UX contradiction
Execution contradiction
Historical-data contradiction
```

If a contradiction is found, resolve it according to the architecture rather than silently creating a second rule.

---

# 9. AI Must Not Invent Business Rules

The agent may make normal engineering decisions.

However, it must not silently invent important product behavior.

Examples requiring architectural consideration:

- changing Habit semantics
- changing Session semantics
- changing Target / Reduced / Minimum meaning
- changing historical behavior
- changing relationships
- changing completion rules

Such changes must be documented.

---

# 10. Phase Completion Report

At the end of every phase the agent must report:

```text
Implemented
Changed
Tests
Known limitations
Architecture decisions
Files created/modified
```

It must not claim completion if tests or validation are incomplete.

---

# 11. Small Increment Rule

Each implementation task should be small enough that the agent can:

```text
implement → test → verify
```

within one controlled iteration.

---

# 12. Git Rule

Each meaningful completed phase should produce a clean Git commit.

Recommended:

```text
feat: implement habit execution system
feat: implement session engine
feat: implement today screen
test: add session execution tests
```

Avoid giant commits containing unrelated work.

---

# 13. AI-Agent Golden Rule

> **Never optimize for how much code can be generated in one request. Optimize for how safely the system can evolve without breaking its architecture.**

---
