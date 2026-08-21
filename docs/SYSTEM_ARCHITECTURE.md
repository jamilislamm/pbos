# PBOS — System Architecture & Technical Boundaries

**Document:** `PBOS_SYSTEM_ARCHITECTURE.md`
**Architecture Version:** 1.0
**Current Phase:** Step 5 — System Architecture & Technical Boundaries
**Status:** Initial Technical Architecture

---

# 1. Purpose

This document translates the PBOS domain model and execution model into a maintainable software architecture.

The architecture must:

- preserve the domain rules defined in Steps 1–4
- keep business logic independent from UI
- keep persistence independent from business decisions
- prevent unnecessary coupling between features
- support future growth without requiring a full rewrite
- make AI-assisted development safer and more predictable
- keep the execution system simple for the user
- preserve historical execution data
- allow future backend/API/mobile clients without redesigning the domain

The architecture must follow the product's actual behavior rather than being based on a popular framework or fashionable pattern.

---

# 2. Primary Architectural Principle

PBOS follows:

> **Domain first, implementation second.**

The system architecture must be derived from:

```text
Product Intent
      ↓
Domain Model
      ↓
User Flows
      ↓
State Machines
      ↓
Business Rules
      ↓
Technical Architecture
      ↓
Implementation
```

A framework must never determine the domain model.

---

# 3. High-Level Architecture

PBOS should be organized into clear responsibility layers.

```text
┌──────────────────────────────────────┐
│              UI Layer                │
│                                      │
│ Today                               │
│ Projects                            │
│ Habits                              │
│ Roadmap / Mind Map                  │
│ Session UI                          │
│ Reflection                          │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│       Application / Use Cases        │
│                                      │
│ Start Session                       │
│ Pause Session                       │
│ Resume Session                      │
│ Complete Session                    │
│ Start Habit Execution               │
│ Complete Next Action                │
│ Recover From Interruption           │
│ Create Next Action                  │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│             Domain Layer             │
│                                      │
│ Habit                               │
│ Habit Execution                     │
│ Project                             │
│ Roadmap                             │
│ Node                                │
│ Next Action                         │
│ Session                             │
│ Reflection                          │
│ Recovery                            │
│ Domain Rules                        │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│        Persistence / Data Layer      │
│                                      │
│ Repositories                        │
│ Storage Adapter                     │
│ Database                            │
│ Local / Remote Persistence           │
└──────────────────────────────────────┘
```

The exact technology used to implement these layers is intentionally left open.

---

# 4. Architectural Boundaries

PBOS must maintain four major boundaries:

```text
Presentation
     ↓
Application
     ↓
Domain
     ↓
Infrastructure
```

These boundaries are logical responsibilities.

They do not necessarily require four separate applications or four separate servers.

---

# 5. Presentation Layer

The Presentation Layer is responsible for showing information and receiving user interaction.

Examples:

- Today Screen
- Project Screen
- Habit Screen
- Roadmap/Mind Map
- Session Screen
- Reflection Screen
- Recovery Screen
- Settings

The Presentation Layer must not contain core business rules.

---

## 5.1 Presentation Layer Responsibilities

It may:

- display domain state
- collect user input
- trigger application actions
- show validation errors
- format data for display
- manage UI-only state
- display loading/error states

It must not decide:

- whether a Session is actually complete
- whether a Habit is completed
- whether a Next Action is completed
- whether a Habit's Target/Reduced/Minimum level is valid
- whether a Project is blocked
- whether historical data should be rewritten

Those decisions belong to the appropriate application/domain logic.

---

# 6. Application Layer

The Application Layer coordinates user actions.

It answers:

> "What operation is the user trying to perform?"

Examples:

```text
StartNextAction
StartHabitExecution
StartSession
PauseSession
ResumeSession
CompleteSession
CompleteNextAction
SkipHabitExecution
CreateProject
CreateHabit
CreateNextAction
TriggerRecovery
CompleteReflection
```

---

# 7. Use Cases

A use case represents a meaningful system operation.

A use case should coordinate domain objects rather than contain all domain rules itself.

