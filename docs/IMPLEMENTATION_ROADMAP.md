# Platform Strategy

## Current Platform

PBOS Version 1 will be implemented as a responsive Web Application.

It must support:

- Desktop browsers
- Mobile browsers

## Future Platform

After the Web version is stable, PBOS may be packaged/implemented as an Android application (APK).

## Architectural Requirement

Core domain logic, business rules, execution model, data model and persistence boundaries must not be unnecessarily coupled to the Web UI.

The Web UI is a platform-specific presentation layer.

Future Android UI should be able to reuse the appropriate platform-independent application/domain logic.

## Current Scope

The current implementation phase is Web only.

Do not implement Android-specific functionality unless explicitly requested.

# PBOS Implementation Roadmap

**Project:** Personal Business Operating System (PBOS)
**Product:** Smarter Habits
**Document Type:** Master Implementation Roadmap
**Version:** 1.0
**Status:** Ready for Implementation

---

# 0. Purpose

This document converts the PBOS architecture into an ordered implementation plan.

The architecture documents define:

- what PBOS is
- how its domain works
- how users interact with it
- how data is structured
- how the system is divided technically
- how the UI should behave

This document defines:

- what must be implemented
- in what order
- what each implementation unit is responsible for
- what must not be implemented prematurely
- when an implementation unit is considered complete

This is a **living implementation roadmap**.

The implementation agent must update the completion status of roadmap items as work is completed.

---

# 1. Source of Truth

The following architecture documents are authoritative:

- `PBOS_ARCHITECTURE.md`
- `PBOS_DOMAIN_MODEL.md`
- `PBOS_FUNCTIONAL_REQUIREMENTS.md`
- `PBOS_USER_FLOWS.md`
- `PBOS_SYSTEM_ARCHITECTURE.md`
- `PBOS_DATA_ARCHITECTURE.md`
- `PBOS_NEXT_ARCHITECTURE_STAGE.md`
- `PBOS_UI_UX_ARCHITECTURE.md`
- `PBOS_DEVELOPMENT_PROTOCOL.md`
- `PBOS_TESTING.md`
- `PBOS_DECISION_LOG.md`

This roadmap does not replace those documents.

If this roadmap conflicts with an architecture document, the architecture document takes precedence unless the architecture itself has been formally updated.

---

# 2. Implementation Rules

## 2.1 One Controlled Unit at a Time

The AI agent must implement one roadmap unit at a time.

It must not automatically continue into the next unit.

After completing the assigned unit:

1. test the implementation
2. inspect for regressions
3. update this roadmap
4. report what was done
5. stop

---

## 2.2 Inspect Existing Code Before Every Implementation Unit

Before implementing a roadmap item, the agent must inspect the current project files relevant to that item.

The agent must never assume that the repository is still in the state expected by an older roadmap item.

---

## 2.3 Architecture Before Code

Before implementing a domain or behavioral feature, the agent must read the relevant architecture sections.

The agent must implement the architecture rather than inventing a parallel architecture.

---

## 2.4 Do Not Over-Implement

An assigned roadmap item must not silently expand into unrelated features.

For example:

If asked to implement Habit scheduling, do not also build:

- analytics
- Mind Map
- AI coaching
- notifications
- unrelated Project features

unless explicitly required by the assigned task.

---

## 2.5 No Duplicate Concepts

The implementation must preserve the conceptual boundaries established by the architecture.

In particular:

```text
Habit
≠ Daily Habit Execution
≠ Session

Project
≠ Roadmap
≠ Next Action
≠ Session
```

````

A new abstraction must not be introduced merely because it sounds architecturally sophisticated.

---

# 3. Global Implementation Sequence

The project will be implemented through the following phases:

```text
Phase 0  — Foundation & Project Setup
Phase 1  — Core Domain Foundation
Phase 2  — Persistence & Data Layer
Phase 3  — Habit System
Phase 4  — Project / Roadmap / Next Action System
Phase 5  — Unified Session & Execution Engine
Phase 6  — Today Operational Interface
Phase 7  — Reflection & Recovery
Phase 8  — Goals, Life Domains & Cross-Domain Relationships
Phase 9  — Mind Map & Relationship Visualization
Phase 10 — History, Analytics & Insights
Phase 11 — Complete UI/UX Integration
Phase 12 — Testing, Edge Cases & Data Integrity
Phase 13 — Final Integration & Release Preparation
```

