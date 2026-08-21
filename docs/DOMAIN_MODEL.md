# PBOS — Core Concepts & Domain Model

**Document:** `PBOS_DOMAIN_MODEL.md`
**Architecture Version:** 1.0
**Current Phase:** Step 2 — Core Concepts & Domain Model
**Status:** Conceptual Model

---

# 1. Purpose of This Document

This document defines the core concepts of PBOS and the relationships between them.

Its purpose is to establish a clear conceptual model before defining:

- database schema
- API structure
- UI components
- application state
- technical architecture
- implementation details

The definitions in this document are authoritative unless a later approved Architecture Decision explicitly changes them.

---

# 2. Core PBOS Hierarchy

The primary planning and execution hierarchy is:

```text
Life Domain
    ↓
Goal
    ↓
Project
    ↓
Roadmap
    ↓
Node
    ↓
Next Action
    ↓
Session
```

This hierarchy represents the progression from broad life direction to actual execution.

---

# 3. Life Domain

## 3.1 Definition

A **Life Domain** is a broad area of the user's life in which meaningful goals and projects exist.

Examples may include:

- Career
- Social
- Health
- Personal Development
- Finance

The exact default domains are a product decision and should not be hard-coded into the architecture unless explicitly defined.

---

## 3.2 Responsibility

A Life Domain provides high-level context.

It answers:

> **"Which area of life does this belong to?"**

It should not itself represent a task or an executable action.

---

## 3.3 Relationship

A Life Domain can contain multiple Goals.

```text
Life Domain
    ├── Goal
    ├── Goal
    └── Goal
```

---

# 4. Goal

## 4.1 Definition

A **Goal** represents a meaningful direction or desired outcome within a Life Domain.

A Goal is broader than a Project.

Example:

```text
Life Domain: Career
        ↓
Goal: Become a capable Software/Product Builder
```

---

## 4.2 Responsibility

A Goal provides strategic direction.

It answers:

> **"What meaningful outcome or direction am I trying to achieve in this area of life?"**

A Goal should not be treated as a single executable task.

---

## 4.3 Relationship

A Goal can contain multiple Projects.

```text
Goal
    ├── Project
    ├── Project
    └── Project
```

---

# 5. Project

## 5.1 Definition

A **Project** is a meaningful body of work that contributes to a Goal and can be advanced through a sequence of outcomes or execution steps.

Example:

```text
Goal
  ↓
Software/Product Builder
  ↓
Project
  ↓
PBOS
```

A Project is more concrete than a Goal but broader than a single Next Action.

---

## 5.2 Responsibility

A Project provides the execution context for meaningful work.

It answers:

> **"What substantial thing am I building, completing, or advancing?"**

---

## 5.3 Relationship

A Project belongs to a Goal and contains or uses a Roadmap.

```text
Goal
  ↓
Project
  ↓
Roadmap
```

A Goal can contain multiple Projects.

---

# 6. Roadmap

## 6.1 Definition

A **Roadmap** represents the structure of progress through a Project.

It describes:

- major steps
- dependencies
- branches
- possible paths
- completed areas
- current areas
- upcoming areas

The Roadmap may be visualized as a graph or diagram.

---

## 6.2 Responsibility

The Roadmap exists primarily to:

1. Preserve context.
2. Make progress visible.
3. Represent dependencies.
4. Represent branches.
5. Help determine the next meaningful action.

The Roadmap is not simply a checklist.

---

## 6.3 Non-Rigid Principle

A Roadmap must be able to change as real execution produces new information.

Example:

```text
Node A
   ↓
Node B
   ↓
Problem discovered
   ↓
Branch
 ┌─┴────────┐
 ↓          ↓
Node C      Node D
```

Real execution may create:

- new nodes
- new branches
- changed dependencies
- alternative paths

Therefore, the Roadmap must not assume that the original plan will always remain correct.

---

# 7. Node

## 7.1 Definition

A **Node** is a meaningful unit of progress within a Roadmap.

It represents a specific outcome, milestone, problem, capability, or meaningful stage that can move the Project forward.

A Node is larger than a single trivial task but smaller than the entire Project.

---

## 7.2 Responsibility

A Node provides meaningful execution context.

It answers:

> **"What meaningful part of the Project am I currently trying to move forward?"**

---

## 7.3 Node Characteristics

A Node may:

- have dependencies
- depend on another Node
- have child/connected Nodes
- be completed
- be active
- lead to a branch
- produce a new branch when execution reveals a problem
- contain or generate Next Actions

The exact Node state model will be defined later.

---

# 8. Branch