Example:

```text
StartHabitExecution
      ↓
Find today's Habit Execution
      ↓
Validate it can start
      ↓
Create / prepare Session
      ↓
Persist state
      ↓
Return updated execution state
```

The UI should call the use case rather than directly modifying database records.

---

# 8. Domain Layer

The Domain Layer contains the meaning of PBOS.

This is the most important layer.

It defines:

- entities
- value concepts
- state transitions
- business rules
- relationships
- invariants
- execution behavior

The domain must not depend on:

- UI framework
- database library
- browser APIs
- specific backend framework
- CSS
- network implementation

---

# 9. Core Domain Concepts

The domain should be organized around the following concepts.

```text
Life Domain
Goal
Project
Roadmap
Node
Next Action

Habit
Daily Habit Execution

Session
Reflection
Recovery
```

Not every concept must necessarily become a separate software class or database table.

The domain model defines meaning; implementation structure may differ when justified.

---

# 10. Project Domain

The Project domain contains:

```text
Project
   ↓
Roadmap
   ↓
Node
   ↓
Next Action
```

The Project hierarchy is used to represent planned work.

It is not the same as the execution history.

---

# 11. Habit Domain

The Habit domain contains:

```text
Habit
   ↓
Daily Habit Execution
```

A Habit is a recurring behavior definition.

A Daily Habit Execution represents a particular occurrence.

A Habit does not belong underneath a Project.

---

# 12. Execution Domain

The execution layer is shared.

```text
Project Next Action ──────┐
                          ↓
                       Session
                          ↑
Habit Execution ──────────┘
```

The Session records actual execution.

This is a critical architectural boundary.

The system must not create separate incompatible execution systems such as:

```text
ProjectSession
HabitSession
```

unless a future requirement proves that fundamentally different behavior is necessary.

For the current architecture, both use the common Session concept.

---

# 13. Session Is Not a Timer Module

A Session contains more meaning than elapsed time.

Conceptually:

```text
Session
├── execution context
├── source
├── start
├── pause/resume history
├── active duration
├── completion state
├── interruption information
├── outcome
└── reflection/context where applicable
```

A timer is only responsible for measuring time.

Therefore:

```text
Session
   ├── Execution State
   └── Timer / Time Tracking
```

must remain conceptually separate.

---

# 14. Timer Boundary

The Timer component is responsible for time measurement.

It may manage:

- start timestamp
- pause timestamp
- resume timestamp
- elapsed active time
- elapsed wall-clock time
- countdown display
- timer accuracy

It must not decide:

> "The work is complete."

For example:

```text
45-minute timer reaches zero
```

does not automatically mean:

```text
Next Action = Completed
```

or:

```text
Habit = Completed
```

---

# 15. Session State vs Timer State

These must not be treated as the same state.

Example:

```text
Session:
Running

Timer:
Paused
```

should generally be invalid.

But:

```text
Session:
Paused

Timer:
Paused
```

is valid.

The domain/application layer controls Session state.

The Timer supports time measurement.

---

# 16. Persistence Layer

The Persistence Layer is responsible for storing and retrieving information.

It must not contain product decisions.

Examples:

```text
ProjectRepository
HabitRepository
NextActionRepository
SessionRepository
ReflectionRepository
```

Repositories provide domain/application code with a stable way to access data.

---

# 17. Repository Boundary

The application/domain layer should depend on repository interfaces/contracts rather than a specific database implementation.

Conceptually:

```text
Application / Domain
        ↓
Repository Interface
        ↓
Storage Adapter
        ↓
Database
```

This makes it possible to change storage technology later without rewriting domain logic.

---

# 18. Database Architecture

PBOS requires persistent storage because it must preserve:

- Projects
- Goals
- Habits
- Habit configurations
- Daily Habit Executions
- Next Actions
- Sessions
- execution history
- reflections
- relationships
- recovery information

The exact database technology is not fixed by this architecture document.

The database must support reliable relationships and historical records.

---

# 19. Current Storage Strategy

The implementation should initially prefer the simplest reliable persistence architecture appropriate for the current application scale.

