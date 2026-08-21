## 1. Purpose

This document defines how PBOS should be experienced by a real user.

The internal architecture contains concepts such as:

- Habit
- Habit Execution
- Next Action
- Session
- Goal
- Project
- Life Domain
- Reflection
- Recovery

However, the user should **not need to understand the internal architecture** to use PBOS.

The UX must translate the internal model into a simple daily experience:

```text
What should I do?
        ↓
Choose / Start something
        ↓
Do it
        ↓
Reflect
        ↓
Continue / Recover
        ↓
See progress over time
```

---

# 2. Core UX Principle

PBOS should feel like a **personal operating system**, not a database manager.

The user should primarily experience:

```text
Today
   ↓
Action
   ↓
Session
   ↓
Reflection
   ↓
Progress
```

Not:

```text
Entities
Relationships
Records
States
Foreign Keys
```

Internal complexity must remain behind the interface.

---

# 3. Primary UX Goal

The primary question PBOS should answer is:

> **"What is the most useful thing I can do right now?"**

The application should minimize the number of decisions required to begin meaningful work.

---

# 4. UX Hierarchy

The application should have the following conceptual hierarchy:

```text
LIFE
│
├── Today
│
├── Habits
│
├── Projects
│
├── Goals
│
├── Mind Map
│
├── History / Insights
│
└── Settings
```

However, not all of these should have equal prominence.

---

# 5. Primary Navigation

The primary navigation should prioritize daily execution.

Recommended structure:

```text
Today
Habits
Projects
Mind Map
Insights
```

Secondary navigation:

```text
Goals
History
Settings
```

The exact visual implementation may change later.

The information hierarchy should not.

---

# 6. Today Is the Home Screen

When the user opens PBOS, the default destination should be:

> **Today**

Today is the operational center of the application.

It should answer:

1. What matters today?
2. What habits should I maintain?
3. What work can I do now?
4. Am I currently in a Session?
5. Do I need to recover from something?

---

# 7. Today Screen Structure

Conceptually:

```text
TODAY
│
├── Current Session
│
├── Today's Habits
│
├── Priority / Suggested Work
│
├── Next Actions
│
└── Recovery / Reflection
```

The exact order may adapt to the user's current state.

---

# 8. Current Session Has Highest Priority

If a Session is active:

```text
Current Session
        ↓
Top priority
```

The user should immediately be able to:

```text
Continue
Pause
Complete
```

The user should not have to navigate through multiple screens to return to an active Session.

---

# 9. Today Without Active Session

If no Session is active, Today should encourage a clear next action.

Example:

```text
Good evening.

What do you want to work on?

[ Exercise ]

[ Continue Project ]

[ View Next Actions ]
```

The interface should avoid overwhelming the user with every possible task.

---

# 10. Today's Habits

Today's Habits should show only relevant scheduled Habit Executions.

Each Habit card should communicate:

```text
Habit name
Current execution state
Selected execution level if applicable
Actual progress
Primary action
```

Example:

```text
Exercise

Target: 45 min
Today: 0 min

[ Start ]
```

---

# 11. Habit Target Display

The interface must avoid communicating:

> "You failed because you didn't do 45 minutes."

Instead:

```text
Target
45 min
```

should represent the normal desired level.

The interface may offer:

```text
Target
Reduced
Minimum
```

as execution choices.

---

# 12. Execution-Level Selection

When starting a Habit, the user may choose:

```text
Target
Reduced
Minimum
```

Example:

```text
Exercise

How much are you aiming for today?

○ Target — 45 min
○ Reduced — 20 min
○ Minimum — 5 min

[ Start ]
```

The wording should feel supportive rather than punitive.

---

# 13. Do Not Force Level Selection Every Time

The system should minimize friction.

If the user normally chooses Target, the UI may make Target the obvious default.

The user should be able to quickly switch to Reduced or Minimum when needed.

---

# 14. Target Is Not a Deadline

The interface must never make:

```text
45 min
```

look like a countdown that must be completed immediately.

It is an execution target.

The timer represents actual work.

---

# 15. Habit Progress

During execution, the user should see:

```text
Exercise

23:41

Target: 45 min
Actual: 23:41
```

If the user selected Reduced:

```text
Exercise

12:18

Reduced target: 20 min
```

The interface should make the selected level visible without changing the Habit's permanent target.

---

# 16. Habit Completion Display

