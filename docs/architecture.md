# PBOS — Product Architecture

**Document:** `ARCHITECTURE.md`
**Architecture Version:** 1.0
**Current Phase:** Step 1 — Project Foundation & Product Definition
**Status:** Foundation Definition

---

# 1. Project Overview

## 1.1 Product Name

**PBOS — Personal Business Operating System**

PBOS is a personal productivity system designed to help a person consistently take meaningful action in real life.

PBOS is not intended to be a simple:

- To-do list
- Habit tracker
- Calendar
- Timer
- Streak tracker
- Note-taking application
- Motivation application

Instead, PBOS combines these concepts only when they help the user move from:

> **Intention → Decision → Action → Progress → Reflection → Adjustment**

The system should reduce the friction between knowing what matters and actually doing it.

---

# 2. Product Vision

The core vision of PBOS is:

> **Help the user take meaningful action consistently, even when motivation is low, plans are disrupted, cravings appear, or the day does not go as expected.**

PBOS should help the user:

1. Know what matters.
2. Understand where they currently are.
3. Know what to do next.
4. Start the next meaningful action quickly.
5. Preserve context when work is interrupted.
6. Resume work without reconstructing the previous context.
7. Capture distractions, cravings, and new ideas without immediately acting on them.
8. Continue after imperfect days.
9. Reflect on what happened.
10. Adjust future behavior based on real experience.

---

# 3. Core Product Philosophy

PBOS follows these fundamental principles.

## 3.1 Meaningful Action Over Activity

The system must not optimize for the number of tasks completed.

It should optimize for:

> **Meaningful progress.**

A large number of completed low-value tasks should not be considered better than one meaningful action.

---

## 3.2 Decision Cost Reduction

One of PBOS's primary responsibilities is to reduce unnecessary decision-making.

The system should answer:

> **"What should I do now?"**

with as little friction as possible.

The user should not repeatedly reconstruct their entire plan before starting work.

---

## 3.3 Context Preservation

The system must preserve enough context so that the user can understand:

- What they were doing
- Why they were doing it
- Where they stopped
- What the next action is

This becomes especially important after interruptions.

---

## 3.4 Next Action Clarity

PBOS should make the next executable action visible.

The user should not need to ask:

> "What exactly should I work on?"

The system should guide the user from a high-level goal toward a concrete next action.

---

## 3.5 Recovery Over Perfection

PBOS must not assume that real life is perfectly predictable.

The system must expect:

- Late starts
- Missed habits
- Unexpected responsibilities
- Interruptions
- Low-energy periods
- Cravings
- Distractions
- Incomplete sessions
- Imperfect days

Therefore:

> **The system should optimize for returning to meaningful action, not maintaining perfection.**

---

## 3.6 Streaks Are Feedback, Not Identity

A missed day must not make the user feel that the entire system has failed.

Streaks, if used, are secondary feedback.

The system should prioritize:

> **Return → Recovery → Continuation**

over:

> **Perfect streak → Failure → Abandonment**

---

## 3.7 Rest Does Not Require Stimulation

PBOS must not treat every unproductive moment as wasted time.

Rest may involve:

- No screen
- No content consumption
- No productivity activity
- Simply doing nothing

The system should not encourage unnecessary stimulation merely because the user is not currently working.

---

## 3.8 Craving Does Not Equal Command

The appearance of a craving, curiosity, or desire does not automatically mean that the user should act on it.

PBOS should support the behavioral sequence:

> **Craving → Capture → Continue meaningful work → Evaluate later**

The goal is not to eliminate cravings.

The goal is to make it easier to choose meaningful action despite cravings.

---

## 3.9 Novelty Must Not Become the Product

PBOS itself must not become another source of novelty seeking.

The user should not need to:

- Continuously configure the system
- Explore unnecessary features
- Optimize the productivity tool
- Read endless productivity information
- Interact with unnecessary UI

The core principle is:

> **Use the minimum interface necessary to produce the next meaningful action.**

---

# 4. Product Identity

PBOS should be understood as:

> **A navigation system for meaningful personal action.**

It is not primarily a motivation machine.

It should not attempt to constantly motivate, entertain, reward, or stimulate the user.

Instead, it should provide:

> **Context → Decision → Action → Feedback → Adjustment**

---

# 5. Core Behavioral Model

The fundamental PBOS loop is:

```text
Context
   ↓
Decision
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
   ↓
Next Action
```

This loop should remain understandable throughout the application.

---

# 6. Real-Life Adaptation Principle

PBOS must be designed for real life rather than an ideal uninterrupted schedule.

