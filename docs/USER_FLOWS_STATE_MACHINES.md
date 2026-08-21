# PBOS — User Flows & State Machines

**Document:** `PBOS_USER_FLOWS_STATE_MACHINES.md`
**Architecture Version:** 1.0
**Current Phase:** Step 4 — User Flows & State Machines
**Status:** Initial Specification

---

# 1. Purpose

This document defines how users move through PBOS and how important objects change state.

It answers:

- What happens when the user starts something?
- What can happen next?
- What is allowed?
- What is not allowed?
- What happens when work is interrupted?
- What happens when a Session ends?
- How do Habits enter daily execution?
- How does recovery work?
- How does the system maintain consistency?

This document does not define UI styling or implementation technology.

---

# 2. Core Execution Architecture

PBOS separates **context** from **execution**.

## 2.1 Project Work

```text
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
Actual Execution
```

## 2.2 Habit Work

```text
Habit
   ↓
Daily Habit Execution
   ↓
Execution Level
   ↓
Session
   ↓
Actual Execution
```

## 2.3 Common Execution Layer

Both forms of work eventually enter the same execution system:

```text
Project Next Action ──────┐
                          ↓
                       SESSION
                          ↑
Habit Execution ──────────┘
```

A Session represents **what actually happened during a period of execution**.

---

# 3. Core State Principles

## 3.1 Planning State and Execution State Are Different

A work item may exist without currently being executed.

Example:

```text
Next Action
    ↓
Available
```

does not mean:

```text
Session
    ↓
Running
```

---

## 3.2 Session State Does Not Automatically Determine Work Completion

A Session ending means:

> The execution period ended.

It does not necessarily mean:

> The intended work is complete.

Example:

```text
Next Action
"Build authentication"

Session
45 minutes
↓
Finished

Next Action
↓
Still incomplete
```

---

## 3.3 Timer State Does Not Determine Meaning

A timer measures execution.

It must not decide:

- whether work was successful
- whether a Habit was completed
- whether a Next Action was completed
- whether a Project is complete

Those are semantic decisions.

---

# 4. Next Action State Machine

## 4.1 States

A Next Action supports:

```text
Available
Active
Blocked
Deferred
Completed
Cancelled
```

---

## 4.2 Main Flow

```text
Available
    ↓
Start
    ↓
Active
    ↓
Complete
    ↓
Completed
```

---

## 4.3 Multiple Sessions

A Next Action may remain Active across multiple Sessions.

```text
Available
    ↓
Active
    ↓
Session 1
    ↓
Session ends
    ↓
Active
    ↓
Session 2
    ↓
Session ends
    ↓
Active
    ↓
Session 3
    ↓
Complete
    ↓
Completed
```

The Session ending does not automatically change the Next Action to Completed.

---

## 4.4 Blocking

```text
Active
   ↓
Blocker discovered
   ↓
Blocked
```

A blocked Next Action may later become:

```text
Blocked
   ↓
Blocker resolved
   ↓
Available / Active
```

depending on whether the user immediately resumes it.

---

## 4.5 Deferral

```text
Available
   ↓
Defer
   ↓
Deferred
```

A deferred Next Action can later return to:

```text
Available
```

---

## 4.6 Cancellation

A Next Action may be cancelled when the intended work is no longer relevant.

```text
Available / Active / Blocked / Deferred
                ↓
             Cancel
                ↓
           Cancelled
```

Cancellation must preserve historical information.

---

# 5. Session State Machine

## 5.1 States

```text
Ready
Running
Paused
Interrupted
Completed
Abandoned
```

`Ready` means the Session is prepared to start but has not started execution.

---

## 5.2 Standard Flow

```text
Ready
  ↓
Start
  ↓
Running
  ↓
Complete
  ↓
Completed
```

---

## 5.3 Pause

```text
Running
   ↓
Pause
   ↓
Paused
   ↓
Resume
   ↓
Running
```

Pausing preserves accumulated execution time and context.

---

## 5.4 Interruption

An interruption is different from a normal pause.

```text
Running
   ↓
Interrupted
   ↓
Context Snapshot
   ↓
Responsibility / interruption
   ↓
Resume
   ↓
Running
```

The system must preserve enough context for the user to understand where they stopped.

---

## 5.5 Abandonment