The system should not introduce:

- microservices
- distributed databases
- event buses
- message queues
- unnecessary cloud infrastructure

unless a concrete requirement appears.

PBOS is initially a single product, not a distributed enterprise platform.

---

# 20. Local-First Consideration

Because PBOS is fundamentally a personal operating system, the architecture should support reliable local usage.

The application should remain useful even when network connectivity is unavailable where practical.

This means the architecture should avoid making every user action dependent on a remote request.

However, "local-first" does not require committing to a specific database or synchronization technology at this stage.

---

# 21. Source of Truth

For each important piece of information, PBOS must have a clear source of truth.

Examples:

```text
Habit Definition
      ↓
Habit data

Today's Habit occurrence
      ↓
Daily Habit Execution

Actual work
      ↓
Session

Project work definition
      ↓
Next Action

Project structure
      ↓
Roadmap / Node
```

The same information should not be independently stored in multiple places unless there is a clear reason.

---

# 22. Derived Data

Some UI information should be calculated rather than permanently duplicated.

For example:

```text
Today Screen
```

may combine:

```text
Today's Habit Executions
+
Available Next Actions
+
Daily Targets
+
Current Session
+
Recovery State
```

Today is therefore primarily a **derived view**, not necessarily a giant independent data object.

---

# 23. Today Screen Boundary

The Today Screen should not become the owner of business logic.

It should ask the application layer for:

> "What is relevant and executable today?"

The application/domain layer determines the answer.

Conceptually:

```text
Today Screen
     ↓
GetTodayView
     ↓
Application Layer
     ↓
Domain / Repositories
     ↓
Today View Model
     ↓
UI
```

---

# 24. Mind Map Boundary

The Roadmap/Mind Map is a visualization of planning structure.

It should visualize:

```text
Project
   ↓
Roadmap
   ↓
Node
   ↓
Relationships
```

It should not become the execution engine.

Starting a Session from a node should go through the same application/domain execution system used elsewhere.

---

# 25. Today vs Mind Map

These two views serve different purposes.

### Mind Map

Answers:

> "How does this Project fit together?"

### Today

Answers:

> "What meaningful things can I execute today?"

### Session

Answers:

> "What am I actually doing right now?"

They must not be merged into one overloaded interface.

---

# 26. Habit Configuration Boundary

Habit configuration should define the behavior policy.

Example:

```text
Habit
├── frequency
├── Target
├── Reduced
├── Minimum
└── completion rules
```

The Daily Habit Execution should reference the relevant configuration for that occurrence.

Historical execution must not be silently rewritten when the Habit configuration changes later.

---

# 27. Historical Data Rule

PBOS must distinguish:

```text
Current configuration
```

from:

```text
Historical reality
```

Example:

Today:

```text
Exercise Target = 45 min
```

Tomorrow:

```text
Exercise Target = 30 min
```

Yesterday's Session must still remember what its execution context was at that time.

Historical records must not magically change because the current Habit configuration changed.

---

# 28. State Management Boundary

Application state should be divided into:

### Persistent Domain State

Examples:

```text
Projects
Habits
Next Actions
Sessions
Reflections
```

### Temporary Application State

Examples:

```text
currently selected item
temporary form values
navigation state
unsaved UI input
```

### Runtime State

Examples:

```text
active timer tick
temporary animation state
current UI interaction
```

Runtime/UI state must not accidentally become the authoritative source of domain data.

---

# 29. Active Session State

The current active Session is important application state.

Conceptually:

```text
Active Session
      ↓
Session ID
      ↓
Persistent Session Record
      +
Runtime Timer State
```

The timer display may update frequently without writing every second to the database.

Persistence should occur at meaningful state transitions.

---

# 30. Session Persistence Strategy

The system should persist important transitions such as:

```text
Session Created
Session Started
Session Paused
Session Resumed
Session Interrupted
Session Completed
Session Abandoned
```

The exact persistence mechanism is an implementation decision.

The important architectural requirement is that important execution history must survive application restart or accidental UI loss.

---