The system must assume that:

> **Interruptions are normal.**

Examples include:

- Family responsibilities
- Guests
- Students/children
- Unexpected errands
- Phone calls
- Social obligations
- Health or energy changes
- Other real-world responsibilities

The product should therefore prioritize:

> **Fast recovery after disruption**

rather than attempting to prevent all disruption.

---

# 7. Imperfect Day Principle

A bad start does not invalidate the entire day.

For example:

If the user planned to start at 8:00 AM but actually starts at 12:00 PM, PBOS should not treat the day as lost.

Instead:

```text
Original Plan
     ↓
Plan no longer realistic
     ↓
Adapt
     ↓
Minimum meaningful action
     ↓
Continue
```

The system should help the user recover from the current reality.

---

# 8. Minimum Floor

PBOS should support a concept called the **Minimum Floor**.

The Minimum Floor represents the smallest meaningful action that keeps the system alive during a difficult day.

Example:

```text
Normal Day
    ↓
Full planned work

Difficult Day
    ↓
Reduced meaningful action

Very Difficult Day
    ↓
Minimum Floor

Never:
    ↓
"Today is lost, so I will abandon everything."
```

The exact Minimum Floor values and implementation will be defined in later architecture sections.

---

# 9. Core Planning Hierarchy

PBOS will use the following high-level hierarchy:

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

This hierarchy is a core architectural concept.

Each level should have a clear responsibility.

The detailed definition of every level will be specified in **Step 2 — Core Concepts & Domain Model**.

---

# 10. Daily Layer

The long-term hierarchy is complemented by a daily execution layer.

The high-level daily flow is:

```text
Daily Target
    ↓
Next Action
    ↓
Session
    ↓
Outcome
    ↓
Reflection
```

If the day is disrupted:

```text
Session
    ↓
Pause
    ↓
Emergency / Responsibility
    ↓
Resume
    ↓
Continue
```

The detailed behavior will be defined later.

---

# 11. Session Philosophy

A session represents actual focused execution.

A session should record reality rather than assume that planned time automatically equals completed work.

For example:

```text
Target Time: 60 minutes
Actual Time: 67 minutes
Status: Completed
Overtime: 7 minutes
```

The system must distinguish between:

- Planned/target duration
- Actual duration
- Completion state

The exact session state model will be defined in later architecture sections.

---

# 12. Overtime Principle

A time target is not necessarily a forced stopping point.

If a user reaches the end of the target duration but is close to completing meaningful work, PBOS should allow continuation.

Example:

```text
Target: 60 min
Actual: 60 min
Work almost complete
       ↓
Continue
       ↓
Actual: 67 min
       ↓
Complete manually
```

The system should record the overtime rather than treating it as an error.

---

# 13. Interruption & Recovery Principle

When a meaningful session is interrupted, PBOS should preserve context.

At minimum, the system should be able to preserve:

1. **Where was I?**
2. **What was I doing?**
3. **What is the next action?**

Conceptually:

```text
Active Session
      ↓
Pause
      ↓
Context Snapshot
      ↓
Interruption / Responsibility
      ↓
Return
      ↓
Resume
      ↓
Continue from previous context
```

The system's responsibility is not to eliminate interruptions.

Its responsibility is:

> **Reduce the friction of returning after interruption.**

---

# 14. Craving / Inbox Principle

PBOS should provide a temporary capture mechanism for:

- New ideas
- Curiosity
- New tools
- Research topics
- Novelty
- Distractions
- Cravings
- Things the user suddenly wants to investigate

The intended behavior is:

```text
New Craving / Idea
       ↓
Capture
       ↓
Return to Current Work
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

The capture mechanism must be fast enough that capturing the item does not itself become another distraction.

---

# 15. Product Success Model

PBOS should not primarily measure success using:

- Number of tasks completed
- Number of clicks
- Time spent inside the application
- Number of features used
- Streak length alone

More meaningful indicators include:

1. Meaningful sessions completed
2. Meaningful roadmap progress
3. Next Action clarity
4. Recovery after interruption
5. Return after imperfect days
6. Cravings captured instead of immediately acted upon
7. Ability to resume previous work
8. Reflection and adjustment
9. Consistent meaningful action over time

The exact analytics model will be defined later.

---

# 16. Primary Product Constraint

The most important product constraint is:

> **PBOS must help the user leave PBOS and do meaningful work.**

The application must never optimize for increasing unnecessary time spent inside the application.

Therefore:

```text
Good UX:
Open PBOS
    ↓
Understand context
    ↓
See next action
    ↓
Start work
    ↓
