# PBOS — Application Logic, Commands & Business Rules

**Document:** `PBOS_APPLICATION_LOGIC.md`  
**Architecture Version:** 1.0  
**Current Phase:** Step 7 — Application Logic, Commands & Business Rules  
**Status:** Initial Specification

---

# 1. Purpose

This document defines how PBOS behaves when users perform meaningful actions.

It connects:

```text
User Action
    ↓
Application Command
    ↓
Validation
    ↓
Domain Rules
    ↓
State Changes
    ↓
Persistence
    ↓
Updated View
```

This document defines behavioral rules, not UI implementation details.

---

# 2. Core Execution Principle

PBOS has two major sources of executable work:

```text
Project Work
    ↓
Next Action

Recurring Behavior
    ↓
Daily Habit Execution
```

Both can be executed through:

```text
Session
```

Therefore:

```text
Next Action ──────────┐
                      ↓
                    Session
                      ↑
Habit Execution ──────┘
```

There must not be two separate execution engines.

---

# 3. Definition vs Execution

The system must maintain this distinction:

### Definition

What the user intends or plans.

Examples:

```text
Habit
Project
Next Action
Goal
```

### Execution

What the user actually did.

Examples:

```text
Habit Execution
Session
Reflection
```

A definition must not be treated as proof of execution.

---

# 4. Command Model

A command represents a meaningful state-changing operation.

Examples:

```text
CreateHabit
UpdateHabit
ArchiveHabit

CreateNextAction
UpdateNextAction
CompleteNextAction
DeferNextAction
BlockNextAction

CreateHabitExecution
StartHabitExecution

StartNextAction
StartSession
PauseSession
ResumeSession
InterruptSession
CompleteSession
AbandonSession

CreateReflection
CreateRecovery
ResolveRecovery
```

The UI should trigger commands rather than directly manipulating persistent records.

---

# 5. Query Model

Queries read information without intentionally changing domain state.

Examples:

```text
GetToday
GetActiveSession
GetHabit
GetHabitHistory
GetProject
GetProjectRoadmap
GetNextActions
GetSessionHistory
GetAnalytics
GetRecoveryState
```

A query must not unexpectedly create or modify domain records.

---

# 6. General Command Lifecycle

Every important command should conceptually follow:

```text
1. Receive command
2. Validate input
3. Load required data
4. Validate domain state
5. Apply business rule
6. Persist state changes
7. Return updated result
8. Refresh relevant views
```

Not every command requires every step explicitly, but the responsibility order must remain clear.

---

# 7. Command Idempotency

Commands that may be accidentally repeated must be designed carefully.

For example:

```text
Start today's Exercise
```

being triggered twice must not create two active Sessions.

Similarly:

```text
Generate today's Habit Executions
```

must not create duplicate executions.

---

# 8. Habit Execution Model

A Habit is a recurring behavior definition.

A Daily Habit Execution represents today's occurrence.

Example:

```text
Habit:
Exercise

Today:
August 21

Daily Habit Execution:
Exercise — August 21
```

The Daily Habit Execution is the object that can actually be executed.

---

# 9. Habit Target Model

A Habit may define:

```text
Target
Reduced
Minimum
```

Example:

```text
Exercise

Target   = 45 minutes
Reduced  = 20 minutes
Minimum  = 5 minutes
```

These are **execution levels**, not three different Habits.

---

# 10. Meaning of Target

Target represents:

> The normal desired level of execution.

For example:

```text
Exercise Target = 45 minutes
```

does not mean:

> The user must always complete exactly 45 minutes.

It represents the normal intended level.

---

# 11. Meaning of Reduced

Reduced represents:

> A deliberately lower execution level for a difficult day.

Example:

```text
Target  = 45 min
Reduced = 20 min
```

Choosing Reduced does not mean the Habit itself has changed.

It means:

> Today the user is intentionally using a lower execution standard.

---

# 12. Meaning of Minimum

Minimum represents:

> The smallest meaningful action that preserves the behavioral connection.

Example:

```text
Minimum = 5 minutes
```

Minimum is not the user's normal target.

It is a fallback for difficult circumstances.

---

# 13. Target Must Not Be Replaced

If the user selects:

```text
Reduced = 20 min
```

the system must not change:

```text
Habit Target = 45 min
```

The Habit remains:

```text
Target = 45
Reduced = 20
Minimum = 5
```

Only today's execution context changes.

---

# 14. Habit Execution Selection

A Daily Habit Execution may enter an execution level:

```text
Target
Reduced
Minimum
```

The selected level belongs to the occurrence.

Example:

```text
Habit:
Exercise
Target = 45

Today's Execution:
Selected Level = Reduced
Expected = 20
```

---

# 15. Actual Performance

The system must record actual execution independently.

Example:

```text
Selected Level = Reduced
Expected = 20 min
Actual = 23 min
```

or:

```text
Selected Level = Target
Expected = 45 min
Actual = 32 min
```

The system must preserve both intention and reality.

---

# 16. Habit Execution Does Not Equal Session

A Daily Habit Execution is the day's behavioral occurrence.

A Session is one actual work period.

Therefore:

```text
Habit Execution
   ├── Session 1
   ├── Session 2
   └── Session 3
```

is valid.

Example:

```text
Exercise — August 21

Session 1 = 15 min
Session 2 = 10 min

Total actual = 25 min
```

The Habit Execution remains one occurrence.

---

# 17. Session Does Not Equal Next Action

A Next Action is executable work definition.

A Session is actual execution.

Therefore:

```text
Next Action:
Implement login validation

Sessions:
Session #1 = 25 min
Session #2 = 30 min
Session #3 = 15 min
```

is valid.

Completing one Session does not automatically mean the Next Action is completed.

---

# 18. Starting Habit Execution

When the user chooses:

> Start Exercise

the system should conceptually:

```text
Find today's Habit Execution
        ↓
Validate it can be executed
        ↓
Determine selected execution level
        ↓
Create Session
        ↓
Associate Session with Habit Execution
        ↓
Start Session
```

The system should not create a separate "Habit Session" type.

---

# 19. Starting Next Action

When the user chooses:

> Start Next Action

the system should:

```text
Find Next Action
        ↓
Validate it is executable
        ↓
Create Session
        ↓
Associate Session with Next Action
        ↓
Start Session
```

The same Session mechanism is used.

---

# 20. One Active Session

Normally, PBOS allows:

> One active focused Session at a time.

Therefore:

```text
User has active Session
        ↓
User tries to start another
        ↓
System does not silently create another active Session
```

The application should instead provide an appropriate transition such as:

```text
Finish current Session
Pause current Session
Abandon current Session
Switch after explicit confirmation
```

The exact UI choice belongs to later UX specification.

---

# 21. Starting a Session — Validation

Before starting a Session, the system should check:

```text
Source exists
Source is executable
Source is not cancelled
Source is not archived
No conflicting active Session exists
Required execution data exists
```

If validation fails, the Session must not be created.

---

# 22. Session Creation

A Session should capture its execution context when created.

Conceptually:

```text
Session
├── source
├── createdAt
├── startedAt
├── state
└── execution context
```

This ensures the Session remains historically interpretable.

---

# 23. Session State

Valid states include:

```text
Ready
Running
Paused
Interrupted
Completed
Abandoned
```

A Session should move only through valid transitions.

---

# 24. Session State Transitions

Conceptually:

```text
Ready
  ↓
Running
  ├──→ Paused
  │      ↓
  │    Running
  │
  ├──→ Interrupted
  │
  └──→ Completed

Paused
  ├──→ Running
  ├──→ Interrupted
  └──→ Abandoned

Interrupted
  ├──→ Running
  └──→ Abandoned
```

The exact recovery behavior may evolve.

---

# 25. Starting a Session

```text
Ready → Running
```

When this occurs:

- `startedAt` is recorded if not already recorded
- execution timing begins
- active Session becomes the current focused Session

---

# 26. Pausing a Session

```text
Running → Paused
```

The system records the pause transition.

The timer stops counting active execution time.

The Session remains unfinished.

---

# 27. Resuming a Session

```text
Paused → Running
```

The system records the resume transition.

Active execution timing continues.

The Session retains previous active work.

---

# 28. Completing a Session

```text
Running → Completed
```

or, where product rules allow:

```text
Paused → Completed
```

Completion means:

> This particular execution period is finished.

It does **not automatically mean**:

```text
Next Action = Completed
```

or:

```text
Habit Execution = Completed
```

Those are separate semantic decisions.

---

# 29. Abandoning a Session

```text
Running → Abandoned
Paused → Abandoned
```

An abandoned Session remains historical.

It must not be deleted simply because the user did not finish the work.

This preserves truthful execution history.

---

# 30. Interrupted Session

An interruption represents an execution that was disrupted unexpectedly or intentionally without being normally completed.

Example:

```text
User is exercising
Application closes unexpectedly
```