---

# PHASE 0 — FOUNDATION & PROJECT SETUP

**Status:** Complete (2026-08-21)

Implementation note: Added a dependency-free responsive web application shell,
native module boundaries, shared validation/error/time/identifier utilities, a
local development server, and runnable foundation checks. No PBOS business
feature or persistence implementation was added.

## Goal

Prepare a clean, runnable, testable project foundation.

No major PBOS business feature should be implemented yet.

---

## 0.1 — Project Audit and Foundation

### Implement

- inspect the project structure
- establish the required source structure
- establish configuration
- establish development conventions
- establish testing foundation
- establish error-handling foundation
- establish the application entry point
- preserve any useful existing implementation

### Must Not

- build the complete Habit system
- build the complete Project system
- build analytics
- build Mind Map
- build AI coaching

### Done When

- project runs
- development workflow works
- tests can run
- project structure supports the architecture
- no unnecessary framework/dependency has been introduced

---

## 0.2 — Shared Engineering Infrastructure

### Implement

- shared utilities required by the architecture
- common validation mechanisms
- common error handling
- time/date handling foundation
- identifiers
- environment/configuration handling where required

### Done When

Core infrastructure can be reused by later domain features without duplicating logic.

---

# PHASE 1 — CORE DOMAIN FOUNDATION

## Goal

Implement the fundamental PBOS domain concepts before building feature-specific UI.

---

## 1.1 — Core Entity Foundation

### Implement

The domain representations required for:

- Habit
- Daily Habit Execution
- Goal
- Life Domain
- Project
- Roadmap
- Next Action
- Session
- Reflection
- Recovery

Only concepts explicitly supported by the architecture should become first-class domain concepts.

### Critical Rule

Do not merge:

```text
Habit → Session
Next Action → Session
```

A Session represents actual work/execution.

---

## 1.2 — Domain Relationships

### Implement

Architecturally defined relationships including:

- Project → Goal
- Project → Roadmap
- Roadmap → executable work
- Next Action → Project
- Habit → Goal
- Habit → Life Domain
- other relationships explicitly defined in the architecture

Habit influence relationships remain soft/non-blocking.

---

## 1.3 — Domain Validation and Invariants

### Implement

Rules that protect domain integrity.

Examples:

- invalid state combinations
- invalid relationships
- invalid execution states
- invalid durations
- invalid completion transitions

### Done When

The domain layer prevents invalid states independently of the UI.

---

# PHASE 2 — PERSISTENCE & DATA LAYER

## Goal

Implement the PBOS hybrid local-first persistence architecture.

Architecture decision:

- Canonical database: Supabase/PostgreSQL
- Local operational persistence: IndexedDB
- Synchronization: explicit synchronization boundary

---

## 2.1 — Persistence Boundary

### Implement

Create the persistence boundary between application logic and concrete
storage providers.

The application layer must not directly depend on IndexedDB or Supabase.

### Done When

The application can request persistence operations through the defined
boundary without knowing the concrete storage implementation.

---

## 2.2 — IndexedDB Local Persistence

### Implement

Create the browser-local persistence required for:

- local execution
- offline operation
- active Session recovery
- pending changes
- synchronization queue

### Done When

Critical daily execution data can survive browser refresh and temporary
network unavailability.

---

## 2.3 — Supabase/PostgreSQL Adapter

### Implement

Configure the Supabase project and PostgreSQL persistence according to
DATA_ARCHITECTURE.md.

Implement the required schema and persistence adapter.

### Done When

The application can reliably persist canonical PBOS data through the
persistence boundary.

---

## 2.4 — Synchronization Foundation

### Implement

Implement the minimum synchronization mechanism required for Version 1.

Support:

- local pending changes
- synchronization when connectivity is available
- successful synchronization state
- failed synchronization state
- retry

Do not implement speculative multi-device conflict resolution.

---

## 2.5 — Migration Foundation

### Implement

Establish a migration mechanism for the PostgreSQL schema and any
required local IndexedDB schema changes.

---

## 2.6 — Persistence Tests

Test:

- create
- read
- update
- persistence after refresh
- offline execution
- reconnect
- synchronization
- failed synchronization
- retry
- historical record preservation
- active Session recovery

---

# PHASE 3 — HABIT SYSTEM

