# PBOS — Data Architecture & Persistence Model

**Document:** `PBOS_DATA_ARCHITECTURE.md`  
**Architecture Version:** 1.0  
**Current Phase:** Step 6 — Data Architecture & Persistence Model  
**Status:** Initial Data Specification

---

# 1. Purpose

This document defines how PBOS information is represented, stored, related, updated, and preserved over time.

It translates the domain and execution architecture into a logical persistence model.

This document defines:

- persistent entities
- relationships
- identifiers
- timestamps
- current state
- historical state
- execution records
- derived data
- deletion and archival rules
- relationship storage
- data integrity rules
- persistence boundaries

This document does **not** select a specific database technology.

---

# 2. Core Data Principle

PBOS must distinguish between:

```text
Definition
   ↓
Occurrence
   ↓
Execution
   ↓
History
```

For example:

```text
Habit
   ↓
Daily Habit Execution
   ↓
Session
   ↓
Historical Record
```

This distinction is fundamental.

A Habit is not today's Habit completion.

A Session is not the Habit itself.

---

# 3. Persistent Data Categories

PBOS data is divided into five categories.

## 3.1 Definitions

Long-lived objects describing what something is.

Examples:

```text
Habit
Project
Goal
Next Action
```

---

## 3.2 Structures

Objects that describe relationships or organization.

Examples:

```text
Roadmap
Node
Mind Map relationships
Habit ↔ Goal relationships
Habit ↔ Life Domain relationships
```

---

## 3.3 Occurrences

Objects representing something happening at a particular time.

Examples:

```text
Daily Habit Execution
Session
Reflection
Recovery Event
```

---

## 3.4 History

Historical records describing what actually happened.

Examples:

```text
Session duration
Habit execution result
Completion state
Interruption
Reflection
```

---

## 3.5 Derived Data

Information that can be calculated from other persisted data.

Examples:

```text
Current streak
Habit completion percentage
Weekly consistency
Today view
Project progress
Analytics
```

Derived data should not become the primary source of truth unless performance requirements later justify caching it.

---

# 4. Entity Identification Rule

A concept should receive its own persistent identity when at least one of the following is true:

- it exists independently over time
- it has its own lifecycle
- other objects need to reference it
- it has historical significance
- it can be edited independently
- it participates in important relationships

A concept should **not** become an independent persistent entity merely because it has a name in the product specification.

---

# 5. Core Persistent Entities

The initial data model contains these primary entities:

```text
User
Goal
Life Domain

Project
Roadmap
Node
Next Action

Habit
Habit Execution

Session
Reflection
Recovery Record
```

Additional relationship/association records may exist where necessary.

---

# 6. User

PBOS is designed as a personal system.

The data model should therefore have a clear owner for all personal data.

Conceptually:

```text
User
├── Goals
├── Life Domains
├── Projects
├── Habits
├── Next Actions
├── Habit Executions
├── Sessions
├── Reflections
└── Recovery Records
```

Even if the first version is single-user, the data model should not scatter ownership assumptions throughout individual modules.

---

# 7. Entity IDs

Every persistent entity should have a stable unique identifier.

Examples:

```text
userId
goalId
domainId
projectId
roadmapId
nodeId
nextActionId
habitId
habitExecutionId
sessionId
reflectionId
recoveryId
```

IDs must remain stable throughout the entity's lifetime.

Changing a display name must never change its ID.

---

# 8. Timestamps

Persistent entities should use timestamps where meaningful.

Common timestamps include:

```text
createdAt
updatedAt
```

Historical/occurrence records may additionally use:

```text
startedAt
completedAt
scheduledAt
occurredAt
```

The system must distinguish:

```text
When the record was created
```

from:

```text
When the real-world event happened
```

---

# 9. Time Representation

Time data must use a consistent internal representation.

The system should store enough information to reconstruct:

- when something started
- when it ended
- pauses
- interruptions
- actual active duration