After completion:

```text
Exercise
45 min completed
Target reached
```

For Reduced:

```text
Exercise
20 min completed
Reduced level reached
```

For Minimum:

```text
Exercise
5 min completed
Minimum level reached
```

The system should distinguish these outcomes.

---

# 17. Multiple Habit Sessions

If a Habit is completed through multiple Sessions:

```text
Exercise

Today
25 min + 20 min = 45 min

Target reached
```

The user should experience this as **one day's Habit**, not as three separate Habits.

---

# 18. Habit Detail Screen

A Habit detail page should contain:

```text
Habit Name
Purpose / Why
Schedule
Target
Reduced
Minimum
Today's Progress
Recent History
Related Goals
Related Life Domains
```

The relationships should be informative, not overwhelming.

---

# 19. Habit History

Habit history should allow the user to see patterns.

Example:

```text
Exercise

This week:
Mon ✓
Tue ✓
Wed Reduced
Thu ✓
Fri Minimum
Sat —
Sun —
```

The system should avoid presenting every deviation as failure.

---

# 20. Habit Streaks

Streaks may be shown when useful.

However:

> Streaks must not become the primary definition of success.

A user who performs a Minimum execution should not necessarily feel that the entire system has reset or failed.

PBOS should emphasize:

```text
Consistency
Recovery
Progress
```

rather than only:

```text
Perfect streak
```

---

# 21. Project Screen

Projects should communicate:

```text
What am I trying to accomplish?
Why?
What is the current structure?
What can I do next?
```

A Project screen should contain:

```text
Project
├── Purpose
├── Outcome
├── Progress
├── Structure
├── Next Actions
└── History
```

---

# 22. Next Actions on Project Screen

The user should primarily see actionable work.

Example:

```text
Website Project

Next Actions

□ Create database schema
□ Build login form
□ Test authentication
```

Each action should have a clear:

```text
[ Start ]
```

button.

---

# 23. Next Action Language

Next Action names should describe something executable.

Good:

```text
Create database schema
Write login validation
Test mobile navigation
```

Bad:

```text
Website
Backend
Authentication
Improve project
```

The latter are areas/topics rather than executable actions.

---

# 24. Next Action Detail

A Next Action may display:

```text
Action
Context
Project
Related Goal
Status
Notes
Previous Sessions
```

The most important action remains:

```text
[ Start ]
```

---

# 25. Next Action With Multiple Sessions

If the work requires multiple Sessions:

```text
Create authentication system

Progress
3 Sessions
1h 25m

Status
In Progress

[ Continue ]
```

The user should understand that the work is continuing.

---

# 26. Next Action Completion

When the user believes the work is finished:

```text
[ Mark Complete ]
```

PBOS may ask for confirmation if the action has substantial consequences.

Completion should remain a distinct action from merely ending a Session.

---

# 27. Session Screen

The Session screen is the application's focused execution environment.

It should remove distractions.

Conceptually:

```text
SESSION
────────────────

What you're doing:

Build login validation

Time
24:18

[ Pause ]

[ Finish ]
```

---

# 28. Session Screen Information Priority

Highest priority:

```text
Current work
Elapsed time
Primary control
```

Secondary information:

```text
Target
Project / Habit context
Optional motivation
```

Low-priority information should be hidden during focused execution.

---

# 29. Visualization Before Session

If the PBOS execution flow includes guided visualization, it should happen **before focused work**, not during it.

Conceptually:

```text
Start
 ↓
Visualization
 ↓
Session
 ↓
Reflection
```

Visualization should be short and optional enough that it does not become a barrier to starting.

---

# 30. Visualization UX

The visualization screen should contain:

```text
Short prompt
Simple visual focus
Countdown / progression
[ Skip ]
```

The user should not need to configure complex visualization settings every time.

---

# 31. Session Timer

The timer should:

- clearly show elapsed active time
- handle pauses correctly
- survive reasonable UI disruptions
- recover after application restart
- avoid depending entirely on visual timer ticks

The displayed timer is a representation of Session state.

It is not the source of truth.

---

# 32. Pause UX

Pause should be immediate.

Example:

```text
[ Pause ]
```

After pausing:

```text
Paused

24:18 completed

[ Resume ]
[ End Session ]
```

The system should not force the user to start over.

---

# 33. Session Interruption

If the application detects an interrupted Session:

```text
Your previous Session was interrupted.

Build login validation
24 min completed

[ Resume ]
[ End ]
```

The user should not be punished for technical interruption.

---

# 34. Session Completion

After:

```text
[ Finish ]
```

the user should receive a clear completion state.

Example:

```text
Session complete.

24 minutes focused.

[ Reflect ]
[ Done ]
```

---

# 35. Reflection UX

Reflection should be lightweight.

It should not become another large task.

Recommended structure:

```text
How did it go?

[ Quick response ]

What did you notice?

[ Optional note ]

What should happen next?

[ Continue ]
```

---

# 36. Reflection Should Match Context

Habit reflection may ask:

```text
How did today's exercise feel?
```

Project reflection may ask:

```text
What did you accomplish?
What's the next useful step?
```

The system should not ask identical questions for every context.

---

# 37. Reflection Is Optional Unless Required

PBOS should avoid turning every Session into:

```text
Start
↓
Work
↓
Long form
↓
Submit
```

Reflection should support execution rather than interrupt momentum.

---

# 38. Recovery UX

Recovery should appear when useful.

Example:

```text
You missed Exercise yesterday.

What would help today?

[ Do Target ]
[ Use Reduced ]
[ Do Minimum ]
[ Skip Today ]
```

The system should encourage re-entry rather than guilt.

---

# 39. Recovery Should Prefer Action

Recovery should usually end with:

```text
a clear next action
```

rather than a long explanation.

Example:

```text
Yesterday didn't go as planned.

Today:

[ Start 20 min Exercise ]
```

---

# 40. Recovery Must Preserve Truth

If yesterday was missed:

```text
Yesterday = Missed
```

The system must not silently rewrite it to:

```text
Yesterday = Completed
```

just to make the interface look better.

---

# 41. Mind Map

The Mind Map is a visual representation of the user's larger system.

It should help answer:

> "How are my projects, goals, habits, and life areas connected?"

It is not the primary execution screen.

---

# 42. Mind Map Information Hierarchy

Conceptually:

```text
Life
│
├── Life Domain
│     │
│     ├── Goal
│     │     └── Project
│     │            └── Next Action
│     │
│     └── Habit
│
└── Other relationships
```

However, Habits must not be visually represented as children of Projects.

Their cross-domain influence should remain distinguishable.

---

# 43. Mind Map Relationship Rules

The visual system must distinguish between:

```text
Structural relationship
```

and:

```text
Influence / support relationship
```

For example:

```text
Project
   │
   └── Next Action
```

is structural.

Whereas:

```text
Habit ─ ─ ─ → Goal
```

represents influence/support.

This distinction is important.

---

# 44. Mind Map Must Not Become a Graph Database UI

The Mind Map should not expose every internal relationship simultaneously.

Too many connections create visual noise.

The user should be able to:

```text
Zoom
Filter
Expand
Collapse
Focus on one entity
```

---

# 45. Mind Map Interaction

Selecting a node should open a focused detail view.

Example:

```text
Select Project
      ↓
Project details
      ↓
Next Actions
      ↓
[ Start ]
```

The Mind Map itself should not create a second execution system.

---

# 46. Goals

Goals should answer:

```text
What am I trying to achieve?
Why does it matter?
What supports it?
How is progress measured?
```

Goals should not become task lists.

Projects and Next Actions handle executable work.

---

# 47. Goal Progress

Goal progress should only be calculated from explicitly defined measurable data.

The system must not automatically assume:

```text
Habit completed
=
Goal progressed by X%
```

unless the relationship explicitly defines such a measurement.

---

# 48. Life Domains

Life Domains provide a broad organizational layer.

Examples may include:

```text
Health
Career
Learning
Relationships
Finance
Personal Growth
```

The UI should not force every item into one and only one Domain when the domain model allows cross-domain relationships.

---

# 49. Insights / Analytics

Insights should focus on useful patterns.

Examples:

```text
Habit consistency
Actual execution time
Target vs Reduced vs Minimum usage
Session patterns
Project execution
Recovery patterns
```

The system should avoid pretending that correlation proves causation.

---

# 50. Analytics Language

Good:

> "You completed Exercise more consistently on days when you started before 10 AM."

Better than:

> "Morning exercise caused you to be more productive."

The second statement claims causality that the system may not actually know.

---

# 51. History

History should allow users to inspect:

```text
Sessions
Habit Executions
Reflections
Completed Next Actions
Project activity
Recovery events
```

Historical data should remain trustworthy.

---

# 52. History Should Be Time-Based

The primary browsing mechanism should be intuitive:

```text
Today
Yesterday
This Week
This Month
Custom
```

rather than forcing users to understand database entities.

---

# 53. Empty States

Every major screen needs a useful empty state.

Example:

```text
No projects yet.

Create something you're working toward.

[ Create Project ]
```

Not:

```text
No data found.
```

---

# 54. Empty Today State

If the user has no scheduled Habits and no active work:

```text
Your day is clear.

What would you like to work on?

[ Add Habit ]
[ Create Project ]
```

The system should not invent work.

---

# 55. Loading States

Loading states should communicate what is happening.

Avoid unnecessary full-screen loading.

Prefer:

```text
Skeleton
Inline loading
Progressive rendering
```

where appropriate.

---

# 56. Error States

Errors should be understandable.

Bad:

```text
Error: SQLITE_CONSTRAINT_FOREIGNKEY
```

Better:

```text
We couldn't save this Session.

Your work has not been lost.
Try again.
```

Technical details may be available for debugging but should not dominate the user interface.

---

# 57. Offline / Persistence Failure

If local persistence temporarily fails, the system must avoid claiming:

```text
Saved
```

when it was not actually persisted.

The UI should clearly distinguish:

```text
Saved
Saving
Unable to save
Recovered
```

---

# 58. Accidental Actions

Destructive operations should require appropriate confirmation.

Examples:

```text
Delete Habit
Delete Project
Delete historical data
```

But low-risk actions should remain fast.

Do not add confirmation dialogs everywhere.

---

# 59. Archive vs Delete

Where possible:

```text
Archive
```

should be preferred over:

```text
Delete
```

because PBOS values historical continuity.

Deletion should be reserved for cases where permanent removal is genuinely appropriate.

---

# 60. Responsive Design

PBOS should work across:

```text
Desktop
Tablet
Mobile
```

The information hierarchy must remain consistent.

The layout may change.

---

# 61. Mobile Priority

On mobile, prioritize:

```text
Today
Current Session
Start Action
Habit Execution
Recovery
```

Complex management interfaces such as the full Mind Map may use a simplified mobile representation.

---

# 62. Desktop Priority

Desktop may provide richer:

```text
Mind Map
Project structure
Analytics
History
Multi-panel navigation
```

but the core execution flow should remain simple.

---

# 63. Accessibility

The UI must support:

- keyboard navigation
- visible focus
- readable text
- sufficient contrast
- semantic controls
- accessible labels
- screen-reader-friendly states
- non-color-only status indicators

For example:

Do not represent completion only with:

```text
green
```

Also provide:

```text
✓ Completed
```

---

# 64. Notification Principles

Notifications should support action, not create anxiety.

Good:

> "Your Exercise habit is still available today. Want to use the 20-minute Reduced option?"

Bad:

> "You haven't completed your Exercise. You're breaking your streak!"

PBOS should behave like a coach, not a punishment system.

---

# 65. Nudging Rules

Nudges should be:

```text
Relevant
Timely
Small
Actionable
Non-judgmental
```

The system should avoid excessive notifications.

---

# 66. Cognitive Load Rule

At any moment, the user should primarily see:

> **One clear recommended next step.**

Additional choices may remain available, but the primary path should be obvious.

---

# 67. Avoiding Decision Overload

Do not present:

```text
20 tasks
15 habits
8 projects
12 goals
```

as equally important actions on Today.

Today should prioritize.

The complete system can remain accessible elsewhere.

---

# 68. Primary Action Rule

Every major screen should have a clear primary action.

Examples:

```text
Today → Start
Habit → Start Habit
Project → Start Next Action
Session → Continue / Finish
Reflection → Save / Continue
Recovery → Recover / Continue
```

---

# 69. Consistent Start Behavior

Regardless of where the user starts:

```text
Today
Habit
Project
Mind Map
History
```

when they choose to execute something, the system should converge on:

```text
Pre-session preparation
        ↓
Session
        ↓
Reflection / Outcome
```

There must not be separate timer implementations for different entry points.

---

# 70. Navigation During Session

The user should be able to navigate away without accidentally destroying the Session.

The active Session should remain recoverable.

The application should make the active Session easy to return to.