The system may recover the Session as interrupted/incomplete rather than falsely marking it completed.

---

# 31. App Close / Browser Refresh

An active Session must not automatically become:

```text
Completed
```

when the application closes.

On restart, PBOS should inspect persisted Session state.

Possible result:

```text
Running Session detected
        ↓
Recover Session
        ↓
Determine current state
```

The exact recovery policy is defined by the Recovery system.

---

# 32. Timer Failure vs Session Failure

If the timer UI crashes:

```text
Timer failure
```

does not necessarily mean:

```text
Session failure
```

The Session's persisted state remains authoritative.

The timer can reconstruct its display from Session timing data.

---

# 33. Timer Accuracy

The timer must not depend solely on incrementing:

```text
elapsed += 1 second
```

because browser/application pauses can make this inaccurate.

Elapsed time should be derived from reliable timestamps.

Conceptually:

```text
Active Duration
=
Sum of active execution intervals
```

---

# 34. Completing a Habit Session

When a Session associated with a Habit Execution completes:

```text
Session → Completed
        ↓
Calculate actual execution
        ↓
Update Habit Execution
```

The Habit Execution then evaluates its own completion rules.

---

# 35. Habit Completion Rule

Habit completion must be determined from the Habit's defined rules.

It must not simply be:

```text
Session completed = Habit completed
```

For example:

```text
Exercise Target = 45
Actual = 45
```

may satisfy Target.

But:

```text
Exercise Target = 45
Actual = 20
Selected Level = Reduced
```

may satisfy the Reduced execution standard.

The exact completion semantics must remain configurable through Habit rules.

---

# 36. Multiple Sessions and Habit Completion

If:

```text
Session 1 = 15 min
Session 2 = 10 min
Session 3 = 20 min
```

then:

```text
Total actual = 45 min
```

The Habit Execution should evaluate the **aggregate actual execution** for that occurrence.

It must not evaluate each Session independently as a separate Habit occurrence.

---

# 37. Example — Target Completion

```text
Habit:
Exercise

Target = 45 min
Reduced = 20 min
Minimum = 5 min
```

User executes:

```text
Session 1 = 25 min
Session 2 = 20 min
```

Total:

```text
45 min
```

Result:

```text
Target level achieved
```

---

# 38. Example — Reduced Completion

```text
Target = 45 min
Reduced = 20 min
Minimum = 5 min
```

User selects:

```text
Reduced
```

and executes:

```text
20 min
```

Result:

```text
Reduced level achieved
```

The Habit Target remains:

```text
45 min
```

---

# 39. Example — Minimum Completion

```text
Target = 45 min
Reduced = 20 min
Minimum = 5 min
```

User selects:

```text
Minimum
```

and executes:

```text
5 min
```

Result:

```text
Minimum level achieved
```

This should preserve behavioral continuity according to the Habit's rules without falsely representing it as normal Target execution.

---

# 40. Partial Execution

Suppose:

```text
Target = 45 min
Reduced = 20 min
Minimum = 5 min
```

User executes:

```text
12 min
```

without selecting a lower level.

The system should preserve:

```text
Actual = 12 min
```

and evaluate the result according to the Habit's completion policy.

It must not rewrite the selected level or target after the fact.

---

# 41. Next Action Session Completion

When a Session for a Next Action completes:

```text
Session → Completed
```

the system should record the execution.

Then the user/application may determine whether:

```text
Next Action → Completed
```

The system should not assume:

```text
one Session = one completed Next Action
```

because some Next Actions require multiple Sessions.

---

# 42. Next Action Partial Work

Example:

```text
Next Action:
Build login form
```

Session:

```text
30 minutes
```

The Session completes.

But the Next Action may remain:

```text
Active
```

because the work is not finished.

The user may later start another Session.

---

# 43. Completing Next Action

A Next Action should become Completed only when its completion condition is satisfied.

Conceptually:

```text
User confirms work complete
        ↓
Validate completion
        ↓
Next Action → Completed
```

The exact confirmation flow belongs to the User Flow specification.

---

# 44. Habit Schedule

A Habit may have a schedule defining when an occurrence should exist.

Examples:

```text
Daily
Specific weekdays
Specific dates
Other recurring patterns
```

The schedule determines **when the Habit is expected**.

It does not determine whether the user actually completed it.

---

# 45. Habit Occurrence Generation

For each expected occurrence:

```text
Habit Schedule
      ↓
Daily Habit Execution
```

The generation process must be idempotent.