Display formatting such as:

```text
Today
Yesterday
8:30 PM
```

belongs to the presentation layer.

---

# 10. Goal

A Goal represents a desired meaningful outcome.

Conceptually:

```text
Goal
├── id
├── title
├── description
├── status
├── createdAt
├── updatedAt
└── lifecycle information
```

A Goal should not directly contain all the work required to achieve it.

Projects, Habits, and other entities may support a Goal.

---

# 11. Life Domain

A Life Domain represents an area of life.

Examples may include:

```text
Health
Career
Relationships
Learning
Personal Development
```

The exact list must remain configurable rather than permanently hard-coded.

Conceptually:

```text
LifeDomain
├── id
├── name
├── description
├── status
├── createdAt
└── updatedAt
```

---

# 12. Goal ↔ Life Domain

A Goal may belong to or be relevant to one or more Life Domains if the product rules allow this.

The relationship should not be assumed to be one-to-one.

If multiple relationships are required, use an explicit association:

```text
GoalLifeDomain
├── goalId
└── domainId
```

This prevents the Goal entity from containing a rigid single-domain assumption.

---

# 13. Project

A Project represents a meaningful body of planned work.

Conceptually:

```text
Project
├── id
├── title
├── description
├── status
├── createdAt
├── updatedAt
└── lifecycle information
```

A Project may support one or more Goals depending on the final relationship model.

---

# 14. Project ↔ Goal

Projects may contribute to Goals.

This relationship must not be encoded as:

```text
Goal.projectId
```

if a Project can support multiple Goals.

Instead, where many-to-many relationships are required:

```text
ProjectGoal
├── projectId
└── goalId
```

The same principle applies throughout the PBOS data model.

---

# 15. Roadmap

A Roadmap represents the organizational structure of a Project.

A Roadmap should not duplicate the Project's fundamental identity.

Conceptually:

```text
Project
   ↓
Roadmap
```

If a Project only requires one roadmap in the first version, that relationship may be one-to-one.

The architecture should still keep the Roadmap concept separate because its responsibility is structural organization.

---

# 16. Node

A Node represents a meaningful point in the Project's roadmap.

Conceptually:

```text
Node
├── id
├── projectId / roadmapId
├── title
├── description
├── status
├── parent relationship where applicable
├── position/order
├── createdAt
└── updatedAt
```

---

# 17. Mind Map Relationships

The user's requested mind-map-style structure must be supported without forcing the UI representation into the database model.

A visual relationship may be represented logically as:

```text
NodeRelationship
├── id
├── sourceNodeId
├── targetNodeId
├── relationshipType
└── metadata
```

This allows the UI to render:

```text
        Node A
       /      \
   Node B    Node C
      \        /
       Node D
```

without requiring the database to literally store a visual diagram.

---

# 18. Node Hierarchy vs Node Relationship

These are not automatically the same thing.

### Hierarchy

```text
Parent
   ↓
Child
```

represents structural containment.

### Relationship

```text
Node A ── influences ──→ Node B
```

represents a connection.

The data model must not assume every visual connection is a parent-child relationship.

---

# 19. Next Action

A Next Action represents an executable piece of Project work.

Conceptually:

```text
NextAction
├── id
├── projectId
├── nodeId (optional where appropriate)
├── title
├── description
├── status
├── createdAt
├── updatedAt
└── lifecycle timestamps
```

A Next Action is not a Session.

---

# 20. Next Action Historical State

The current Next Action state may change:

```text
Available
Active
Blocked
Deferred
Completed
Cancelled
```

The system must preserve enough historical information to understand important transitions.

It should not rely solely on:

```text
status = "completed"
```

if future analytics or auditing require transition history.

---

# 21. Habit

A Habit represents a recurring behavior definition.

Conceptually:

```text
Habit
├── id
├── title
├── description
├── status
├── schedule
├── target configuration
├── reduced configuration
├── minimum configuration
├── createdAt
└── updatedAt
```