---

# 71. Active Session Indicator

When a Session is active, the global interface should provide a persistent indication.

Example:

```text
● Session running — 24:18
```

Selecting it returns to the Session.

---

# 72. User Mental Model

The application should teach the user only these essential concepts:

```text
Habit
= something I repeatedly practice

Project
= something I am trying to accomplish

Next Action
= something concrete I can do

Session
= a period of actually doing it

Reflection
= what I learned

Recovery
= how I continue after disruption
```

Everything else can remain implicit.

---

# 73. Critical UX Distinction

The following distinction must remain visible in the architecture:

```text
Habit
    ↓
Today's Habit
    ↓
Session
```

and:

```text
Project
    ↓
Next Action
    ↓
Session
```

The user should experience both as:

> **Choose something → Start → Do → Finish**

while the system preserves their different meanings.

---

# 74. No Forced Architecture Exposure

The UI should never require the user to choose:

```text
"Create Habit Execution"
```

or:

```text
"Create Session"
```

The user should say:

```text
"Start Exercise"
```

and PBOS handles the internal objects.

---

# 75. No Forced Database Concepts

The user should never encounter concepts such as:

```text
record
entity ID
foreign key
state transition
persistence
```

in normal usage.

---

# 76. Daily Usage Flow

The intended normal experience is:

```text
Open PBOS
   ↓
Today
   ↓
See Habits + useful work
   ↓
Choose one
   ↓
Optional visualization
   ↓
Session
   ↓
Work
   ↓
Finish
   ↓
Light reflection
   ↓
Return to Today
   ↓
Choose next useful action
```

This is the primary loop of PBOS.

---

# 77. Difficult-Day Flow

On a difficult day:

```text
Today
   ↓
Exercise
   ↓
Choose Reduced
   ↓
20 min Session
   ↓
Complete
```

The application should make this feel like a **valid adaptive execution**, not a failure.

---

# 78. Very Difficult-Day Flow

```text
Today
   ↓
Exercise
   ↓
Choose Minimum
   ↓
5 min
   ↓
Complete
```

The system preserves continuity while accurately recording the lower execution level.

---

# 79. Missed-Day Flow

```text
Open PBOS
   ↓
Recovery
   ↓
Yesterday missed
   ↓
Choose today's response
   ↓
Start
```

The user should be guided toward re-engagement rather than spending time analyzing failure.

---

# 80. Project Work Flow

```text
Today
   ↓
Next Action
   ↓
Start
   ↓
Session
   ↓
Work
   ↓
Finish
   ↓
Reflection
   ↓
Continue same Next Action
OR
Complete Next Action
OR
Choose another Next Action
```

---

# 81. Habit Work Flow

```text
Today
   ↓
Habit
   ↓
Choose Target / Reduced / Minimum
   ↓
Start
   ↓
Session
   ↓
Work
   ↓
Finish
   ↓
Habit progress updated
   ↓
Reflection if appropriate
```

---

# 82. Cross-Domain UX

If a Habit supports multiple Goals or Life Domains, the user should not have to select those relationships during every execution.

For example:

```text
Exercise
```

should not ask:

```text
Which Goal is this helping?
□ Fitness
□ Career
□ Confidence
□ Mental performance
```

Those relationships are already defined.

The execution should remain simple.

---

# 83. Relationship Visibility

Relationships can be visible on:

```text
Habit Detail
Goal Detail
Life Domain Detail
Mind Map
Insights
```

but should remain mostly invisible during execution.

---

# 84. UX Rule — Execution First

When the user is ready to work:

> **Do not make them manage the system.**

The system should manage itself around the user's action.

---

# 85. UX Rule — Configuration Second

Configuration belongs primarily in:

```text
Habit Detail
Project Detail
Goal Detail
Settings
```

not inside the main execution flow.

---

# 86. UX Rule — History Is Immutable by Default

The user may correct mistakes, but PBOS should never silently rewrite history.

Historical records should remain understandable after:

```text
Habit changes
Project changes
Goal changes
Schedule changes
```

---

# 87. UX Rule — Support Without Pressure

PBOS should encourage:

```text
Start
Continue
Recover
Reflect
```

rather than:

```text
You failed
You broke your streak
You are behind
```

---

# 88. UX Rule — No Fake Productivity

The interface should not reward the user simply for:

```text
creating tasks
organizing projects
moving items
checking boxes
```