## 8.1 Definition

A **Branch** represents an alternative path that emerges from a Roadmap when multiple possible directions exist.

A branch may emerge because:

- a problem was discovered
- a new requirement appeared
- the original approach is no longer appropriate
- multiple solutions are possible
- execution reveals new information

---

## 8.2 Responsibility

Branches allow the Roadmap to represent real-world uncertainty.

The system must not force every Project into a single linear path.

---

## 8.3 Conceptual Model

```text
Current Node
     ↓
Decision / Discovery
     ↓
 ┌───┴────┐
 ↓        ↓
Path A   Path B
```

The exact branch-selection behavior will be defined in the User Flow and State Machine documentation.

---

# 9. Dependency

## 9.1 Definition

A **Dependency** represents a relationship in which one Node cannot meaningfully proceed until another Node or prerequisite is satisfied.

Example:

```text
Node A
  ↓
Node B
```

Node B depends on Node A.

---

## 9.2 Responsibility

Dependencies provide the Roadmap with execution order and context.

They help answer:

> **"What needs to happen before this can meaningfully proceed?"**

---

# 10. Next Action

## 10.1 Definition

A **Next Action** is the context-aware executable unit of progress that the user can actually perform next.

It is not merely a generic to-do item.

A Next Action should:

- know its relevant context
- contribute to a desired outcome
- be connected to the relevant Roadmap/Node
- be executable
- be meaningful
- be small enough to execute within a practical work session
- create visible progress when completed

---

## 10.2 Core Definition

> **Next Action = Context-aware executable unit of progress.**

---

## 10.3 What a Next Action Is Not

A Next Action should not normally be:

- an entire Project
- an entire Goal
- a vague intention
- a meaningless micro-task
- a generic reminder
- an unrelated activity
- a task created only to make the task list look productive

Examples of vague actions:

```text
"Work on coding"
"Study"
"Research"
"Improve project"
```

These do not provide enough execution clarity.

A better Next Action should communicate what meaningful action can actually be started.

---

# 11. Next Action and Roadmap Context

A Next Action must retain enough context to understand:

```text
Goal
  ↓
Project
  ↓
Roadmap
  ↓
Node
  ↓
Next Action
```

This allows the user to understand not only:

> "What am I doing?"

but also:

> "Why am I doing it?"

---

# 12. Next Decision

## 12.1 Definition

A **Next Decision** is the process of selecting the most appropriate Next Action from the current Roadmap and context.

This is especially important for complex work such as Career projects.

The user may not always be able to determine the next action far in advance because real execution can reveal:

- bugs
- problems
- dependencies
- new information
- alternative approaches

Therefore:

> **The Roadmap provides context; the Next Decision determines what should be executed next.**

---

## 12.2 Previous-Night Planning

For planned Career work, the user may select the next day's Career Next Action in advance.

Conceptually:

```text
Previous Night
      ↓
Review Roadmap
      ↓
Select Next Action
      ↓
Next Day
      ↓
Start Session
```

The purpose is to reduce morning decision cost.

---

# 13. Daily Target

## 13.1 Definition

A **Daily Target** represents the meaningful result or commitment the user intends to pursue during a particular day.

It is a daily execution layer rather than a replacement for the long-term hierarchy.

---

## 13.2 Relationship

The Daily Target can connect daily execution to the relevant Goal, Project, Roadmap, Node, or Next Action.

Conceptually:

```text
Long-Term Structure
        ↓
Next Action
        ↓
Daily Target
        ↓
Session
```

The exact data relationship will be finalized during technical architecture.

---

## 13.3 Purpose

Daily Targets exist to answer:

> **"What meaningful progress matters today?"**

They should not become an exhaustive list of everything the user could possibly do.

---

# 14. Habit

## 14.1 Definition

A **Habit** represents a recurring behavior that the user intends to perform consistently.

Examples from the current PBOS concept include:

- Exercise
- Meditation
- Journaling
- Nutrition-related targets
- Social interaction practice

---

## 14.2 Habit vs Project Work

Habits and Project work are different concepts.

### Project work

```text
Goal
 ↓
Project
 ↓
Roadmap
 ↓
Node
 ↓
Next Action
```

### Habit

```text
Recurring behavior
      ↓
Repeated execution
      ↓
Consistency / reflection
```

A Habit should not be forced into the Project hierarchy simply because it is tracked by the same application.

---

## 14.3 Habit as a Cross-Domain Influence System

A Habit is a recurring behavior that exists independently from the Project hierarchy.

Habits:

- are not children of Projects
- are not required to belong to a Goal
- may influence multiple Life Domains
- may support multiple Goals
- may have many-to-many relationships with Domains and Goals
- do not create structural dependencies
- represent soft influence rather than required causality

The system may track observed relationships and impact signals, but must not claim that a Habit caused a particular outcome unless sufficient evidence exists.

---

## Execution Layer

PBOS separates meaningful context from actual execution.

Context defines what the activity means.

Execution records what the user actually did.

The execution layer is shared across different types of work.

### Project Execution

Project
↓
Roadmap Node
↓
Next Action
↓
Session

### Habit Execution

Habit
↓
Daily Habit Execution
↓
Session

Therefore, a Session is not inherently a Project Session or Habit Session.

A Session is an actual execution record associated with an executable source.

This separation allows PBOS to preserve both:

- meaningful context
- actual execution history

## 14.4 Habit and Daily Execution

A Habit definition is not itself a daily Session.

Instead, each scheduled occurrence of a Habit creates or exposes a Daily Habit Execution.

Conceptually:

Habit
↓
Today's Habit Execution
↓
Session

The Habit defines the recurring behavior.

The Daily Habit Execution represents today's occurrence.

The Session records the user's actual execution.

---

## 14.5 Habit Execution Intensity

A Habit may define multiple execution levels.

Example:

- Ideal / Target
- Reduced
- Minimum Floor

Example:

Exercise:

- Target: 40–50 minutes
- Reduced: 20 minutes
- Minimum: 5 minutes

These levels are not separate Habits.

They are different acceptable execution levels of the same Habit.

The system must not automatically treat the Minimum Floor as the normal daily target.

The user should normally aim for the Target level while retaining Reduced and Minimum levels as adaptive fallback options.

---

## 14.6 Habit Execution Is Adaptive

The actual execution level for a given day may differ from the Habit's normal Target.

For example:

Normal day:
Target → 45 minutes

Difficult day:
Reduced → 20 minutes

Very difficult day:
Minimum → 5 minutes

This does not change the underlying Habit definition.

It changes only the execution level for that day's Habit Execution.

---

## 14.7 Habit and Session

A Habit does not require a Next Action.

When the user performs a Habit, its Daily Habit Execution may start a Session directly.

Therefore:

Project work:

Project
→ Roadmap Node
→ Next Action
→ Session

Habit:

Habit
→ Daily Habit Execution
→ Session

Session is the common actual-execution layer.

---

## 14.8 Habit Completion

Habit completion must record the actual execution rather than simply storing a boolean "done".

Where appropriate, the system should preserve:

- selected execution level
- actual duration or quantity
- completion status
- Session reference
- date/time
- relevant reflection or outcome

This allows the system to distinguish:

Target completed
Reduced completed
Minimum completed
Partially completed
Skipped
Missed

---

## 14.9 Habit Does Not Become a Project Task

A Habit occurrence must not automatically become a Project Next Action merely because it is scheduled for today.

Habit execution and Project execution remain separate concepts.

They may share the same Session infrastructure.

---

## 14.10 Habit Relationships Are Non-Blocking

A Habit may support a Goal or influence a Life Domain, but failure to perform the Habit must not automatically block the Goal or Project.

Example:

Exercise may support:

- Health
- Confidence
- Energy

But missing Exercise must not automatically make a Career Project "blocked".

---

## 14.11 Habit Impact Tracking

PBOS may track associations between Habit activity and outcomes over time.

However, the system must distinguish:

Observed association

from:

Proven causation.

Example:

"Exercise increased on weeks when energy ratings were higher"

is acceptable.

"Exercise caused higher productivity"

must not be asserted without sufficient evidence.

---

## 14.12 Summary

Habits are recurring behaviors.

They:

- are independent from Project hierarchy
- can influence multiple Life Domains
- can support multiple Goals
- have many-to-many, non-blocking relationships
- influence softly rather than structurally
- may have different execution levels
- generate Daily Habit Executions
- may start Sessions directly
- do not require Next Actions
- should track actual execution without over-claiming causality

---

# 15. Session

## 15.1 Definition

A **Session** represents an actual period of focused execution associated with a Next Action or other meaningful activity.

A Session is where intention becomes actual execution.

---

## 15.2 Session Model

A Session may contain:

- target duration
- actual duration
- start
- pause
- resume
- completion state
- interruption information
- context snapshot
- overtime

The exact data fields will be defined later.

---

# 16. Target Time vs Actual Time

A Session distinguishes between:

```text
Target Time
Actual Time
```

Example:

```text
Target Time: 60 minutes
Actual Time: 67 minutes
```