A Habit is a long-lived definition.

It does not represent a single day's execution.

---

# 22. Habit Execution Configuration

The Habit must define its normal and adaptive execution levels.

Example:

```text
Exercise

Target   = 45 minutes
Reduced  = 20 minutes
Minimum  = 5 minutes
```

These values belong to the Habit configuration.

They must not be treated as three separate Habits.

---

# 23. Habit Configuration History

When a Habit configuration changes, historical executions must not accidentally inherit the new configuration.

Example:

```text
August 20
Target = 45 min

August 21
Target changed to 30 min
```

The August 20 execution must remain interpretable according to the configuration that applied to it.

Therefore the system needs a strategy for preserving historical configuration.

Possible approaches include:

```text
Configuration Snapshot
```

or:

```text
Versioned Habit Configuration
```

The exact implementation can be selected later.

The invariant is:

> Historical execution must remain historically accurate.

---

# 24. Daily Habit Execution

A Daily Habit Execution represents one occurrence of a Habit on a particular date/time period.

Conceptually:

```text
HabitExecution
├── id
├── habitId
├── date
├── status
├── selectedLevel
├── targetAtExecution
├── actualResult
├── createdAt
└── completedAt
```

The exact field names are implementation details.

---

# 25. Why Habit Execution Must Be Separate

Without a Daily Habit Execution entity, the system would have difficulty representing:

```text
Monday → completed
Tuesday → missed
Wednesday → minimum
Thursday → target
```

while keeping the underlying Habit unchanged.

Therefore:

```text
Habit
```

and:

```text
HabitExecution
```

must remain separate.

---

# 26. Habit Execution Level

Each Daily Habit Execution may record the selected level:

```text
Target
Reduced
Minimum
```

The system should also preserve actual performance.

Example:

```text
Selected Level = Reduced
Target = 45 min
Reduced = 20 min
Actual = 23 min
```

This is more informative than simply storing:

```text
completed = true
```

---

# 27. Actual vs Intended Data

PBOS must distinguish:

```text
Intended
```

from:

```text
Actual
```

For example:

```text
Target = 45 min
Actual = 28 min
```

must remain possible.

The system should never overwrite:

```text
Target = 45
```

with:

```text
Target = 28
```

just because the user performed 28 minutes.

---

# 28. Session

A Session is the persistent record of an actual execution period.

Conceptually:

```text
Session
├── id
├── sourceType
├── sourceId
├── status
├── startedAt
├── endedAt
├── activeDuration
├── interruption information
├── outcome
├── createdAt
└── updatedAt
```

---

# 29. Session Source

A Session needs to identify what it was executing.

Possible sources include:

```text
NextAction
HabitExecution
```

The architecture should avoid separate Session entities for each source.

Instead:

```text
Session
   ↓
sourceType + sourceId
```

or an equivalent strongly typed relationship mechanism.

---

# 30. Session Source Integrity

A Session must never point to an invalid source.

Examples:

```text
Session
sourceType = HabitExecution
sourceId = nonexistent ID
```

must be rejected.

Likewise, a Session for a cancelled/invalid Next Action must follow the domain's transition rules.

---

# 31. Multiple Sessions for One Work Item

The data model must support:

```text
Next Action
   ├── Session 1
   ├── Session 2
   └── Session 3
```

and:

```text
Habit Execution
   ├── Session 1
   └── Session 2
```

Therefore neither Next Action nor Habit Execution should contain only one:

```text
sessionId
```

as its permanent execution relationship.

The relationship is one-to-many.

---

# 32. Session Duration

The system should distinguish:

```text
Wall-clock duration
```

from:

```text
Active execution duration
```

Example:

```text
Started: 10:00
Paused: 10:20
Resumed: 10:40
Ended: 11:00
```

Wall-clock span:

```text
60 minutes
```

Active execution:

```text
40 minutes
```

The data model must be able to represent this distinction.