## Goal

Implement the recurring behavior system and its daily execution model.

---

## 3.1 — Habit Definition

### Implement

Habit creation and configuration according to the architecture.

Include required properties such as:

- name
- description where defined
- scheduling
- desired execution level
- applicable configuration
- relationships

Do not mix Habit definition with today's execution record.

---

## 3.2 — Habit Scheduling

### Implement

The rules that determine when a Habit is applicable.

Support the scheduling model defined in the architecture.

Handle:

- active schedules
- inactive/archive state
- applicable days
- schedule changes

Historical execution records must remain intact when future scheduling changes.

---

## 3.3 — Daily Habit Execution

### Implement

Create/manage a Daily Habit Execution for the applicable Habit/day.

This represents:

> "What happened with this Habit today?"

It is separate from the permanent Habit definition.

---

## 3.4 — Target / Reduced / Minimum Execution Levels

### Implement

The adaptive execution model:

```text
Target
Reduced
Minimum
```

The architecture defines these as different valid execution levels.

Example:

A Habit may have:

```text
Target = 40–50 minutes
```

while a difficult day may use:

```text
Reduced
```

or:

```text
Minimum
```

The implementation must not incorrectly treat the Minimum level as a failure.

The actual values must come from the architecture/product configuration rather than being invented by the agent.

---

## 3.5 — Habit Execution Through Sessions

### Implement

A Daily Habit Execution may be fulfilled through one or multiple Sessions.

Example:

```text
Daily Habit Execution
        ↓
Session 1 = 25 min
Session 2 = 20 min
        ↓
Total = 45 min
```

The system must preserve each Session independently while being able to calculate the Daily Habit Execution's resulting progress.

---

## 3.6 — Habit Completion Rules

### Implement

Determine completion/progress based on the architecture-defined execution rules.

Support:

- target completion
- reduced completion
- minimum completion
- incomplete execution
- missed execution
- partial progress

Do not invent motivational scoring rules without architectural support.

---

## 3.7 — Habit History

### Implement

Historical records for:

- applicable Habit days
- execution level
- Sessions
- duration/progress
- completion state
- reflection where applicable

Past records must not change merely because the Habit definition changes later.

---

## 3.8 — Habit Tests

Test realistic scenarios:

### Normal Day

```text
Habit
→ Target
→ Session
→ Complete
```

### Difficult Day

```text
Habit
→ Reduced
→ Session
→ Valid completion/progress
```

### Very Difficult Day

```text
Habit
→ Minimum
→ Session
→ Valid minimum execution
```

### Split Execution

```text
Habit
→ Target
→ Session 1
→ pause/stop
→ Session 2
→ combined progress
```

---

# PHASE 4 — PROJECT / ROADMAP / NEXT ACTION SYSTEM

## Goal

Implement structured project work.

---

## 4.1 — Goal and Project Foundation

Implement:

- project creation
- project state
- project metadata
- Goal association
- project lifecycle

---

## 4.2 — Roadmap Structure

Implement the project roadmap structure defined by the architecture.

A roadmap organizes project progress.

It is not itself a Session.

---

## 4.3 — Next Action

Implement executable Next Actions.

A Next Action must represent a concrete unit of work that can actually be started.

---

## 4.4 — Next Action State

Implement states defined by the architecture, such as:

- available
- active/in progress
- completed
- blocked
- archived

Use only states actually defined by the architecture.

---

## 4.5 — Next Action → Session Relationship

Implement the relationship between executable project work and Sessions.

A Next Action may require multiple Sessions.

Example:

```text
Next Action
    ↓
Session 1
    ↓
Session 2
    ↓
Session 3
    ↓
Next Action completed
```

Ending a Session does not automatically complete the Next Action.

---

## 4.6 — Project History

Preserve:

- project state changes
- Next Action completion
- work Sessions
- relevant historical information

---

# PHASE 5 — UNIFIED SESSION & EXECUTION ENGINE

## Goal

Build the central system that records actual work.

---

## 5.1 — Session Model

Implement Session according to the architecture.

A Session represents an actual period of execution/work.

A Session may originate from:

```text
Habit Daily Execution
OR
Next Action
```

---

## 5.2 — Session Lifecycle

Implement:

```text
Created
→ Started
→ Running
→ Paused
→ Resumed
→ Completed
```