Leave the interface
    ↓
Do meaningful work
```

Bad UX:

```text
Open PBOS
    ↓
Explore dashboard
    ↓
Check statistics
    ↓
Customize
    ↓
Read productivity insights
    ↓
Configure habits
    ↓
Explore features
    ↓
Never start the actual work
```

---

# 17. Scope Philosophy

PBOS will be built incrementally.

The application must not attempt to implement every possible productivity feature at once.

Every feature must answer:

> **Does this materially improve meaningful action, decision-making, context preservation, progress, or recovery?**

If the answer is no, the feature should not automatically be included.

---

# 18. Architecture Rules

The implementation must follow these rules:

### Rule 1 — Do Not Build Everything at Once

The project will be implemented in controlled phases.

### Rule 2 — Preserve Existing Functionality

When implementing a new phase, existing working functionality must not be unnecessarily broken or rewritten.

### Rule 3 — No Unapproved Architecture Changes

An AI coding agent must not invent a new architecture merely because it appears convenient.

If a required architectural decision has not yet been defined, it must be documented as an unresolved decision rather than silently changing the architecture.

### Rule 4 — Small, Testable Changes

Each implementation phase should produce a working and testable state.

### Rule 5 — Avoid Premature Complexity

Do not introduce unnecessary libraries, abstractions, services, patterns, or infrastructure before they are needed.

### Rule 6 — Behavior Before Decoration

Core behavior and reliability take priority over visual polish.

### Rule 7 — Real User Flow Before Feature Count

A small number of complete workflows is more valuable than many incomplete features.

### Rule 8 — Documentation Is Part of the Architecture

Important architectural decisions must be recorded in this document.

---

# 19. AI Agent Operating Principle

This project will be developed using an AI coding agent inside an IDE.

The AI agent must treat this document as the primary architectural reference.

The agent must:

1. Read the relevant architecture before modifying code.
2. Work only on the currently assigned phase.
3. Avoid implementing future phases prematurely.
4. Preserve existing functionality.
5. Inspect the existing code before modifying it.
6. Reuse existing structures when appropriate.
7. Avoid unnecessary rewrites.
8. Test changes after implementation.
9. Report what was changed.
10. Report what was tested.
11. Report any unresolved issue.
12. Update the architecture documentation when an approved architectural decision changes.

The agent must not:

- Rebuild the entire application unnecessarily.
- Replace working architecture without justification.
- Add unrelated features.
- Change product behavior merely for convenience.
- Create speculative features.
- Optimize for code quantity.

---

# 20. Architecture Development Strategy

PBOS architecture will be defined in the following order:

```text
Step 1
Project Foundation & Product Definition
        ↓
Step 2
Core Concepts & Domain Model
        ↓
Step 3
Functional Requirements
        ↓
Step 4
User Flows & State Machines
        ↓
Step 5
Information Architecture & UI/UX
        ↓
Step 6
Technical Architecture & Data Model
        ↓
Step 7
Implementation Architecture
        ↓
Step 8
MVP Scope & Feature Dependencies
        ↓
Step 9
Development Phases & AI-Agent Protocol
        ↓
Step 10
Testing & Definition of Done
        ↓
Step 11
Architecture Decision Log & Future Expansion
```

No implementation should begin until the architecture has enough definition to support the relevant implementation phase.

---

# 21. Current Architecture Status

At the end of Step 1, the following are considered established product principles:

- PBOS is a meaningful-action navigation system.
- Decision cost reduction is a primary responsibility.
- Next Action clarity is a primary responsibility.
- Context preservation is a primary responsibility.
- Recovery is more important than perfection.
- Streaks are secondary feedback.
- Cravings can be captured without being immediately acted upon.
- Rest does not require stimulation.
- Real life is expected to interrupt planned work.
- Sessions record actual execution.
- Target time does not automatically equal completion.
- Overtime is allowed.
- Interrupted sessions should be resumable with preserved context.
- The product must not become a productivity distraction.
- Development will happen incrementally.
- The architecture will be the source of truth for the AI coding agent.

---

# 22. Next Architecture Step

The next section to define is:

> **Step 2 — Core Concepts & Domain Model**

Step 2 will define the exact meaning, responsibility, properties, relationships, and boundaries of:

```text
Life Domain
Goal
Project
Roadmap
Node
Branch
Dependency
Next Action
Daily Target
Habit
Session
Emergency Session
Interruption
Context Snapshot
Craving / Inbox
Reflection
Minimum Floor
Recovery
Overtime
```

No technical database schema should be finalized before these concepts and their relationships are clearly defined.