---

# 33. Session Segments

If precise pause/resume history is required, Session may contain or reference execution segments.

Conceptually:

```text
Session
   ├── Segment 1
   ├── Segment 2
   └── Segment 3
```

Example:

```text
10:00 → 10:20
10:40 → 11:00
```

This provides reliable reconstruction of active duration.

The exact persistence strategy can be optimized during implementation.

---

# 34. Session State

Current Session state may be:

```text
Ready
Running
Paused
Interrupted
Completed
Abandoned
```

The current state belongs to the Session.

The timer does not own this state.

---

# 35. Session History

For important execution history, the system should preserve:

```text
started
paused
resumed
interrupted
completed
abandoned
```

Whether these are stored as an explicit event history or represented through structured Session data is an implementation decision.

The requirement is that meaningful historical execution must not be lost.

---

# 36. Reflection

A Reflection represents user-generated interpretation of an experience.

It may relate to:

```text
Session
Habit Execution
Project
Day
```

Therefore Reflection should not be permanently tied to only one type of object unless product requirements later establish that constraint.

Conceptually:

```text
Reflection
├── id
├── contextType
├── contextId
├── content
├── createdAt
└── updatedAt
```

---

# 37. Recovery Record

Recovery represents a response to disruption.

Conceptually:

```text
Recovery
├── id
├── trigger
├── context
├── selectedAction
├── status
├── createdAt
└── resolvedAt
```

A Recovery Record is historical information.

It should not overwrite the original Session or Next Action.

---

# 38. Habit ↔ Life Domain

A central architectural rule from the updated Step 2:

> Habits are independent from Project hierarchy and may influence multiple Life Domains.

Therefore this must **not** be represented as:

```text
Habit.domainId
```

if a Habit can influence multiple domains.

Use:

```text
HabitLifeDomain
├── habitId
└── domainId
```

This is a many-to-many relationship.

---

# 39. Habit ↔ Goal

A Habit may support multiple Goals.

Therefore:

```text
HabitGoal
├── habitId
└── goalId
```

should represent this relationship where applicable.

Example:

```text
Exercise Habit
      │
      ├── Goal: Improve physical fitness
      └── Goal: Build disciplined lifestyle
```

---

# 40. Habit Influence Is Not Dependency

A relationship such as:

```text
Habit → Goal
```

does not mean:

```text
Goal depends on Habit
```

and does not mean:

```text
Habit completion = Goal progress
```

The relationship represents support/influence.

This distinction must remain explicit in the data model.

---

# 41. Influence Metadata

If PBOS eventually needs richer influence modeling, the association record may contain metadata such as:

```text
HabitGoal
├── habitId
├── goalId
├── relationshipType
└── notes
```

For example:

```text
supports
contributes_to
associated_with
```

The system must avoid implying scientific causality merely because a relationship exists.

---

# 42. Habit ↔ Project

A Habit must not automatically belong to a Project.

The architecture deliberately keeps:

```text
Project hierarchy
```

and:

```text
Habit system
```

independent.

A Habit may influence a Project-related Goal, but that does not make the Habit a child of the Project.

---

# 43. Many-to-Many Relationship Principle

Whenever a relationship is genuinely many-to-many, use an explicit association.

Examples:

```text
Habit ↔ Goal
Habit ↔ Life Domain
Project ↔ Goal
```

Do not force many-to-many relationships into a single foreign-key field.

---

# 44. Relationship Records Are First-Class When Needed

An association record should become persistent when the relationship itself has meaning.

For example:

```text
HabitGoal
```

may eventually need:

```text
relationshipType
notes
createdAt
```

If the relationship has no additional meaning, a simpler join representation is sufficient.

---

# 45. Current State vs History

Every entity should be evaluated separately for:

```text
Current State
```

and:

```text
Historical State
```

Example:

```text
Habit.status = Active
```

describes current state.

But:

```text
HabitExecution on August 20 = Completed
```