Use only states defined by the architecture.

Handle interruption/cancellation according to the defined state machine.

---

## 5.3 — Timer

Implement:

- start
- pause
- resume
- elapsed time
- completion
- persistence/recovery

The timer must not depend solely on volatile UI state.

---

## 5.4 — Interrupted Session Recovery

Handle situations such as:

- browser/app refresh
- application close
- unexpected interruption
- returning to an active Session

The system must not silently lose execution history.

---

## 5.5 — Session Completion

At completion:

- persist final duration
- associate the Session with its origin
- update the relevant Daily Habit Execution or Next Action
- trigger the appropriate next state
- preserve history

---

## 5.6 — Session Reflection Integration

Connect completed Sessions to the reflection flow defined in the architecture.

---

## 5.7 — Session Tests

Test:

- start
- pause
- resume
- complete
- interruption
- recovery
- multiple Sessions
- persistence
- incorrect duplicate start attempts

---

# PHASE 6 — TODAY OPERATIONAL INTERFACE

## Goal

Build the main screen used for daily execution.

Today should answer:

> "What should I do now?"

rather than attempting to display the entire PBOS architecture.

---

## 6.1 — Today Data Composition

Today should combine relevant information from:

- today's Habits
- active Daily Habit Executions
- useful Next Actions
- active Session
- recovery state
- other architecture-defined daily information

---

## 6.2 — Today's Habit Actions

User should be able to:

- see today's Habit
- understand target
- choose/adapt execution level where appropriate
- start execution
- continue execution
- see progress

---

## 6.3 — Today's Next Actions

User should be able to:

- identify useful executable work
- start a Next Action
- continue unfinished work
- understand completion state

---

## 6.4 — Active Session

Today must clearly show an active Session and allow the user to return to it.

---

## 6.5 — Empty / Loading / Error States

Implement realistic UI states.

---

## 6.6 — Today UX Validation

Verify that a user can open the application and understand what to do without understanding PBOS's internal architecture.

---

# PHASE 7 — REFLECTION & RECOVERY

## Goal

Implement the system's reflection and recovery mechanisms without turning them into unnecessary friction.

---

## 7.1 — Post-Session Reflection

Implement the reflection flow defined by the architecture.

Reflection should be contextual and lightweight.

---

## 7.2 — Habit Reflection

Allow the appropriate Habit execution reflection.

---

## 7.3 — Project/Work Reflection

Support reflection associated with project work where defined.

---

## 7.4 — Recovery System

Implement recovery flows for:

- missed execution
- interrupted execution
- difficult days
- unfinished work

Recovery should help the user resume action rather than create guilt or excessive administrative work.

---

## 7.5 — Recovery Tests

Test realistic missed-day and interruption scenarios.

---

# PHASE 8 — GOALS, LIFE DOMAINS & CROSS-DOMAIN RELATIONSHIPS

## Goal

Implement the higher-level organization and influence system.

---

## 8.1 — Goals

Implement:

- Goal creation
- Goal state
- relevant relationships
- progress representation according to architecture

---

## 8.2 — Life Domains

Implement Life Domains.

They represent areas of life and must not become artificial project containers.

---

## 8.3 — Habit → Goal Relationships

Support many-to-many relationships.

One Habit may support multiple Goals.

One Goal may be supported by multiple Habits.

These relationships must not block execution.

---

## 8.4 — Habit → Life Domain Relationships

Support many-to-many influence/support relationships.

One Habit may influence multiple Life Domains.

---

## 8.5 — Soft Influence Model

The system must represent:

```text
Habit
  └── influences/supports
       ├── Goal A
       ├── Goal B
       └── Life Domain C
```

This is not:

```text
Habit
  └── required dependency
       └── Goal
```

The system must not falsely claim that a Habit caused a Goal outcome unless there is appropriate evidence.

---

## 8.6 — Relationship Management Tests

Test:

- adding relationships
- removing relationships
- multiple relationships
- relationship independence
- historical integrity
- analytics limitations

---

# PHASE 9 — MIND MAP & RELATIONSHIP VISUALIZATION

## Goal

Implement the visual mental model of PBOS.

---

## 9.1 — Mind Map Data

Create a visualization-ready representation of relevant PBOS entities and relationships.

---

## 9.2 — Relationship Types

Visually distinguish:

### Structural

Examples:

```text
Project → Roadmap → Next Action
```

### Influence / Support

Examples:

```text
Habit → Goal
Habit → Life Domain
```

These must not be visually represented as if they are the same relationship.

---

## 9.3 — Mind Map Interaction

Implement architecture-defined:

- zoom
- navigation
- selection
- relationship exploration
- entity details

Do not make the Mind Map the primary daily execution interface.

---

## 9.4 — Mind Map Performance

Ensure visualization remains usable as data grows.

---

# PHASE 10 — HISTORY, ANALYTICS & INSIGHTS

## Goal

Turn historical execution data into useful information without overclaiming causality.

---

## 10.1 — History

Implement historical views for relevant:

- Habit executions
- Sessions
- Next Actions
- Projects
- reflections

---

## 10.2 — Habit Analytics

Implement architecture-defined metrics such as:

- consistency
- execution frequency
- execution levels
- duration
- patterns

Avoid misleading metrics.

---

## 10.3 — Session Analytics

Support useful execution analysis.

---

## 10.4 — Project Analytics

Support project/work progress analysis according to the architecture.

---

## 10.5 — Cross-Domain Insights

Use Habit influence relationships to help organize and interpret information.

Do not claim:

```text
Habit X caused Goal Y.
```

unless supported by appropriate evidence.

Prefer careful representations of:

```text
support
association
pattern
correlation
observed relationship
```

---

## 10.6 — Analytics Tests

Verify calculations against known sample data.

---

# PHASE 11 — COMPLETE UI / UX INTEGRATION

## Goal

Complete the UI according to `PBOS_UI_UX_ARCHITECTURE.md`.

---

## 11.1 — Application Navigation

Implement the complete navigation structure.

---

## 11.2 — Core Screens

Complete all architecture-defined screens.

These may include:

- Today
- Habits
- Projects
- Goals
- Life Domains
- Sessions
- History
- Analytics
- Mind Map
- Settings/configuration where defined

---

## 11.3 — Execution UX

Ensure the path from intention to action is simple:

```text
Choose what to do
      ↓
Start
      ↓
Execute
      ↓
Complete
      ↓
Reflect
      ↓
Continue
```

---

## 11.4 — Responsive Design

Validate:

- desktop
- tablet where relevant
- mobile

---

## 11.5 — Accessibility

Implement appropriate:

- keyboard navigation
- readable text
- semantic controls
- focus states
- accessible labels
- error communication

---

## 11.6 — UI State Completeness

Every major screen should account for:

```text
Loading
Empty
Normal
Active
Completed
Error
Recovery
```

where applicable.

---

# PHASE 12 — TESTING, EDGE CASES & DATA INTEGRITY

## Goal

Validate PBOS as a real product rather than a collection of working screens.

---

## 12.1 — Full Domain Test Suite

Validate all core business rules.

---

## 12.2 — Full Persistence Test Suite

Validate:

- persistence
- restart
- historical records
- relationships
- schema evolution
- failure handling

---

## 12.3 — Full Session Test Suite

Validate:

- interruption
- recovery
- multiple Sessions
- timer accuracy
- persistence

---

## 12.4 — Full Habit Test Suite

Validate:

- target
- reduced
- minimum
- missed
- partial
- multiple Sessions
- scheduling changes
- historical preservation

---

## 12.5 — Full Project Test Suite

Validate:

- project lifecycle
- roadmap
- Next Actions
- multiple Sessions
- completion
- blocked states
- history

---

## 12.6 — Full User Flow Testing

Test complete real-world scenarios.

### Scenario A — Normal Habit Day

```text
Today
→ Habit
→ Target
→ Session
→ Complete
→ Reflection
→ History
```

### Scenario B — Difficult Habit Day

```text
Today
→ Habit
→ Reduced/Minimum
→ Session
→ Completion
→ History
```

### Scenario C — Project Work

```text
Project
→ Roadmap
→ Next Action
→ Session
→ Pause
→ Later Session
→ Complete
```

### Scenario D — Interrupted Session

```text
Session
→ Start
→ Application interrupted
→ Reopen
→ Recover
→ Continue
→ Complete
```

### Scenario E — Habit With Multiple Sessions

```text
Daily Habit Execution
→ Session 1
→ Session 2
→ combined progress
```

---

## 12.7 — Regression Testing

After major changes verify that previously working systems remain functional.