```text
Running
   ↓
Abandon
   ↓
Abandoned
```

An abandoned Session remains in history.

Its actual execution time must not be erased.

---

# 6. Session Completion Flow

When the user chooses to finish a Session:

```text
Running
   ↓
Finish
   ↓
Session Completed
   ↓
Ask / capture outcome
   ↓
Update related execution record
   ↓
Determine next state
```

The system then evaluates the source.

### Project Next Action

```text
Session Completed
       ↓
Is Next Action complete?
       ├── Yes → Next Action Completed
       └── No  → Next Action remains Active
```

### Habit Execution

```text
Session Completed
       ↓
Does actual execution satisfy selected Habit completion rule?
       ├── Yes → Habit Execution Completed
       └── No  → Habit Execution remains Partial / Incomplete
```

---

# 7. Habit State Model

The permanent Habit and today's Habit Execution must be treated as different concepts.

---

## 7.1 Habit Definition States

A Habit may be:

```text
Active
Paused
Archived
```

### Flow

```text
Active
  ↓
Pause
  ↓
Paused
  ↓
Resume
  ↓
Active
```

or:

```text
Active
  ↓
Archive
  ↓
Archived
```

Historical executions must remain available after archiving.

---

# 8. Daily Habit Execution

A scheduled Habit creates an occurrence for that day.

Conceptually:

```text
Habit
   ↓
Scheduled Today
   ↓
Daily Habit Execution
```

---

## 8.1 Daily Habit Execution States

```text
Scheduled
Ready
In Progress
Partial
Completed
Skipped
Missed
```

---

## 8.2 Daily Habit Flow

```text
Scheduled
    ↓
Ready
    ↓
Start
    ↓
In Progress
    ↓
Session
    ↓
Session Completed
    ↓
Evaluate Actual Execution
```

Possible outcomes:

```text
Target satisfied
      ↓
Completed
```

or:

```text
Reduced level satisfied
      ↓
Completed
```

or:

```text
Minimum level satisfied
      ↓
Completed
```

or:

```text
Insufficient execution
      ↓
Partial
```

The exact completion thresholds are defined by the Habit's configuration.

---

# 9. Habit Target / Reduced / Minimum Flow

A Habit may define:

```text
Target
Reduced
Minimum
```

These are **execution levels**, not separate tasks.

Example:

```text
Exercise

Target   = 45 min
Reduced  = 20 min
Minimum  = 5 min
```

---

## 9.1 Normal Execution

```text
Habit
  ↓
Today's Execution
  ↓
Target
  ↓
Session
  ↓
45 min
  ↓
Completed
```

---

## 9.2 Difficult-Day Execution

```text
Habit
  ↓
Today's Execution
  ↓
Reduced
  ↓
Session
  ↓
20 min
  ↓
Completed
```

---

## 9.3 Minimum-Day Execution

```text
Habit
  ↓
Today's Execution
  ↓
Minimum
  ↓
Session
  ↓
5 min
  ↓
Completed
```

The system must preserve which execution level was selected.

---

# 10. Important Habit Rule

PBOS must **not** automatically convert:

```text
Target = 45 min
```

into:

```text
Today's required task = 45 min
```

without considering the Habit's adaptive execution model.

The Target represents the user's normal desired level.

Reduced and Minimum levels exist to preserve continuity when circumstances make the Target unrealistic.

---

# 11. Habit Execution and Multiple Sessions

A Daily Habit Execution may require more than one Session.

Example:

```text
Exercise
Target = 45 min

Session 1 = 25 min
Session 2 = 20 min
Total = 45 min
```

The system may aggregate relevant Sessions when determining actual execution.

Therefore:

```text
Daily Habit Execution
       │
       ├── Session 1
       └── Session 2
```

is valid.

---

# 12. One Active Session Rule

PBOS should normally permit only **one active focused Session at a time**.

This is a product rule intended to reduce context switching and maintain execution clarity.

The system may preserve multiple:

- completed Sessions
- abandoned Sessions
- paused Sessions

historically.

However, the primary execution experience should not encourage simultaneous active Sessions.

---

# 13. Starting a Project Session

The intended user flow is:

```text
Today
  ↓
Project work
  ↓
Current Next Action
  ↓
Start
  ↓
Session Ready
  ↓
Start Session
  ↓
Running
```