describes history.

They must not overwrite one another.

---

# 46. Soft Delete vs Archive

PBOS should prefer **archive/inactive states** for meaningful user-created entities.

Examples:

```text
Habit → Archived
Project → Archived
Goal → Archived
```

instead of immediately deleting them.

This protects historical relationships and analytics.

---

# 47. Hard Deletion

Hard deletion should be restricted.

It may be appropriate for:

- accidental empty records
- temporary data
- user-requested permanent deletion where safe
- data cleanup

But deleting a core entity with historical Sessions should require careful handling.

---

# 48. Referential Integrity

The persistence layer must prevent broken relationships.

Example:

If:

```text
HabitExecution.habitId
```

references a Habit, that Habit must exist.

Deleting the Habit should therefore not automatically create an orphaned Habit Execution.

Archiving is generally safer.

---

# 49. Historical Integrity

Historical records must remain interpretable even when current entities change.

For example:

```text
Habit renamed
```

should not make an old Session meaningless.

The system should retain the necessary references/context to reconstruct what happened.

---

# 50. Derived Data

The following should generally be derived:

```text
Habit streak
Habit completion percentage
Weekly consistency
Monthly consistency
Project completion percentage
Total focused time
Today summary
Goal progress visualization
```

They should be calculated from authoritative records.

---

# 51. Streaks

A streak should not normally be stored as the primary truth.

Instead:

```text
Habit Executions
      ↓
Streak Calculation
      ↓
Current Streak
```

This prevents stale streak values when historical data is corrected.

Caching may be introduced later for performance.

---

# 52. Project Progress

Project progress should not simply equal:

```text
number of completed Sessions
```

A Session measures execution, not semantic completion.

Project progress should be derived from meaningful project structure and completion rules.

---

# 53. Goal Progress

Goal progress must not automatically equal:

```text
Habit completion × 100
```

or:

```text
Project completion × 100
```

unless a specific measurable Goal model explicitly defines such a calculation.

Because Habits can have soft influence on Goals, Goal progress and Habit activity must remain conceptually distinct.

---

# 54. Analytics Data

Analytics should primarily derive from:

```text
Sessions
Habit Executions
Next Action states
Reflections
Goals
Projects
```

Analytics should not become a second source of truth.

---

# 55. Daily View Data

The Today screen should be generated from authoritative records.

Conceptually:

```text
GetToday()
    ↓
Today's Habit Executions
+
Relevant Next Actions
+
Daily Targets
+
Current Session
+
Recovery information
    ↓
Today View Model
```

The Today View Model is derived data.

It should not be treated as the master database record for the day.

---

# 56. Daily Habit Generation

A recurring Habit needs a reliable mechanism to determine whether an execution exists for a particular day.

The system must avoid accidentally creating duplicate Daily Habit Executions.

For example:

```text
Exercise — August 21
```

should normally have one canonical Daily Habit Execution.

Repeated opening of the application must not create:

```text
Exercise — August 21 #1
Exercise — August 21 #2
Exercise — August 21 #3
```

---

# 57. Idempotency

Operations that may be triggered multiple times must be safe against duplication where appropriate.

Example:

```text
Generate today's Habit Executions
```

called twice should not create duplicate occurrences.

Likewise, UI retries must not accidentally create multiple Sessions from one user action.

---

# 58. Session Creation Integrity

Starting a Session should be treated as a controlled operation.

The system must check:

```text
Does source exist?
Is source executable?
Is there already an active Session?
Is this transition allowed?
```

before creating a new active Session.

---

# 59. One Active Session Constraint

The data/persistence architecture should enforce or strongly support:

```text
At most one active focused Session per user.
```

This should not rely only on UI behavior.

The application/domain layer must enforce it.

The persistence layer should provide sufficient support to avoid race-condition-like duplicate active Sessions if the application environment later becomes concurrent.

---

# 60. Transactional Operations

Some operations involve multiple related state changes.