If the system checks the same date repeatedly:

```text
August 21
```

it must return the same Daily Habit Execution rather than creating duplicates.

---

# 46. Missed Habit

A missed Habit occurrence is different from a deleted occurrence.

If the user does not execute the Habit:

```text
Habit Execution
→ Missed / Uncompleted
```

The historical occurrence should remain available for analytics.

The system should not pretend it never existed.

---

# 47. Habit Skip

A user may intentionally skip an occurrence if the product allows it.

This should be different from simply forgetting.

Conceptually:

```text
Expected
   ↓
Skipped
```

rather than:

```text
Expected
   ↓
Deleted
```

This distinction may later be useful for reflection and analytics.

---

# 48. Habit Schedule Change

If the user changes:

```text
Daily → Weekdays
```

future occurrences should follow the new schedule.

Past executions must remain unchanged.

---

# 49. Habit Archive

When a Habit is archived:

```text
Habit → Archived
```

Future executions should normally stop being generated.

Past executions remain available.

Existing Sessions remain historically valid.

---

# 50. Goal and Habit Influence

When a Habit is completed:

```text
Habit Execution → Completed
```

the system must **not automatically modify Goal progress** unless the Goal has an explicitly defined measurable relationship.

The relationship:

```text
Habit → Goal
```

represents influence/support.

It does not represent automatic progress transfer.

---

# 51. Life Domain Influence

Similarly:

```text
Habit Execution
```

does not mean:

```text
Life Domain = improved
```

The system may use execution history to produce insights, but should not claim direct causality.

---

# 52. Reflection

Reflection can be associated with:

```text
Session
Habit Execution
Next Action
Day
```

depending on the context.

A Reflection should preserve:

```text
what happened
what the user noticed
what the user learned
what the user wants to change
```

It should not silently modify historical execution.

---

# 53. Recovery

Recovery exists to help the user continue after disruption.

Examples:

```text
Missed Habit
Interrupted Session
Overwhelming Task
Failed Planned Session
Unexpected interruption
```

Recovery should answer:

> "What is the smallest useful next step from the current state?"

---

# 54. Recovery Must Not Rewrite History

If a Session was interrupted:

```text
Session = Interrupted
```

Recovery should not change it to:

```text
Session = Completed
```

unless the user actually resumes and completes the execution according to valid state transitions.

---

# 55. Recovery Example

```text
Session interrupted
      ↓
Recovery triggered
      ↓
Options:
   Resume
   Continue later
   Reduce scope
   Abandon
      ↓
User selects option
      ↓
Appropriate command executes
```

Recovery is a decision-support layer, not a history-rewriting mechanism.

---

# 56. Today Query

The Today screen should be generated through a query such as:

```text
GetToday
```

The query may combine:

```text
Today's Habit Executions
+
Relevant Next Actions
+
Current active Session
+
Recovery state
+
Other time-sensitive information
```

The UI receives a view model rather than directly assembling database records.

---

# 57. Today Must Not Create Business Decisions

The Today screen should not contain logic such as:

```text
if habit.completed then ...
if session.running then ...
if nextAction.blocked then ...
```

that determines business state.

It may conditionally render data supplied by the application layer.

---

# 58. Starting From Today

The Today screen may provide actions such as:

```text
Start Habit
Start Next Action
Continue Session
Resume Session
Complete
Reflect
Recover
```

Each action should invoke the corresponding application command.

---

# 59. Starting From Mind Map

A user may select a Next Action from the Mind Map.

The execution flow remains:

```text
Mind Map
   ↓
Select Next Action
   ↓
StartNextAction
   ↓
Create Session
   ↓
Session UI
```

The Mind Map does not create its own execution logic.

---

# 60. Starting From Project Screen

Likewise:

```text
Project Screen
   ↓
Next Action
   ↓
StartNextAction
   ↓
Session
```

The same execution system is reused.

---

# 61. Starting From Habit Screen

Likewise:

```text
Habit Screen
   ↓
Today's Habit Execution
   ↓
StartHabitExecution
   ↓
Session
```

No separate execution architecture is required.

---

# 62. Session as the Common Execution Layer

The complete execution model is:

```text
                 ┌── Next Action
                 │
User Intent ─────┤
                 │
                 └── Habit Execution
                         │
                         ↓
                      Session
                         │
                    ┌────┴────┐
                    ↓         ↓
                  Timer    Reflection
                    │
                    ↓
                 Outcome
```

This is the central execution architecture of PBOS.

---

# 63. Session vs Execution Source