Especially:

```text
Habit
Session
Next Action
Today
Persistence
History
```

---

## 12.8 — Edge Cases

Test:

- refresh during Session
- application close during Session
- duplicate actions
- invalid data
- missing related object
- deleted/archived object
- changed Habit schedule
- stale UI
- persistence failure
- interrupted network operation if applicable
- empty database
- large history

---

## 12.9 — Data Integrity Audit

Verify:

> Historical records represent what actually happened at the time.

Future configuration changes must not rewrite past execution history.

---

# PHASE 13 — FINAL INTEGRATION & RELEASE PREPARATION

## Goal

Transform the completed implementation into a coherent release-ready PBOS version.

---

## 13.1 — Architecture Compliance Review

Compare the actual implementation against:

- Domain Model
- Functional Requirements
- User Flows
- State Machines
- System Architecture
- Data Architecture
- UI/UX Architecture

Identify any deviations.

---

## 13.2 — Remove Accidental Complexity

Inspect for:

- duplicate concepts
- unused abstractions
- dead code
- unnecessary dependencies
- duplicated business rules
- business logic inside UI
- persistence logic inside UI
- contradictory state management

Simplify where safe.

---

## 13.3 — Performance Review

Check:

- initial loading
- Today performance
- database queries
- history performance
- Mind Map performance
- large datasets
- unnecessary rendering/work

Optimize only where justified.

---

## 13.4 — Security / Reliability Review

Check appropriate:

- input validation
- error handling
- data corruption risks
- unsafe persistence operations
- sensitive configuration
- production configuration

---

## 13.5 — Final UX Review

Use the application as a real user.

Ask:

- Can I understand what to do today?
- Can I start a Habit quickly?
- Can I work on a Next Action quickly?
- Can I pause and resume work?
- Can I recover after a bad day?
- Can I understand my history?
- Can I understand relationships without being overwhelmed?
- Does the application help action rather than create administrative work?

---

## 13.6 — Release Build

Prepare the application for its intended deployment environment.

Verify:

- production build
- startup
- persistence
- critical flows
- error handling
- responsive behavior

---

# 4. FINAL DEFINITION OF PBOS VERSION 1

PBOS Version 1 is considered implementation-complete when all of the following are true:

## Domain

- [ ] Core domain concepts implemented
- [ ] Domain relationships implemented
- [ ] Domain invariants enforced

## Habits

- [ ] Habit definition
- [ ] Scheduling
- [ ] Daily Habit Execution
- [ ] Target
- [ ] Reduced
- [ ] Minimum
- [ ] Multiple Sessions
- [ ] History
- [ ] Recovery

## Projects

- [ ] Goals
- [ ] Projects
- [ ] Roadmaps
- [ ] Next Actions
- [ ] Project Sessions
- [ ] Project history

## Sessions

- [ ] Session creation
- [ ] Start
- [ ] Pause
- [ ] Resume
- [ ] Completion
- [ ] Interruption recovery
- [ ] Persistence
- [ ] Reflection

## Daily Operation

- [ ] Today screen
- [ ] Today's Habits
- [ ] Today's Next Actions
- [ ] Active Session
- [ ] Recovery
- [ ] Daily execution flow

## Relationships

- [ ] Goals
- [ ] Life Domains
- [ ] Habit → Goal relationships
- [ ] Habit → Life Domain relationships
- [ ] Soft influence model

## Visualization

- [ ] Mind Map
- [ ] Structural relationships
- [ ] Influence relationships
- [ ] Interaction

## Reflection & Insights

- [ ] Reflection
- [ ] Recovery
- [ ] History
- [ ] Habit analytics
- [ ] Session analytics
- [ ] Project analytics
- [ ] Cross-domain insights

## UI/UX

- [ ] Navigation
- [ ] Core screens
- [ ] Responsive design
- [ ] Accessibility
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Recovery states

## Reliability

- [ ] Domain tests
- [ ] Persistence tests
- [ ] Session tests
- [ ] Habit tests
- [ ] Project tests
- [ ] User-flow tests
- [ ] Regression tests
- [ ] Edge-case tests
- [ ] Data-integrity validation

## Release

- [ ] Architecture compliance review
- [ ] Complexity review
- [ ] Performance review
- [ ] Reliability review
- [ ] Production build
- [ ] Final end-to-end validation