Example:

```text
Complete Session
      ↓
Update Session
      ↓
Evaluate Habit Execution
      ↓
Update Habit Execution
```

These changes must remain consistent.

If the persistence technology supports transactions, related state changes should be performed atomically where necessary.

---

# 61. Example: Completing a Habit Session

Conceptually:

```text
Start transaction
      ↓
Complete Session
      ↓
Calculate actual execution
      ↓
Update Daily Habit Execution
      ↓
Persist
      ↓
Commit
```

If something fails before completion, the system should avoid leaving the database in a partially updated state.

---

# 62. Example: Completing a Next Action

```text
Complete Session
      ↓
Determine actual outcome
      ↓
If user confirms Next Action completion
      ↓
Complete Next Action
```

The Session and Next Action states must not be accidentally conflated.

---

# 63. No Automatic Semantic Inference Without Rules

The system must not infer:

```text
Session completed
→ Next Action completed
```

unless a specific product rule explicitly says so.

Likewise:

```text
20 minutes exercise
→ Habit completed
```

must depend on the Habit's execution rules.

---

# 64. Data Model Summary

The primary conceptual graph is:

```text
USER
 │
 ├── GOALS
 │     │
 │     └── LIFE DOMAINS
 │
 ├── PROJECTS
 │     │
 │     ├── ROADMAP
 │     │      └── NODES
 │     │
 │     └── NEXT ACTIONS
 │
 ├── HABITS
 │     │
 │     ├── HABIT EXECUTIONS
 │     │
 │     ├── LIFE DOMAINS
 │     └── GOALS
 │
 ├── SESSIONS
 │     │
 │     ├── NEXT ACTION
 │     └── HABIT EXECUTION
 │
 ├── REFLECTIONS
 │
 └── RECOVERY RECORDS
```

---

# 65. Execution Data Graph

The most important execution relationships are:

```text
Project
   ↓
Node
   ↓
Next Action
   ↓
┌───────────────┐
│   Session 1   │
│   Session 2   │
│   Session 3   │
└───────────────┘
```

and:

```text
Habit
   ↓
Daily Habit Execution
   ↓
┌───────────────┐
│   Session 1   │
│   Session 2   │
└───────────────┘
```

---

# 66. Habit Influence Graph

The updated Habit architecture is represented as:

```text
                     ┌──→ Life Domain A
                     │
Habit ───────────────┼──→ Life Domain B
                     │
                     └──→ Life Domain C

Habit ───────────────┬──→ Goal A
                     └──→ Goal B
```

These are:

```text
many-to-many
non-blocking
soft influence relationships
```

They are not structural dependencies.

---

# 67. Data Ownership Summary

| Data                   | Owner                     |
| ---------------------- | ------------------------- |
| Habit definition       | Habit domain              |
| Daily Habit Execution  | Habit execution domain    |
| Project                | Project domain            |
| Roadmap                | Project/Roadmap domain    |
| Node                   | Roadmap domain            |
| Next Action            | Action domain             |
| Session                | Execution domain          |
| Timer state            | Runtime/Time system       |
| Reflection             | Reflection domain         |
| Recovery               | Recovery domain           |
| Today View             | Derived/Application layer |
| Analytics              | Derived/Analytics layer   |
| Mind Map visualization | Presentation layer        |

---

# 68. Data Lifecycle

A typical Habit lifecycle:

```text
Habit Created
      ↓
Active
      ↓
Daily Executions
      ↓
Historical Executions
      ↓
Habit Archived
      ↓
History Preserved
```

A typical Next Action lifecycle:

```text
Created
  ↓
Available
  ↓
Active
  ↓
Completed
```

A typical Session lifecycle:

```text
Created
  ↓
Running
  ├── Paused
  ├── Interrupted
  ├── Completed
  └── Abandoned
```

---

# 69. Data Integrity Invariants

### DATA-01

Every persistent entity has a stable unique ID.