The system should preserve the distinction:

```text
Source:
"What am I working on?"

Session:
"What actual execution period occurred?"
```

Example:

```text
Source:
Exercise — August 21

Session:
08:00–08:25
```

or:

```text
Source:
Implement authentication

Session:
14:00–14:40
```

---

# 64. No Artificial "Next Session"

PBOS should not create a permanent object called:

```text
Next Session
```

unless a future feature genuinely requires scheduled Sessions.

The current model is:

```text
Next Action
+
Habit Execution
        ↓
Can be executed
        ↓
Session
```

The executable source is what the user is choosing.

---

# 65. Next Action Is Not "The Next Session"

This distinction is mandatory.

```text
Next Action
=
What needs to be done.

Session
=
One period spent doing it.
```

Therefore:

```text
One Next Action
→ Many Sessions
```

is normal.

---

# 66. Habit Is Not "A Daily Session"

Similarly:

```text
Habit
=
Recurring behavior definition.

Habit Execution
=
Today's occurrence.

Session
=
One actual execution period.
```

Therefore:

```text
One Habit
→ Many Daily Executions
→ Many Sessions over time
```

---

# 67. Daily Habit Execution Can Have Multiple Sessions

This is explicitly supported.

Example:

```text
Exercise — Aug 21
    ↓
Session 1: 15 min
Session 2: 10 min
Session 3: 20 min
    ↓
Total actual = 45 min
```

The system evaluates the Daily Habit Execution using the aggregate execution data.

---

# 68. Session Completion Does Not Determine User Success

A completed Session means:

> The Session itself ended according to its execution state.

It does not necessarily mean:

```text
Habit Target achieved
Next Action completed
Goal progressed
Project completed
```

Those are separate domain concepts.

---

# 69. Command Example — Start Exercise

```text
START_HABIT_EXECUTION
        ↓
Find Habit
        ↓
Find/Create today's Habit Execution
        ↓
Validate Habit state
        ↓
Check active Session
        ↓
Select execution level
        ↓
Create Session
        ↓
Persist
        ↓
Return active Session
```

---

# 70. Command Example — Pause

```text
PAUSE_SESSION
        ↓
Find active Session
        ↓
Validate state = Running
        ↓
Record pause
        ↓
Session = Paused
        ↓
Persist
        ↓
Update UI
```

---

# 71. Command Example — Resume

```text
RESUME_SESSION
        ↓
Find Session
        ↓
Validate state = Paused
        ↓
Record resume
        ↓
Session = Running
        ↓
Persist
```

---

# 72. Command Example — Complete Session

```text
COMPLETE_SESSION
        ↓
Find Session
        ↓
Validate transition
        ↓
Calculate actual active duration
        ↓
Session = Completed
        ↓
Persist
        ↓
Evaluate source outcome
        ↓
Update Habit Execution if applicable
        ↓
Return updated state
```

---

# 73. Command Example — Complete Next Action

```text
COMPLETE_NEXT_ACTION
        ↓
Find Next Action
        ↓
Validate completion condition
        ↓
Next Action = Completed
        ↓
Persist
        ↓
Update relevant views
```

No Session is automatically created by this command.

---

# 74. Command Example — Archive Habit

```text
ARCHIVE_HABIT
        ↓
Find Habit
        ↓
Validate archive operation
        ↓
Habit = Archived
        ↓
Stop future occurrence generation
        ↓
Preserve historical executions
```

---

# 75. Command Example — Change Habit Target

Suppose:

```text
Old Target = 45 min
New Target = 30 min
```

The system should:

```text
Update current Habit configuration
        ↓
Preserve historical execution context
        ↓
Future executions use new configuration
```

It must not:

```text
Rewrite previous executions
```

---

# 76. Command Example — Generate Today

```text
GET_TODAY
        ↓
Determine today's date
        ↓
Find scheduled Habits
        ↓
Find/create required Daily Habit Executions
        ↓
Find relevant Next Actions
        ↓
Find active Session
        ↓
Find recovery state
        ↓
Build Today View Model
        ↓
Return
```

The operation must remain idempotent.

---

# 77. Business Rule Categories

PBOS business rules should be classified into:

### Execution Rules

Rules governing Sessions and actual work.

### Habit Rules

Rules governing recurring behavior and execution levels.

### Project Rules

Rules governing Projects, Nodes, and Next Actions.

### Historical Rules

Rules protecting historical accuracy.

### Recovery Rules

Rules governing disruption recovery.

### Relationship Rules