# 31. Crash / Refresh Safety

A browser refresh, application crash, or accidental close must not silently destroy an active Session.

The architecture should therefore preserve enough information to recover:

```text
Active Session
+
Start time
+
Pause state
+
Execution context
```

When the application returns, it should determine the correct Session state from persisted information.

---

# 32. Time as a Domain Concern

Time handling must be centralized.

The system must not independently calculate duration in multiple UI components.

A single reliable time calculation strategy should determine:

```text
active duration
elapsed duration
start time
pause duration
completion time
```

The UI merely displays the result.

---

# 33. Application Commands

Important state changes should be represented conceptually as commands/use cases.

Examples:

```text
CreateHabit
UpdateHabit
ScheduleHabitExecution
StartHabitExecution

CreateNextAction
StartNextAction
CompleteNextAction
BlockNextAction
DeferNextAction

StartSession
PauseSession
ResumeSession
InterruptSession
CompleteSession
AbandonSession

TriggerRecovery
CompleteReflection
```

The exact implementation pattern is not fixed.

The purpose is to prevent arbitrary components from directly mutating domain state.

---

# 34. Query vs Command Separation

PBOS should distinguish:

### Commands

Change state.

Examples:

```text
StartSession
CompleteSession
PauseHabit
CompleteNextAction
```

### Queries

Read state.

Examples:

```text
GetToday
GetActiveSession
GetProjectRoadmap
GetHabitHistory
GetSessionHistory
GetAnalytics
```

A query should not unexpectedly modify domain state.

---

# 35. Validation Boundary

Validation should happen at the correct level.

### UI Validation

Checks obvious input problems:

```text
empty field
invalid format
missing required input
```

### Domain Validation

Checks business rules:

```text
Cannot start archived Habit
Cannot start cancelled Next Action
Cannot complete invalid state
Cannot have conflicting active Sessions
```

UI validation must never replace domain validation.

---

# 36. Error Handling

Errors should be divided into:

### User-Correctable

Examples:

```text
Missing required information
Invalid input
Invalid state transition
```

### System / Infrastructure

Examples:

```text
Database unavailable
Storage failure
Unexpected application error
```

The UI should present useful recovery options rather than exposing internal implementation details.

---

# 37. Module Boundaries

The implementation should be organized around meaningful responsibilities rather than arbitrary file sizes.

A possible logical structure is:

```text
src/
├── domain/
│   ├── projects/
│   ├── roadmap/
│   ├── habits/
│   ├── actions/
│   ├── sessions/
│   ├── recovery/
│   └── shared/
│
├── application/
│   ├── projects/
│   ├── habits/
│   ├── sessions/
│   ├── recovery/
│   └── today/
│
├── infrastructure/
│   ├── persistence/
│   ├── storage/
│   └── time/
│
└── presentation/
    ├── today/
    ├── projects/
    ├── habits/
    ├── sessions/
    ├── roadmap/
    └── reflection/
```

This is a **logical architecture**, not a mandatory final folder structure.

The implementation may simplify it where appropriate.

---

# 38. Avoid Premature Over-Engineering

The following should not be introduced merely for architectural appearance:

- microservices
- event-driven distributed architecture
- complex dependency injection frameworks
- unnecessary abstractions
- excessive interfaces
- multiple databases
- message queues
- complex state-management frameworks
- unnecessary API layers

Every abstraction must solve a real problem.

---

# 39. AI-Assisted Development Boundary

Because PBOS will be developed incrementally with AI assistance, architecture must make changes locally understandable.

An AI coding agent should be able to work on:

```text
Habit domain
```

without accidentally modifying:

```text
Session timer
```

unless the requested feature actually requires it.

Likewise:

```text
Today UI
```

should not contain hidden business rules that another AI agent cannot discover.

---

# 40. Dependency Direction

Dependencies should generally point inward toward domain meaning.

```text
Presentation
     ↓
Application
     ↓
Domain
     ↑
Infrastructure
```

The Domain must not depend on Presentation or Infrastructure.

---

# 41. No Database Logic in UI