### DATA-02

Historical execution must not be silently rewritten by current configuration changes.

### DATA-03

A Habit is separate from its Daily Habit Executions.

### DATA-04

A Daily Habit Execution is separate from its Sessions.

### DATA-05

A Next Action may have multiple Sessions.

### DATA-06

A Habit Execution may have multiple Sessions.

### DATA-07

A Session has exactly one primary execution source.

### DATA-08

A Session cannot reference a nonexistent source.

### DATA-09

A user should not have multiple simultaneously active focused Sessions.

### DATA-10

Habit ↔ Goal is many-to-many where applicable.

### DATA-11

Habit ↔ Life Domain is many-to-many where applicable.

### DATA-12

Habit influence does not imply Goal dependency or causality.

### DATA-13

Derived analytics are not the primary source of truth.

### DATA-14

Today View is derived from authoritative data.

### DATA-15

Archiving should preserve historical relationships.

### DATA-16

Duplicate Daily Habit Executions for the same occurrence must be prevented.

### DATA-17

Important multi-record state changes should be atomic where necessary.

### DATA-18

Actual execution must not overwrite intended configuration.

---

# 70. Deletion Rules

Before permanently deleting an entity, the system must evaluate its dependencies.

For example:

```text
Delete Habit
    ↓
What happens to Habit Executions?
    ↓
What happens to Sessions?
    ↓
What happens to Goals/Domains relationships?
```

The default strategy for meaningful historical entities should be:

> **Archive rather than delete.**

Permanent deletion should be an explicit operation.

---

# 71. Data Correction Rules

If historical data is wrong:

```text
Current data
      ↓
Explicit correction
      ↓
Corrected record
```

The correction must not silently alter unrelated historical records.

For example, changing today's Habit Target must not modify yesterday's execution.

---

# 72. Persistence Technology

PBOS Version 1 uses a hybrid local-first persistence architecture.

### Canonical Database

Supabase/PostgreSQL is the canonical long-term persistent database.

It stores durable PBOS data including:

- Habits
- Daily Habit Executions
- Goals
- Life Domains
- Projects
- Roadmaps
- Next Actions
- Sessions
- Reflections
- historical records
- domain relationships

### Local Persistence

IndexedDB is used by the Web application as local operational
persistence.

Its responsibilities include:

- offline operation
- active Session protection
- local execution state
- pending changes
- synchronization queue
- fast local reads/writes where appropriate

### Synchronization

A dedicated synchronization layer is responsible for exchanging
changes between IndexedDB and Supabase/PostgreSQL.

The UI must not communicate directly with either persistence provider.

The application layer communicates with the persistence boundary.

Conceptually:

Web UI
↓
Application Logic
↓
Persistence Boundary
├── Local Persistence Adapter
│ ↓
│ IndexedDB
│
└── Remote Persistence Adapter
↓
Supabase
↓
PostgreSQL

### Historical Integrity

Historical records must represent what actually happened.

Changes to current configuration must not silently rewrite historical
execution records.

### Active Session Integrity

An active Session must remain recoverable even when network connectivity
is temporarily unavailable.

### Conflict Handling

Single-device operation is the primary Version 1 use case.

Multi-device conflict resolution must not be implemented speculatively.

A formal conflict strategy is required before enabling simultaneous
multi-device editing.

---

# 73. What Must Not Be Done

The implementation must not:

### 1. Store only the current Habit state

This would destroy historical execution information.

### 2. Store only one Session per Next Action

One work item may require multiple Sessions.

### 3. Treat Timer as Session

A timer measures time; Session represents execution.

### 4. Put Habit directly under Project

Habits are independent cross-domain behaviors.

### 5. Store only `completed: true`

PBOS needs richer execution information.

### 6. Calculate all analytics permanently and manually

They should primarily derive from authoritative history.

### 7. Make Today the master database entity

Today is primarily a view of current data.

### 8. Delete historical data when a Habit is archived