Rules governing Goal, Domain, Habit, and Project relationships.

---

# 78. Execution Rules

### EXEC-01

A Session represents one actual execution period.

### EXEC-02

A Session must have one execution source.

### EXEC-03

One source may have multiple Sessions.

### EXEC-04

Only one focused Session should normally be active.

### EXEC-05

Timer state does not determine semantic completion.

### EXEC-06

A completed Session does not automatically complete its source.

### EXEC-07

Abandoned Sessions remain historical.

### EXEC-08

Active duration must account for pauses.

---

# 79. Habit Rules

### HABIT-01

Habit is a recurring definition.

### HABIT-02

Daily Habit Execution is a separate occurrence.

### HABIT-03

A Habit may have Target, Reduced, and Minimum levels.

### HABIT-04

Target is the normal desired level.

### HABIT-05

Reduced is an adaptive lower level.

### HABIT-06

Minimum is the smallest meaningful fallback.

### HABIT-07

Changing current Habit configuration must not rewrite history.

### HABIT-08

Multiple Sessions may contribute to one Daily Habit Execution.

### HABIT-09

Actual performance must remain separate from intended level.

### HABIT-10

Habit relationships with Goals and Life Domains are non-blocking.

---

# 80. Project Rules

### PROJECT-01

Project represents planned work.

### PROJECT-02

Next Action represents executable Project work.

### PROJECT-03

One Next Action may require multiple Sessions.

### PROJECT-04

Session completion does not automatically imply Next Action completion.

### PROJECT-05

Next Action completion requires its completion condition.

---

# 81. Historical Rules

### HISTORY-01

Historical execution must remain interpretable.

### HISTORY-02

Current configuration must not rewrite past execution.

### HISTORY-03

Abandoned/Interrupted Sessions remain historical.

### HISTORY-04

Archived entities retain historical relationships.

### HISTORY-05

Corrections must be explicit.

---

# 82. Relationship Rules

### REL-01

Habit is independent from Project hierarchy.

### REL-02

Habit may influence multiple Life Domains.

### REL-03

Habit may support multiple Goals.

### REL-04

Habit ↔ Goal is not a structural dependency.

### REL-05

Habit ↔ Life Domain is not a structural dependency.

### REL-06

Influence relationships must not automatically imply causality.

---

# 83. Recovery Rules

### REC-01

Recovery helps continue after disruption.

### REC-02

Recovery does not rewrite history.

### REC-03

Interrupted Sessions remain distinguishable from Completed Sessions.

### REC-04

Recovery should lead to an explicit next state/action.

---

# 84. Data Integrity Rules

### DATA-01

Duplicate Daily Habit Executions must be prevented.

### DATA-02

Duplicate active Sessions must be prevented.

### DATA-03

Invalid source references must be rejected.

### DATA-04

Multi-record state changes should be atomic where necessary.

### DATA-05

Derived data must not become the sole source of truth.

---

# 85. User Experience Rule

The architecture should support this mental model:

```text
"What should I do?"
        ↓
Today

"What is this work part of?"
        ↓
Project / Roadmap

"What recurring behavior am I maintaining?"
        ↓
Habit

"What am I actually doing right now?"
        ↓
Session

"What happened?"
        ↓
Reflection

"What if something went wrong?"
        ↓
Recovery
```

The user should not need to understand the internal entities.

---

# 86. Final Application Model

The complete operational model is:

```text
                    TODAY
                      │
          ┌───────────┴───────────┐
          │                       │
       HABITS                  PROJECTS
          │                       │
   Habit Execution           Next Action
          │                       │
          └───────────┬───────────┘
                      ↓
                   SESSION
                      │
             ┌────────┼────────┐
             ↓        ↓        ↓
           Timer   Outcome  Reflection
                      │
                      ↓
                  Recovery
```

The architecture intentionally keeps these concepts separate while making their everyday interaction simple.

---

# 87. Step 7 Completion Criteria

Step 7 is complete when the implementation team can determine exactly:

- what happens when a Habit is started
- what happens when a Next Action is started
- how a Session is created
- how a Session is paused
- how a Session is resumed
- how a Session is completed
- how multiple Sessions contribute to one work item
- how Target/Reduced/Minimum operate
- how Habit completion is evaluated
- how Next Action completion is evaluated
- how interruptions are handled
- how app restart is handled
- how Recovery works
- how historical data is protected
- how Today is generated
- how duplicate operations are prevented
- which state transitions are valid
- which operations require explicit confirmation