---

# 5. ROADMAP UPDATE RULES FOR THE AI AGENT

When an assigned roadmap item is genuinely complete:

Change:

```text
- [ ]
```

to:

```text
- [x]
```

The agent may add a short implementation note below the item when useful.

Example:

```md
- [x] 3.3 — Daily Habit Execution

Implementation note:
Implemented Daily Habit Execution as a separate historical record linked to Habit.
```

The agent must NOT mark an item complete merely because code was written.

The item must satisfy its implementation requirements and tests.

---

# 6. BLOCKED ITEM RULE

If an implementation item cannot safely be completed because of:

- architecture contradiction
- missing requirement
- unresolved data-model problem
- technical limitation
- dependency problem
- serious existing-code conflict

the agent must:

1. stop the affected implementation
2. leave the item unchecked
3. document the blocker briefly
4. report it

The agent must not silently invent a new architecture to bypass the blocker.

---

# 7. ROADMAP CHANGE RULE

The roadmap may evolve during implementation.

However, major changes must not be made silently.

If a new requirement or architectural discovery changes the implementation sequence:

1. explain why
2. update the roadmap
3. update the relevant architecture document if necessary
4. record the architectural decision in `PBOS_DECISION_LOG.md`
5. continue implementation only after the change is coherent

---

# 8. FUTURE FEATURES

The following are not required for PBOS Version 1 unless explicitly added to the architecture:

- advanced AI coaching
- external calendar integrations
- wearable integrations
- cloud synchronization
- multi-device synchronization
- advanced notification systems
- social features
- team collaboration
- monetization
- marketplace
- advanced machine-learning prediction

These must not be implemented simply because they may be useful in the future.

---

# 9. FINAL IMPLEMENTATION PRINCIPLE

PBOS should be built as a coherent system, not as a collection of independent screens.

The central execution model must remain:

```text
Habit
  ↓
Daily Habit Execution
  ↓
One or more Sessions
  ↓
Reflection / History


Project
  ↓
Roadmap
  ↓
Next Action
  ↓
One or more Sessions
  ↓
Completion / Reflection / History
```

Higher-level organization:

```text
Goals
   ↑
   │ supports/influences
   │
Habits ─────→ Life Domains


Goals
  ↓
Projects
  ↓
Roadmaps
  ↓
Next Actions
  ↓
Sessions
```

The system must remain focused on helping the user:

```text
Understand
   ↓
Choose
   ↓
Start
   ↓
Execute
   ↓
Reflect
   ↓
Recover
   ↓
Continue
```

Architecture exists to support this experience.

The implementation must never become more complicated than necessary merely to make the internal architecture look sophisticated.

---

# 10. ROADMAP COMPLETION

When every required Version 1 item is complete and Phase 13 passes final validation:

```text
PBOS VERSION 1
IMPLEMENTATION COMPLETE
```

At that point the current architecture has been converted into a working software system.

Any subsequent work should be treated as:

```text
Bug Fix
Optimization
UX Improvement
Architecture Revision
OR
Version 2 Feature
```

rather than unfinished Version 1 implementation.

```

### একটি জিনিস আমি ইচ্ছাকৃতভাবে করেছি

আমি roadmap-টাকে **শুধু feature checklist বানাইনি**। কারণ সেটা করলে AI বলতে পারত:

> "Habit implemented ✅"

কিন্তু আসলে Habit-এর **Daily Execution → Multiple Sessions → Target/Reduced/Minimum → History → Persistence** অসম্পূর্ণ থাকতে পারত।

তাই প্রতিটি বড় অংশকে এমনভাবে ভেঙেছি যাতে শেষ পর্যন্ত architecture-এর **behavior**, শুধু UI বা database table নয়, software-এ চলে আসে।

আর তোমার পরবর্তী workflow হবে খুব সহজ:

> **Antigravity/Codex: `Implement Phase 0.1 from PBOS_IMPLEMENTATION_ROADMAP.md. Do not proceed beyond this item.`**

কাজ শেষ → roadmap `[x]` → Git commit → পরবর্তী item।

এই roadmap-এর **শেষ Phase 13 সত্যিই শেষ হলে**, বর্তমান architecture-এর scope অনুযায়ী PBOS Version 1 একটি পূর্ণাঙ্গ working product হওয়ার কথা।
```
````