UI components must never directly perform domain-level database mutations such as:

```text
UPDATE habits
INSERT sessions
DELETE project
```

Instead:

```text
UI
 ↓
Use Case
 ↓
Domain Rules
 ↓
Repository
 ↓
Persistence
```

This protects the architecture from becoming difficult to maintain.

---

# 42. No Business Logic in Database Queries

The database should store and retrieve data.

It should not become the primary location for complex PBOS behavior.

For example, rules such as:

> "A Minimum Habit execution preserves continuity but should not be treated as Target completion"

belong in domain/application logic.

---

# 43. Analytics Boundary

Analytics must consume historical data rather than becoming the source of truth.

Conceptually:

```text
Sessions
Habit Executions
Next Actions
Reflections
      ↓
Analytics
      ↓
Insights
```

Analytics must not rewrite the underlying history.

---

# 44. Causality Boundary

Because Habit impact is intentionally soft:

Analytics may say:

```text
"Exercise was associated with higher energy ratings."
```

It must not automatically say:

```text
"Exercise caused higher energy."
```

The architecture must preserve this distinction.

---

# 45. Notification / Nudging Boundary

Future nudging functionality should operate above domain data.

Conceptually:

```text
Domain State
     ↓
Nudge Decision
     ↓
Notification / Prompt
```

A notification must not directly mutate the underlying domain state merely because it was shown.

---

# 46. Offline / Synchronization Boundary

If remote synchronization is introduced later:

```text
Domain
   ↓
Local Persistence
   ↓
Sync Layer
   ↓
Remote Server
```

The domain should not depend directly on the network.

Synchronization is an infrastructure concern.

---

# 47. Future Platform Support

The architecture should allow future clients such as:

```text
Web
Mobile
Desktop
```

to use the same conceptual domain and application rules.

This does not mean all clients must share identical UI code.

---

# 48. Security Boundary

Authentication and authorization, if required later, belong outside the core domain rules.

The domain should not contain assumptions such as:

```text
this is a browser user
this is a Google account
this is a specific authentication provider
```

The core domain should operate on the user's authorized application context.

---

# 49. Data Ownership

Each domain concept should have one clear owner.

Examples:

```text
Habit
→ Habit domain

Daily Habit Execution
→ Habit execution domain

Next Action
→ Project/action domain

Session
→ Execution domain

Timer
→ Time/runtime infrastructure

Today
→ Application/query layer

Mind Map
→ Presentation/query representation
```

This prevents multiple modules from independently controlling the same state.

---

# 50. Critical Architecture Rule: Do Not Duplicate State

The system should avoid storing the same fact independently in multiple places.

Bad:

```text
Habit:
completedToday = true

Daily Habit Execution:
status = completed
```

if both can independently become different.

Prefer a clear source of truth.

Derived values should be calculated where practical.

---

# 51. Critical Architecture Rule: History Is Immutable by Default

Historical execution should generally be append-oriented.

For example:

```text
Session Completed
```

should not later be rewritten simply because the user changed a Habit Target.

Corrections should be explicit.

---

# 52. Correction vs Rewrite

If a user made a genuine mistake:

```text
Incorrect historical data
       ↓
Explicit correction
```

The system should preserve enough information to understand that the record was corrected.

Normal configuration changes must never silently rewrite historical reality.

---

# 53. Recommended Initial Technical Shape

The initial implementation should prefer a **modular monolith**.

Conceptually:

```text
One Application
      │
      ├── Domain Modules
      ├── Application Modules
      ├── Presentation
      └── Persistence
```

This is deliberately different from a microservice architecture.

PBOS does not currently have a scale or organizational requirement that justifies distributed services.

---

# 54. Why Modular Monolith

It provides:

- simple development
- simple deployment
- easier AI-assisted coding
- clear module boundaries
- low infrastructure cost
- easy debugging
- easier local development
- future extraction of modules if genuinely necessary

The architecture should optimize for **clarity and maintainability**, not architectural prestige.

---

# 55. Framework Selection Rule

No framework is selected merely because it is popular.

A technology should be selected only after evaluating:

```text
Does it support the domain model?
Does it support the required UI?
Does it support reliable persistence?
Does it support offline/local behavior where needed?
Is it practical for the current project size?
Is it maintainable for a solo developer?
Is it suitable for AI-assisted development?
Can it evolve later?
Does it introduce unnecessary complexity?
```

---

# 56. Technology Decision Principle

Technology choices must follow this order:

```text
Requirements
     ↓
Domain
     ↓
Architecture
     ↓
Constraints
     ↓
Technology selection
```

Never:

```text
Popular Framework
     ↓
Force PBOS into its architecture
```

---

# 57. Architecture Decision: Simplicity First

PBOS is a personal operating system.

Therefore the technical architecture should initially optimize for:

1. correctness
2. clarity
3. reliability
4. maintainability
5. fast iteration
6. low operational complexity

Only after actual requirements appear should additional infrastructure be introduced.

---

# 58. Final Architectural Model

The complete architecture can be understood as:

```text
                         PBOS
                           │
             ┌─────────────┴─────────────┐
             │                           │
          PLANNING                    BEHAVIOR
             │                           │
        Project / Goal                Habit
             │                           │
          Roadmap                Daily Execution
             │                           │
            Node                    Target /
             │                    Reduced /
        Next Action                Minimum
             │                           │
             └─────────────┬─────────────┘
                           ↓
                       EXECUTION
                           │
                        Session
                           │
                 ┌─────────┴─────────┐
                 │                   │
               Timer              Outcome
                 │                   │
                 └─────────┬─────────┘
                           ↓
                       Reflection
                           │
                           ↓
                       Recovery
                           │
                           ↓
                        Adaptation
```

Around this domain:

```text
Presentation
      ↓
Application / Use Cases
      ↓
Domain
      ↓
Persistence
```

with infrastructure kept replaceable.

---

# 59. Architectural Invariants

The following rules are mandatory unless a later architecture decision explicitly changes them.

### ARCH-01

Domain logic must not depend on UI.

### ARCH-02

Domain logic must not depend on a specific database.

### ARCH-03

Session is the common actual-execution concept.

### ARCH-04

Timer is not the owner of Session meaning.

### ARCH-05

Habit does not require Next Action.

### ARCH-06

Project work normally executes through Next Action.

### ARCH-07

Today is primarily a derived execution-oriented view.

### ARCH-08

Mind Map is a planning/navigation representation.

### ARCH-09

Historical execution must not be silently rewritten.

### ARCH-10

Only one focused Session should normally be active.

### ARCH-11

Business rules must not be duplicated across UI components.

### ARCH-12

Persistence must not become the owner of domain decisions.

### ARCH-13

New abstractions must solve an identifiable problem.

### ARCH-14

Technology selection must follow the architecture, not determine it.

### ARCH-15

The initial system should favor a modular monolith unless concrete requirements justify greater distribution.

---

# 60. Step 5 Completion Criteria

Step 5 is complete when the architecture clearly defines:

- responsibility of each layer
- dependency direction
- domain/application/presentation boundaries
- persistence boundary
- Session boundary
- Timer boundary
- Today boundary
- Mind Map boundary
- state ownership
- historical data ownership
- query/command separation
- validation location
- error boundaries
- AI development boundaries
- offline/local considerations
- future synchronization boundary
- technology selection principles

The architecture must remain understandable even before a specific framework is selected.

---

## Step 6 — Next

The next stage should be:

> **Step 6 — Data Architecture & Persistence Model**

Step 6 will convert the domain concepts into a concrete data model.

It will determine, among other things:

```text
What is an Entity?
What is a Record?
What is a Relationship?
What is historical?
What is derived?
What needs an ID?
What needs timestamps?
What can be deleted?
What must be archived?
How are Sessions linked to their sources?
How are Habit Executions linked to Habit configurations?
How are multiple Sessions aggregated?
How are historical configurations preserved?
```

And importantly, **we will not blindly turn every concept from Step 2 into a database table**. We will first test whether each one genuinely needs persistent identity and independent lifecycle.