The user should not have to manually configure the Session.

Relevant context should be inherited automatically.

---

# 14. Starting a Habit Session

The intended flow is:

```text
Today
  ↓
Habit
  ↓
Today's Habit Execution
  ↓
Choose / confirm execution level
  ↓
Start
  ↓
Session Ready
  ↓
Start Session
  ↓
Running
```

The user should not need to create a Next Action.

---

# 15. Today Screen Execution Model

The Today screen should combine different sources into one execution-oriented view.

Example:

```text
TODAY

PROJECT WORK
────────────────────
Implement authentication
[Start]

HABITS
────────────────────
Exercise
Target: 45 min
[Start]

Meditation
Target: 10 min
[Start]

PERSONAL
────────────────────
Daily reflection
[Start]
```

The UI does not need to expose the underlying architecture.

The user should primarily see:

> **What can I meaningfully do now?**

---

# 16. Next Decision Flow

When the user does not know what to do next:

```text
No clear current action
        ↓
Next Decision
        ↓
Evaluate current context
        ↓
Possible candidates
        ↓
User chooses
        ↓
Executable item
        ↓
Start
```

PBOS should not automatically choose a high-impact action without user confirmation.

---

# 17. Project Roadmap Flow

The Roadmap is a planning/navigation structure.

A simplified Project flow:

```text
Project
   ↓
Roadmap
   ↓
Current Node
   ↓
Available Node
   ↓
Create / select Next Action
   ↓
Next Action Available
```

The Roadmap itself is not the execution timer.

---

# 18. Node State Machine

A Node may support:

```text
Planned
Active
Blocked
Completed
Archived
```

---

## 18.1 Standard Flow

```text
Planned
   ↓
Active
   ↓
Completed
```

---

## 18.2 Blocked

```text
Active
   ↓
Blocked
   ↓
Active
```

---

## 18.3 Node Completion

A Node should not be marked completed merely because one Session ended.

Node completion is a semantic decision based on its intended outcome and relevant work.

---

# 19. Project State Machine

A Project may support:

```text
Planned
Active
Paused
Completed
Archived
```

---

## 19.1 Standard Flow

```text
Planned
   ↓
Active
   ↓
Completed
```

---

## 19.2 Pause

```text
Active
   ↓
Paused
   ↓
Active
```

Pausing a Project does not delete its history.

---

# 20. Daily Target State Machine

A Daily Target represents meaningful intent for a day.

Possible states:

```text
Planned
Active
Completed
Partially Completed
Adjusted
Deferred
Cancelled
```

---

## 20.1 Important Rule

A Daily Target is not necessarily a Next Action.

A Daily Target can reference one or more meaningful execution items.

For example:

```text
Daily Target:
"Make meaningful progress on PBOS"

        ↓

Project Next Action
        ↓
Session
```

or:

```text
Daily Target:
"Maintain physical training"

        ↓

Habit Execution
        ↓
Session
```

---

# 21. Daily Target Adaptation

If circumstances change:

```text
Planned
   ↓
Reality changes
   ↓
Adjusted
```

The system must preserve the fact that the plan changed.

Adjustment is not equivalent to failure.

---

# 22. Recovery State Machine

Recovery exists to restore meaningful action after disruption.

Possible states:

```text
Not Needed
Triggered
Reviewing
Action Selected
Executing
Recovered
Dismissed
```

---

## 22.1 Recovery Flow

```text
Disruption
    ↓
Recovery Triggered
    ↓
Review Context
    ↓
Identify smallest meaningful next step
    ↓
Action Selected
    ↓
Execute
    ↓
Recovered
```

---

# 23. Recovery Triggers

Recovery may be triggered by:

- interrupted Session
- abandoned Session
- missed Daily Target
- incomplete planned work
- blocked Next Action
- prolonged inactivity
- unexpected responsibility
- unrealistic original plan

Recovery should not necessarily trigger immediately after every minor deviation.

---

# 24. Interruption Flow

Interruption is a normal real-world event.

```text
Session Running
      ↓
Interruption
      ↓
Pause / Interrupt
      ↓
Context Snapshot
      ↓
Handle Responsibility
      ↓
Return
      ↓
Resume
```

---

# 25. Context Snapshot

When an interruption occurs, PBOS should preserve the minimum context necessary for continuation.