The target represents the intended commitment.

The actual time represents reality.

Therefore:

> **Target Time does not automatically determine Session completion.**

---

# 17. Overtime

## 17.1 Definition

**Overtime** is the additional execution time after the Session reaches its target duration.

Example:

```text
Target: 60 minutes
Actual: 67 minutes
Overtime: 7 minutes
```

---

## 17.2 Principle

If meaningful work is nearly complete, the user may continue beyond the target.

The system should record the additional time rather than automatically stopping the Session.

---

# 18. Session Completion

Session completion must represent the user's actual assessment of the work.

The system must not assume:

```text
Timer reached target
        =
Session completed
```

Instead:

```text
Timer reached target
        ↓
User continues or stops
        ↓
User determines actual completion state
```

Possible states may include:

- Completed
- Partial
- Interrupted
- Abandoned
- Rescheduled

The final state machine will be defined in a later document.

---

# 19. Interruption

## 19.1 Definition

An **Interruption** occurs when the user must temporarily stop a Session because of something outside the intended work flow.

Examples include:

- family responsibility
- guest
- urgent errand
- unexpected responsibility
- another real-world obligation

---

## 19.2 Principle

PBOS does not assume that interruptions can be eliminated.

Instead:

> **The system should minimize the friction of returning after interruption.**

---

# 20. Context Snapshot

## 20.1 Definition

A **Context Snapshot** stores the minimum useful information required to resume interrupted work.

At minimum:

1. **Where was I?**
2. **What was I doing?**
3. **What is the next action?**

Conceptually:

```text
Session
   ↓
Pause
   ↓
Context Snapshot
   ↓
Interruption
   ↓
Return
   ↓
Resume
```

---

## 20.2 Purpose

The purpose is to prevent the user from spending unnecessary mental effort reconstructing previous context.

The system should be able to communicate:

> **You were here → You were doing this → Continue with this next action.**

---

# 21. Emergency / Responsibility Session

## 21.1 Definition

An **Emergency / Responsibility Session** represents time spent handling an unexpected responsibility that interrupts planned work.

Conceptually:

```text
Current Session
      ↓
Pause
      ↓
Emergency / Responsibility Session
      ↓
Complete
      ↓
Resume Previous Session
```

The exact distinction between an emergency and an ordinary interruption will be determined during the state-machine design.

---

# 22. Recovery

## 22.1 Definition

**Recovery** is the process of returning to meaningful action after disruption, failure, interruption, or an imperfect day.

Recovery is a first-class PBOS concept.

---

## 22.2 Recovery Principle

The system should optimize:

> **Return → Recovery → Continuation**

rather than:

> **Perfect execution → Failure → Abandonment**

---

## 22.3 Recovery Examples

Recovery may occur after:

- waking late
- missing a habit
- abandoning a session
- unexpected interruption
- distraction
- craving
- losing the planned sequence

The exact recovery workflows will be defined later.

---

# 23. Minimum Floor

## 23.1 Definition

The **Minimum Floor** is the smallest meaningful action that can keep the user's system alive during a difficult day.

It exists to prevent:

> "The day is already ruined, so I will do nothing."

---

## 23.2 Principle

```text
Normal Day
    ↓
Normal execution

Difficult Day
    ↓
Reduced execution

Very Difficult Day
    ↓
Minimum Floor

Never:
    ↓
Abandon the system
```

The exact Minimum Floor rules will be determined in the functional requirements and UX stages.

---

# 24. Craving / Inbox

## 24.1 Definition

The **Craving / Inbox** is a temporary capture area for ideas, curiosity, novelty, distractions, or other impulses that arise while the user is doing meaningful work.

Examples:

- New AI tool
- New coding tool
- Research topic
- New productivity idea
- Interesting video
- New possibility
- Sudden desire to investigate something

---

## 24.2 Core Flow

```text
Craving / New Idea
        ↓
Capture
        ↓
Continue Current Work
        ↓
Evaluate Later
        ↓
Meaningful?
     ↙       ↘
   Yes        No
    ↓          ↓
Add to        Ignore /
appropriate   discard
structure
```

---

## 24.3 Core Principle

> **Feeling urgency does not necessarily mean actual urgency.**

And:

> **A craving is not a command.**

The system does not need to eliminate cravings.

It needs to make it easier to capture them and return to meaningful work.

---

# 25. Reflection

## 25.1 Definition

Reflection is the feedback mechanism through which the user examines what happened and decides how to adjust.

The current proposed reflection model contains three questions:

1. What happened today?
2. What did I learn / where did I get stuck?
3. What can I change tomorrow to become 1% better?