Historical execution must survive.

### 9. Store a single `domainId` on Habit

A Habit can influence multiple Life Domains.

### 10. Assume Habit completion equals Goal progress

Influence is soft, not structural dependency.

---

# 74. Example — Exercise Habit

Suppose:

```text
Habit:
Exercise

Target:
45 minutes

Reduced:
20 minutes

Minimum:
5 minutes
```

The stored conceptual data is:

```text
Habit
│
├── Target = 45
├── Reduced = 20
└── Minimum = 5
```

Today's occurrence:

```text
HabitExecution
│
├── date = Aug 21
├── selectedLevel = Reduced
├── configuredReduced = 20
└── actual = 23
```

Sessions:

```text
HabitExecution
   │
   ├── Session #1 = 15 min
   └── Session #2 = 8 min
```

Total:

```text
Actual = 23 minutes
```

The system can therefore distinguish:

```text
Normal Target = 45
Selected Level = Reduced
Actual = 23
```

without corrupting the Habit definition.

---

# 75. Example — Project Work

Suppose:

```text
Project:
Build PBOS

Node:
Authentication

Next Action:
Implement login validation
```

The data relationship is:

```text
Project
   ↓
Node
   ↓
Next Action
   ↓
Session #1
   ↓
Session #2
```

After Session #1:

```text
Session = Completed
Next Action = Active
```

After Session #2:

```text
Session = Completed
Next Action = Completed
```

The database must support this naturally.

---

# 76. Final Data Architecture

The complete persistence model can be summarized as:

```text
                    USER
                      │
        ┌─────────────┼─────────────┐
        │             │             │
      GOALS       PROJECTS       HABITS
        │             │             │
   LIFE DOMAINS    ROADMAP       EXECUTIONS
        │             │             │
        │           NODES          │
        │             │             │
        │       NEXT ACTIONS       │
        │             │             │
        └─────────────┴──────┬──────┘
                             │
                          SESSIONS
                             │
                    ┌────────┴────────┐
                    │                 │
               REFLECTIONS        RECOVERY
```

With Habit influence relationships:

```text
HABIT
 ├────────→ LIFE DOMAINS
 └────────→ GOALS
```

And execution relationships:

```text
NEXT ACTION ──────┐
                  ├──→ SESSION
HABIT EXECUTION ──┘
```

---

# 77. Step 6 Completion Criteria

Step 6 is complete when the implementation team can clearly answer:

- What information is persistent?
- What information is derived?
- What has its own identity?
- What is an occurrence?
- What is historical?
- How is a Habit different from a Habit Execution?
- How is a Next Action different from a Session?
- How can one work item have multiple Sessions?
- How are Target/Reduced/Minimum preserved?
- How are historical Habit configurations preserved?
- How are Habits connected to multiple Goals?
- How are Habits connected to multiple Life Domains?
- How are Project relationships represented?
- How is the mind-map structure represented?
- What can be archived?
- What should not be deleted?
- How are duplicate daily executions prevented?
- How is the one-active-Session rule protected?
- Which data is authoritative?
- Which data is derived?

---

# Step 7 — Next Architecture Stage

The next stage should be:

> **Step 7 — Application Logic, Commands & Business Rules**

Step 7 will define exactly **what the software does when the user performs an action**.

For example:

```text
User clicks "Start Exercise"
        ↓
Which record is found?
        ↓
Which validation runs?
        ↓
Which state changes?
        ↓
Which Session is created?
        ↓
What gets persisted?
        ↓
What does Today display?
        ↓
What happens if the user pauses?
        ↓
What happens if the app closes?
        ↓
What happens when the Session ends?
        ↓
How is Habit completion determined?
```

এখানে আমরা architecture-কে আরেক ধাপ বাস্তব করব—**data কীভাবে রাখা হবে** থেকে **user action-এর ফলে system-এর ভিতরে ঠিক কী ঘটবে** পর্যন্ত।