The snapshot should make it possible to answer:

```text
Where was I?

What was I doing?

What had I already done?

What was I about to do?

What should I do next?
```

The snapshot should not become a burdensome reflection form.

---

# 26. Emergency / Responsibility Session

An unexpected responsibility may require temporary attention.

Conceptually:

```text
Original Session
      ↓
Interrupted
      ↓
Responsibility Session
      ↓
Responsibility Complete
      ↓
Original Session Resume
```

The responsibility must not be incorrectly counted as focused execution for the original work.

---

# 27. Craving / Inbox Flow

Quick capture:

```text
Current Activity
      ↓
Capture
      ↓
Save to Inbox
      ↓
Return to Current Activity
```

The capture must not automatically become:

- a Project
- a Next Action
- a Habit

Classification happens later.

---

# 28. Inbox Processing Flow

```text
Inbox Item
    ↓
Review
    ↓
Classify
```

Possible outcomes:

```text
Project-related
Next Action
Habit
Reference
Future Idea
Discard
```

The system should preserve the original captured information when converting it.

---

# 29. Reflection Flow

Reflection is an end-of-execution or end-of-day process.

```text
Execution / Day
      ↓
Reflection
      ↓
What happened?
      ↓
What was learned?
      ↓
Where was the friction?
      ↓
What should change?
```

Reflection should not automatically change Plans, Goals, Projects, or Habits without user involvement.

---

# 30. Cross-State Integrity Rules

The following rules apply across the entire system.

## Rule 1 — Session completion ≠ work completion

```text
Session Completed
```

does not automatically mean:

```text
Next Action Completed
```

or:

```text
Habit Completed
```

---

## Rule 2 — Timer expiration ≠ completion

A timer reaching zero must never automatically mark meaningful work as completed.

---

## Rule 3 — Habit failure ≠ Goal failure

```text
Habit Missed
```

must not automatically produce:

```text
Goal Failed
```

---

## Rule 4 — Session interruption ≠ Session deletion

Interrupted work remains historically valid.

---

## Rule 5 — Plan adjustment ≠ failure

A changed plan is not inherently a failed plan.

---

## Rule 6 — Archived ≠ Deleted

Archiving preserves historical information.

---

## Rule 7 — Context must survive execution

Starting and finishing a Session must not disconnect the execution record from its meaningful context.

---

## Rule 8 — No orphaned execution

Every Session must have an identifiable execution context.

---

# 31. State Transition Validation

The system must reject invalid transitions.

Examples:

```text
Completed → Running
```

is invalid unless an explicit reopening mechanism exists.

```text
Archived Habit → Start Today's Habit Execution
```

should not be allowed unless the Habit is restored/reactivated.

```text
Cancelled Next Action → Start
```

should not be allowed unless the user explicitly reactivates it.

---

# 32. Real-World Edge Cases

## Case 1 — User starts Exercise and stops after 12 minutes

Record:

```text
Actual = 12 min
```

Do not erase the Session.

The Habit Execution may become Partial depending on its rules.

---

## Case 2 — User planned 45 minutes but does 20

Record:

```text
Target = 45
Actual = 20
```

If 20 corresponds to the Reduced level:

```text
Execution Level = Reduced
```

The system should not treat the user as having completed the normal Target.

---

## Case 3 — User does 45 minutes but takes multiple Sessions

```text
Session 1 = 25
Session 2 = 20

Total = 45
```

The Daily Habit Execution can aggregate them.

---

## Case 4 — Project Next Action takes three days

The same Next Action may remain active across multiple Sessions/days.

---

## Case 5 — User finishes a Session but the Next Action is incomplete

The Next Action remains Active.

The user can start another Session later.

---

## Case 6 — User discovers the Next Action is wrong

The Session history remains intact.

The user may:

```text
Finish Session
↓
Adjust Next Action
```

rather than rewriting history.

---

## Case 7 — Habit target changes tomorrow

Today's historical execution must not be retroactively changed.

---

## Case 8 — User misses a Habit

The missed execution should remain historically distinguishable from a completed execution.

It must not break the underlying Habit definition.

---

## Case 9 — User changes a Habit's Target

Future Daily Habit Executions should use the updated configuration.

Historical executions should preserve their original execution context.

---

## Case 10 — User starts another activity while a Session is running