Conceptually:

```text
Observation
     ↓
Learning
     ↓
Adjustment
```

---

## 25.2 Purpose

Reflection should create a feedback loop.

It should not exist merely to make a successful day look successful.

A difficult day should still be reflectable.

---

# 26. Streak

## 26.1 Definition

A **Streak** represents a consistency indicator associated with recurring behavior.

It is not the primary definition of success.

---

## 26.2 Principle

> **Streak is feedback, not identity.**

A broken streak should not imply:

> "The entire system has failed."

PBOS should prioritize return and recovery.

---

# 27. Relationship Overview

The conceptual structure can currently be represented as:

```text
LIFE
│
├── Life Domain
│      │
│      └── Goal
│             │
│             └── Project
│                    │
│                    └── Roadmap
│                           │
│                           ├── Node
│                           │    │
│                           │    └── Next Action
│                           │             │
│                           │             └── Session
│                           │
│                           ├── Branch
│                           └── Dependency
│
├── Daily Target
│
├── Habit
│
├── Craving / Inbox
│
└── Reflection
```

Session-related execution concepts:

```text
Session
   │
   ├── Target Time
   ├── Actual Time
   ├── Overtime
   ├── Pause
   ├── Interruption
   ├── Context Snapshot
   ├── Emergency / Responsibility Session
   ├── Resume
   └── Completion
```

Recovery concepts:

```text
Disruption
   ↓
Recovery
   ↓
Minimum Floor
   ↓
Meaningful Action
   ↓
Continuation
```

---

# 28. Important Boundaries

The following boundaries must remain clear during implementation.

## Goal vs Project

**Goal** = meaningful direction/outcome.

**Project** = concrete body of work contributing to that Goal.

---

## Project vs Roadmap

**Project** = what substantial thing is being advanced.

**Roadmap** = how meaningful progress through that Project is structured.

---

## Roadmap vs Node

**Roadmap** = overall structure/path.

**Node** = meaningful unit within that structure.

---

## Node vs Next Action

**Node** = meaningful outcome/stage/problem/capability.

**Next Action** = executable action that moves the Node forward.

---

## Next Action vs Session

**Next Action** = what should be done.

**Session** = actual period during which the user does it.

---

## Habit vs Next Action

**Habit** = recurring behavior.

**Next Action** = context-specific executable progress.

---

## Interruption vs Recovery

**Interruption** = the event that stops or disrupts execution.

**Recovery** = the process of returning to meaningful action afterward.

---

## Craving vs Next Action

**Craving** = something that demands attention but has not yet been evaluated as meaningful.

**Next Action** = an evaluated, contextually meaningful executable action.

---

# 29. Core Model Principle

PBOS should always preserve the distinction between:

```text
Why
 ↓
What meaningful outcome
 ↓
Where in the roadmap
 ↓
What to do next
 ↓
Actual execution
 ↓
What happened
 ↓
What to change
```

This creates the following conceptual chain:

```text
Goal
 ↓
Project
 ↓
Roadmap
 ↓
Node
 ↓
Next Action
 ↓
Session
 ↓
Outcome
 ↓
Reflection
 ↓
Adjustment
```

---

# 30. What This Document Does Not Define Yet

This document intentionally does not finalize:

- database tables
- database columns
- API endpoints
- frontend components
- backend services
- exact screen layouts
- colors
- typography
- navigation implementation
- authentication architecture
- framework-specific implementation
- exact state machine values
- analytics implementation

Those decisions belong to later architecture documents.

---

# 31. Domain Model Status

The following concepts are now part of the PBOS conceptual model:

- Life Domain
- Goal
- Project
- Roadmap
- Node
- Branch
- Dependency
- Next Action
- Next Decision
- Daily Target
- Habit
- Session
- Overtime
- Interruption
- Context Snapshot
- Emergency / Responsibility Session
- Recovery
- Minimum Floor
- Craving / Inbox
- Reflection
- Streak

These definitions must be used consistently throughout the remaining architecture documents.

---

# 32. Next Step

The next architecture document is:

> **Step 3 — Functional Requirements**

Step 3 will convert the conceptual model into explicit software behavior.

It will define:

- what the user can create
- what the user can edit
- what the system displays
- what happens when an action starts
- what happens when a session pauses
- what happens during interruption
- what happens when a session resumes
- how overtime works
- how recovery works
- how Craving / Inbox works
- how Daily Targets work
- how Roadmap and Nodes interact
- how completion works
- what the system must and must not do

No implementation-specific code should be defined until those behaviors are sufficiently clear.