The primary value comes from:

```text
actual execution
```

Therefore execution data should remain central.

---

# 89. UX Rule — Planning Must Lead to Action

Project planning screens should always make it easy to move from:

```text
Plan
```

to:

```text
Next Action
```

and from:

```text
Next Action
```

to:

```text
Session
```

---

# 90. UX Rule — Habit Must Lead to Action

Habit screens should always make it easy to move from:

```text
Habit
```

to:

```text
Today's execution
```

and then:

```text
Session
```

---

# 91. UX Rule — The User Should Not Need to Know "Session"

The word **Session** may be used in the interface because it is useful, but the user should primarily think:

> "I'm working on this."

The internal distinction exists to keep the system accurate.

---

# 92. UX Rule — One Execution Experience

Whether the user starts from:

```text
Habit
Next Action
Today
Project
Mind Map
```

the focused execution experience should feel like the same product.

---

# 93. UX Rule — Context Must Remain Visible

During a Session, the user should know what they are doing.

Example:

```text
Exercise
```

or:

```text
Build authentication
Project: PBOS
```

The Session must never feel detached from its source.

---

# 94. UX Rule — Completion Must Be Explicit

The system should distinguish:

```text
I stopped working
```

from:

```text
I completed this work.
```

Therefore ending a Session and completing a Next Action are separate operations.

---

# 95. UX Rule — Avoid Unnecessary Confirmation

Do not ask:

```text
Are you sure?
```

for every normal action.

Use confirmation only when:

- data could be lost
- a destructive action occurs
- a meaningful state change could be accidental

---

# 96. Information Architecture Summary

The final user-facing information architecture is:

```text
PBOS
│
├── TODAY
│   ├── Active Session
│   ├── Today's Habits
│   ├── Next Actions
│   └── Recovery
│
├── HABITS
│   ├── All Habits
│   ├── Today's Executions
│   ├── Habit Detail
│   └── Habit History
│
├── PROJECTS
│   ├── Projects
│   ├── Project Detail
│   ├── Structure
│   └── Next Actions
│
├── MIND MAP
│   ├── Goals
│   ├── Domains
│   ├── Projects
│   ├── Habits
│   └── Relationships
│
├── INSIGHTS
│   ├── Habits
│   ├── Sessions
│   ├── Projects
│   └── Patterns
│
├── HISTORY
│   ├── Sessions
│   ├── Habits
│   ├── Reflections
│   └── Recovery
│
└── SETTINGS
    ├── Preferences
    ├── Notifications
    └── Data
```

---

# 97. Final UX Architecture

The entire PBOS experience can be summarized as:

```text
                         PBOS
                          │
                       TODAY
                          │
             ┌────────────┼────────────┐
             ↓            ↓            ↓
          HABIT      NEXT ACTION    RECOVERY
             │            │
             └──────┬─────┘
                    ↓
               START WORK
                    │
             Optional Setup
                    │
              Visualization
                    │
                    ↓
                 SESSION
                    │
                 Focused
                  Work
                    │
                    ↓
                COMPLETE
                    │
             ┌──────┴──────┐
             ↓             ↓
         REFLECTION     OUTCOME
             │             │
             └──────┬──────┘
                    ↓
                   TODAY
                    │
                    ↓
              NEXT ACTION
```

The key architectural principle is:

> **PBOS may contain a sophisticated internal system, but the user's daily experience should remain extremely simple: know what matters, start it, do it, finish it, learn from it, and continue.**

---

## Step 8 Completion Criteria

Step 8 is complete when the implementation team can determine:

- what the user sees when opening PBOS
- what belongs on Today
- how Habits are displayed
- how Target / Reduced / Minimum are presented
- how Projects and Next Actions are presented
- how the user starts work
- how every execution path reaches the same Session experience
- how the Session interface behaves
- how pause/resume/interruption are presented
- how Reflection appears
- how Recovery appears
- how the Mind Map is organized
- how Goals and Life Domains are represented
- how History and Insights are accessed
- how mobile and desktop differ
- how empty/loading/error states behave
- how accessibility is handled
- how destructive actions are confirmed
- how the system avoids unnecessary cognitive load
- how the internal domain model remains hidden from normal users

**Most important UX invariant:**

```text
Complex internal architecture
            ↓
       Simple interface
            ↓
       Clear next action
            ↓
       Real execution
```