PBOS should discourage or prevent starting another focused Session until the current Session is:

```text
Paused
Completed
Abandoned
Interrupted
```

---

# 33. Daily Execution Master Flow

The complete normal-day experience is:

```text
OPEN PBOS
    ↓
TODAY
    ↓
Review meaningful priorities
    ↓
Choose executable item
    │
    ├── Project Work
    │      ↓
    │   Next Action
    │      ↓
    │   Session
    │
    └── Habit
           ↓
       Daily Habit Execution
           ↓
       Select execution level
           ↓
          Session
              ↓
        Actual execution
              ↓
         Complete/Pause
              ↓
          Record result
              ↓
       Choose what is next
```

---

# 34. Difficult-Day Flow

PBOS must support a reduced-capacity day without forcing the user to rebuild the system.

```text
Open PBOS
    ↓
Reality is worse than planned
    ↓
Reduce scope
    ↓
Choose meaningful minimum
    ↓
Execute
    ↓
Record actual result
    ↓
Continue / Recover
```

For Habits:

```text
Target
  ↓
Reduced
  ↓
Minimum
```

The system must not require the user to delete the original Target.

---

# 35. Day-End Flow

```text
Today's execution
       ↓
Review
       ↓
Completed / Partial / Missed
       ↓
Reflection
       ↓
Identify friction
       ↓
Adjust tomorrow if necessary
       ↓
End of day
```

---

# 36. Architecture Invariants

The following are considered core invariants.

### INV-01

A Session represents actual execution.

### INV-02

A Next Action represents executable Project work.

### INV-03

A Habit represents recurring behavior.

### INV-04

A Daily Habit Execution represents one occurrence of a Habit.

### INV-05

A Habit does not require a Next Action.

### INV-06

A Project Next Action may require multiple Sessions.

### INV-07

A Daily Habit Execution may require multiple Sessions.

### INV-08

A Session may originate from different executable sources.

### INV-09

Only one focused Session should normally be active at a time.

### INV-10

Session completion does not imply semantic work completion.

### INV-11

Timer completion does not imply semantic work completion.

### INV-12

Historical execution must remain distinguishable from current planning state.

### INV-13

Adaptive execution must not overwrite the underlying Habit Target.

### INV-14

Recovery must preserve context.

### INV-15

Plan changes must not rewrite historical reality.

---

# 37. State Machine Summary

The primary relationships are:

```text
PROJECT

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
Result
```

```text
HABIT

Habit
   ↓
Daily Habit Execution
   ↓
Execution Level
   ↓
Session
   ↓
Result
```

```text
SESSION

Ready
  ↓
Running
  ├──→ Paused ──→ Running
  ├──→ Interrupted ──→ Running
  ├──→ Completed
  └──→ Abandoned
```

```text
RECOVERY

Triggered
   ↓
Review
   ↓
Action Selected
   ↓
Executing
   ↓
Recovered
```

---

# 38. Step 4 Completion Criteria

Step 4 is functionally complete when the architecture can answer:

- What can the user execute?
- What starts a Session?
- Why is Next Action separate from Session?
- Why does Habit not require Next Action?
- How do Habit Target/Reduced/Minimum levels work?
- Can work require multiple Sessions?
- What happens when work is interrupted?
- What happens when a Session ends?
- What happens when work remains incomplete?
- What happens when the plan becomes unrealistic?
- What happens when a Habit is missed?
- What happens when a Next Action is blocked?
- What happens when the user returns after interruption?
- What states are allowed?
- What states are invalid?
- How is historical reality protected?

---

# 39. Next Step

The next architecture stage is:

> **Step 5 — System Architecture & Technical Boundaries**

Step 5 will define how the conceptual model is separated into actual software responsibilities.

It will establish boundaries such as:

```text
UI
 ↓
Application / Use Cases
 ↓
Domain Logic
 ↓
State Management
 ↓
Persistence
 ↓
Database / Storage
```

It will also determine:

- what belongs in frontend
- what belongs in backend
- what belongs in domain logic
- what must be persisted
- what is temporary state
- what should be event/history data
- how modules communicate
- where validation belongs
- where business rules belong
- how the system can evolve without becoming a monolith

No implementation framework should be selected merely because it is popular. The technical architecture must first follow the domain and execution model defined in Steps 1–4.
