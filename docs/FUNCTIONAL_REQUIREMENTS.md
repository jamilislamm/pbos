# PBOS — Functional Requirements

**Document:** `PBOS_FUNCTIONAL_REQUIREMENTS.md`
**Architecture Version:** 1.0
**Current Phase:** Step 3 — Functional Requirements
**Status:** Initial Functional Specification

---

# 1. Purpose

This document defines what PBOS must be able to do from the user's perspective and how the system should behave.

It converts the conceptual model from `PBOS_DOMAIN_MODEL.md` into observable software behavior.

This document defines:

- user capabilities
- system behavior
- validation
- state changes
- recovery behavior
- data preservation requirements
- error handling
- edge cases
- cross-feature rules

It does **not** define specific programming languages, frameworks, database technologies, or implementation code.

Those decisions belong to `PBOS_TECHNICAL_ARCHITECTURE.md`.

---

# 2. Functional Requirement Principles

All PBOS functionality must follow these principles.

## FR-P01 — Meaningful Action First

Every major feature must contribute to at least one of:

- meaningful action
- decision-cost reduction
- context preservation
- progress visibility
- recovery
- reflection
- long-term adaptation

Features that do not contribute meaningfully should not be added merely because they are common in productivity applications.

---

## FR-P02 — Minimum Necessary Interaction

The user should complete common actions with as few steps as reasonably possible.

The system must avoid unnecessary:

- confirmations
- forms
- navigation
- configuration
- popups
- data entry
- mandatory reflections

---

## FR-P03 — System Must Not Become the Work

PBOS must not require the user to continuously manage PBOS while they are supposed to be doing meaningful work.

The preferred flow is:

```text
Open PBOS
    ↓
Understand context
    ↓
Select / confirm Next Action
    ↓
Start
    ↓
Do the actual work
    ↓
Return only when needed
```

---

## FR-P04 — Preserve Reality

PBOS must record what actually happened.

It must not infer:

> "Timer finished = work completed."

It must distinguish between:

- planned
- started
- paused
- resumed
- completed
- partially completed
- abandoned
- interrupted

---

## FR-P05 — Recovery Is a First-Class Behavior

A failure, interruption, missed day, or incomplete session must not force the user to recreate the entire plan.

PBOS should always attempt to preserve enough information for recovery.

---

# 3. Application Startup

## FR-001 — Restore Application State

When PBOS opens, it should restore the latest valid application state.

Examples:

- active session
- paused session
- unfinished action
- pending recovery
- unsaved draft
- selected workspace/context

The user should not lose active work merely because the browser/app was closed.

---

## FR-002 — Detect Interrupted Active Session

If an active session existed when the application was unexpectedly closed, PBOS must detect this.

The system must not falsely record the session as completed.

The user should be offered an appropriate recovery action such as:

- Resume
- Continue from saved state
- End session
- Mark as interrupted

The exact UI will be defined later.

---

## FR-003 — Preserve Unsaved User Input

Where practical, important user input should be temporarily preserved so that accidental navigation or application closure does not unnecessarily destroy work.

---

# 4. Home / Today Experience

PBOS must provide a primary daily execution surface.

The primary screen should answer:

> **"What matters today?"**

and:

> **"What should I do next?"**

---

## FR-004 — Display Today's Meaningful Targets

The system must display the user's relevant Daily Targets.

The screen should distinguish between:

- important meaningful targets
- recurring habits
- optional items
- overdue or deferred items

The UI must avoid making every item appear equally important.

---

## FR-005 — Surface Current Next Action

If the user has a valid current Next Action, PBOS should make it easily accessible from the primary daily experience.

The system should expose enough context to answer:

- What is this?
- Why does it matter?
- Where does it belong?
- What should I do now?

---

## FR-006 — Handle Missing Next Action

If no Next Action exists for an important planned area, the system should not display an empty state that simply says there is nothing to do.

Instead, it should offer an appropriate next decision flow.

Example:

```text
No current Next Action
        ↓
Open Context
        ↓
Review relevant Roadmap
        ↓
Choose / create Next Action
```

---

# 5. Life Domain Management

## FR-007 — Create Life Domain

The user must be able to create a Life Domain.

Required information should be minimal.

---

## FR-008 — Edit Life Domain

The user must be able to edit:

- name
- description/context
- optional visual metadata

---

## FR-009 — Archive Life Domain

The user should be able to archive a Life Domain without immediately destroying its historical data.

Archived domains should not clutter the primary active interface.

---

## FR-010 — Restore Archived Domain

Archived domains should be recoverable.

---

# 6. Goal Management

## FR-011 — Create Goal

The user must be able to create a Goal inside a Life Domain.

A Goal should have enough information to communicate:

- desired direction/outcome
- relevant domain
- optional timeframe
- optional description

---

## FR-012 — Edit Goal

The user must be able to modify a Goal without destroying its associated Projects.

---

## FR-013 — Archive Goal

The user must be able to archive a Goal.

Archiving must preserve historical Projects and progress.

---

## FR-014 — Goal Progress

PBOS should provide a meaningful representation of Goal progress.

Progress must not rely only on:

> number of completed tasks.

Where possible, progress should be connected to meaningful Project/Roadmap progress.

---

# 7. Project Management

## FR-015 — Create Project

The user must be able to create a Project under a Goal.

A Project should support:

- title
- description
- desired outcome
- optional deadline
- status
- priority/context
- associated Goal

---

## FR-016 — Edit Project

The user must be able to modify Project information without losing its Roadmap or historical Sessions.

---

## FR-017 — Archive Project

Projects should be archivable rather than immediately deleted.

---

## FR-018 — Project Status

A Project must have a meaningful lifecycle.

At minimum, the architecture should support concepts such as:

```text
Planned
Active
Paused
Completed
Archived
```

Exact state transitions will be defined in the State Machine specification.

---

# 8. Roadmap — Mind-Map Model

## FR-019 — Roadmap as a Visual Mind-Map

A Project Roadmap must be represented as an interactive visual structure similar to a mind map.

It must not behave like a simple vertical checklist.

Conceptually:

```text
                    ┌── Node
                    │
Root / Project ─────┼── Node ─── Node
                    │
                    └── Node
                         │
                         ├── Node
                         └── Node
```

The Roadmap must support non-linear relationships.

---

## FR-020 — Roadmap Root

Every Roadmap should have a clear root representing the Project or primary Project objective.

---

## FR-021 — Create Node

The user must be able to create a Node.

A Node should support:

- title
- description
- desired outcome
- status
- parent/context
- optional dependency information
- optional Next Action

---

## FR-022 — Edit Node

The user must be able to edit a Node without destroying its execution history.

---

## FR-023 — Move Node

The user should be able to reposition or re-parent a Node when the Roadmap structure changes.

The system must preserve its identity and history when its visual position changes.

---

## FR-024 — Connect Nodes

The system must support meaningful relationships between Nodes.

At minimum, it should be possible to represent:

- parent/child relationships
- dependencies
- branches

The visual representation must distinguish these relationships where necessary.

---

## FR-025 — Branch Roadmap

The user must be able to create a branch from an existing Node when execution reveals an alternative path.

---

## FR-026 — Collapse and Expand Branches

The mind-map should allow users to collapse or expand branches.

This prevents large Projects from becoming visually overwhelming.

---

## FR-027 — Focus on Node

The user should be able to focus on a specific Node.

When focused, PBOS should show its relevant:

- context
- dependencies
- child/connected Nodes
- Next Actions
- Sessions
- progress

---

## FR-028 — Roadmap Zoom and Navigation

For large Projects, the Roadmap should support:

- zoom
- pan
- fit-to-view
- focus on current Node
- focus on active path

This is necessary because a Project mind-map can become large.

---

## FR-029 — Current Path Highlighting

The Roadmap should make the user's current meaningful path visually understandable.

At minimum:

```text
Project
   ↓
Current Node
   ↓
Current Next Action
```

should be easy to identify.

---

## FR-030 — Completed Nodes

Completed Nodes must remain visible as historical progress, but they should not visually compete with active Nodes.

---

## FR-031 — Roadmap Integrity

The system should prevent logically invalid Roadmap structures where possible.

Examples:

- invalid self-dependency
- impossible dependency cycle
- orphaned active Node
- broken parent relationship

The exact validation rules will be finalized later.

---

# 9. # Next Action Management

## FR-032 — Create Next Action

The user must be able to create a Next Action from relevant Project/Roadmap context.

A Next Action represents executable Project work.

---

## FR-033 — Next Action Clarity

A Next Action must contain enough information to begin the work without requiring the user to reconstruct the entire Project context.

---

## FR-034 — Next Action Must Be Actionable

PBOS should discourage vague Project Next Actions.

Example:

Weak:
"Work on PBOS"

Better:
"Implement Session pause/resume state handling"

The system should encourage clarity without forcing unnecessary micro-tasking.

---

## FR-035 — Start Next Action

Starting a Next Action should provide a direct path into a Session.

The user should not need to manually create a separate Session.

Conceptually:

Next Action
↓
Start
↓
Session

---

## FR-036 — Next Action May Require Multiple Sessions

A Next Action does not necessarily have to be completed within one Session.

One Next Action may have multiple Sessions.

Example:

Next Action
├── Session 1
├── Session 2
└── Session 3 → Completed

The system must preserve this execution history.

---

## FR-037 — Next Action Completion

A Next Action is completed only when the user determines that the intended work is complete.

Timer expiration must never automatically mark the Next Action as completed.

---

# 10. Next Decision System

## FR-038 — Provide Next Decision Flow

When the appropriate Next Action is unclear, PBOS should provide a decision flow instead of forcing the user to browse the entire system.

The flow should use relevant context such as:

- current Project
- current Node
- dependencies
- blockers
- previous Session
- current state

---

## FR-039 — Candidate Actions

Where possible, PBOS should surface a small number of relevant candidate actions instead of displaying the entire backlog.

---

## FR-040 — Avoid False Automation

PBOS must not pretend to know the user's intention when sufficient information does not exist.

When necessary, it should ask the user to decide.

---

# 11. Daily Target Management

## FR-041 — Create Daily Target

The user must be able to define meaningful Daily Targets.

A Daily Target should be concise and outcome-oriented.

---

## FR-042 — Link Daily Target to Context

A Daily Target should be linkable to:

- Goal
- Project
- Node
- Next Action
- Habit

depending on the target type.

---

## FR-043 — Daily Target Priority

The system should allow the user to distinguish critical meaningful targets from optional work.

The UI should not turn every task into an emergency.

---

## FR-044 — Adapt Daily Plan

If the original plan becomes unrealistic, the user must be able to adapt the Daily Target rather than simply mark the day as failed.

---

## FR-045 — Minimum Floor

The system must support a Minimum Floor for difficult days.

The user should be able to enter a recovery/minimum mode without deleting or invalidating the original plan.

---

# 12. # Habit Execution

## FR-046 — Create Habit

The user must be able to define a recurring behavior.

A Habit may define:

- normal Target
- Reduced level
- Minimum Floor
- frequency/schedule
- tracking method

---

## FR-047 — Daily Habit Execution

When a Habit is scheduled for a day, PBOS must represent that day's occurrence as a Daily Habit Execution.

The Daily Habit Execution is separate from the permanent Habit definition.

---

## FR-048 — Select Execution Level

A Daily Habit Execution may be performed at different levels.

Example:

Target: 45 minutes
Reduced: 20 minutes
Minimum: 5 minutes

The user normally aims for the Target level.

Reduced and Minimum levels exist as adaptive fallback options.

---

## FR-049 — Start Habit Session

Starting a Daily Habit Execution should directly start a Session.

The user should not need to create a Next Action first.

Habit Execution
↓
Start
↓
Session

---

## FR-050 — Record Actual Habit Execution

PBOS must record what actually happened.

Example:

Target = 45 min
Actual = 32 min

The system must preserve the actual execution rather than converting it into a simple completed/not-completed value.

---

# 13. # Session Management

## FR-051 — Session as Actual Execution

A Session represents an actual period of focused execution.

A Session may originate from:

- a Project Next Action
- a Daily Habit Execution
- another explicitly supported meaningful activity

A Session is not inherently tied to a Next Action.

---

## FR-052 — Start Session

The user must be able to start a Session directly from the relevant executable item.

For Project work:

Next Action → Start → Session

For Habit work:

Habit Execution → Start → Session

The user should not manually create a separate Session object during normal use.

---

## FR-053 — Session Context

When a Session starts, PBOS should automatically show the relevant context.

For Project work this may include:

- Project
- Roadmap Node
- Next Action
- intended outcome

For Habit work this may include:

- Habit
- today's execution level
- Target / Reduced / Minimum
- intended duration or quantity

The user should not need to manually reconstruct context.

---

## FR-054 — Session Timer

The system must support Session timing.

Where applicable, it should distinguish:

- target duration
- actual active duration
- paused duration
- total elapsed duration

---

## FR-055 — Pause Session

The user must be able to pause a Session while preserving its context and accumulated execution data.

---

## FR-056 — Resume Session

The user must be able to resume a paused Session without recreating it.

---

## FR-057 — Session Completion

The user must manually determine when a Session is complete.

Timer expiration must not automatically complete the underlying work.

---

## FR-058 — Partial Session

A Session may end before the intended target is reached.

The system must preserve the actual execution rather than treating the Session as nonexistent.

---

## FR-059 — Multiple Sessions

A single executable item may have multiple Sessions when the work requires multiple execution periods.

This applies to both:

- Project Next Actions
- Daily Habit Executions

The system must preserve the relationship between the executable item and all relevant Sessions.

---

# 14. Overtime

## FR-060 — Allow Overtime

When the target duration is reached, PBOS must allow the user to continue.

The system must not forcibly terminate meaningful work solely because the target duration was reached.

---

## FR-061 — Overtime Indicator

When the target is exceeded, the interface should clearly indicate that the Session is in overtime.

Example:

```text
Target: 60 min
Elapsed: 64 min
Overtime: +4 min
```

---

## FR-062 — Record Actual Duration

The system must record actual execution duration independently from target duration.

---

# 15. Interruption & Emergency Session

## FR-063 — Pause for Interruption

The user must have a quick way to indicate that the current Session was interrupted.

This action should require minimal interaction.

---

## FR-064 — Preserve Context Before Interruption

Before leaving a Session, PBOS should preserve the Context Snapshot.

---

## FR-065 — Emergency / Responsibility Session

The user should be able to record an unexpected responsibility without losing the original Session.

Conceptually:

```text
Original Session
      ↓
Pause
      ↓
Responsibility
      ↓
Return
      ↓
Resume Original Session
```

---

## FR-066 — Resume Previous Work

After the interruption, PBOS should provide a clear resume action.

The user should see:

> Where you were → What you were doing → What to do next.

---

## FR-067 — No Double Counting

Time spent in an Emergency / Responsibility Session must not accidentally be counted as focused work time for the original Session.

---

# 16. Recovery System

## FR-068 — Detect Recoverable Situations

PBOS should recognize situations where recovery may be useful.

Examples:

- missed Daily Target
- interrupted Session
- abandoned Session
- no Next Action
- late start
- incomplete planned work

---

## FR-069 — Recovery Entry Point

Recovery should be accessible without requiring the user to navigate through multiple screens.

---

## FR-070 — Recovery Should Reduce Decision Cost

The recovery flow should answer:

> "Given what happened, what is the smallest meaningful next step?"

---

## FR-071 — Preserve Previous Plan

Recovery must not destroy the original plan simply because it became unrealistic.

Historical intent and actual outcome should remain distinguishable.

---

## FR-072 — Recovery Does Not Equal Failure

The UI and data model should distinguish:

```text
Plan changed
```

from:

```text
User failed
```

A changed plan is a normal part of adaptive planning.

---

# 17. Craving / Inbox

## FR-073 — Quick Capture

The user must be able to capture a Craving/Idea quickly from anywhere appropriate.

The capture action should require minimal input.

---

## FR-074 — Capture Without Context Loss

Capturing a Craving must not navigate the user away from their current Session unnecessarily.

Preferred behavior:

```text
Current Work
   ↓
Quick Capture
   ↓
Save
   ↓
Return to Current Work
```

---

## FR-075 — Inbox Review

The user must be able to review captured items later.

---

## FR-076 — Classify Captured Item

During review, the user should be able to classify an item as:

- meaningful Project-related work
- new Next Action
- research
- future idea
- habit
- reference
- discard

The final categories may be adjusted during UX design.

---

## FR-077 — Convert Inbox Item

A captured item should be convertible into an appropriate PBOS object without requiring the user to retype the information unnecessarily.

---

## FR-078 — Discard Inbox Item

The user must be able to discard irrelevant captured items.

Discarding should not require lengthy confirmation.

---

# 18. Reflection

## FR-079 — Daily Reflection

PBOS should provide a low-friction reflection flow.

The current proposed questions are:

1. What happened today?
2. What did I learn / where did I get stuck?
3. What can I change tomorrow to become 1% better?

---

## FR-080 — Reflection Is Not Dependent on Success

The user should be able to reflect on:

- successful days
- low-output days
- disrupted days
- failed plans
- recovery days

---

## FR-081 — Reflection Should Feed Future Planning

Where appropriate, reflection should make relevant information available for future:

- planning
- recovery
- Next Action selection
- Roadmap decisions

---

# 19. History

## FR-082 — Preserve Historical Records

PBOS must preserve meaningful historical records.

History should include relevant:

- Sessions
- completed Next Actions
- Roadmap changes
- Habit activity
- Daily Targets
- reflections
- recovery events

---

## FR-083 — Distinguish Current vs Historical State

Historical records should not be silently rewritten when the current plan changes.

Example:

If a Roadmap Node changes later, previous Session records should still preserve the context that existed when the Session occurred.

---

# 20. Undo and Safe Modification

## FR-084 — Undo Destructive Actions

For high-risk actions such as:

- deleting
- moving
- merging
- bulk editing

PBOS should provide undo where practical.

---

## FR-085 — Prefer Archive Over Permanent Delete

Important objects should generally be archived rather than permanently deleted.

Permanent deletion should be reserved for cases where it is genuinely necessary.

---

## FR-086 — Prevent Accidental Data Loss

The system should protect important historical information from accidental user actions.

---

# 21. Search and Navigation

## FR-087 — Global Search

As the system grows, users must be able to search relevant:

- Goals
- Projects
- Nodes
- Next Actions
- Sessions
- Inbox items
- reflections

---

## FR-088 — Contextual Navigation

From an object, the user should be able to navigate to its relevant parent/children/context without losing their current position.

Example:

```text
Session
  ↓
Next Action
  ↓
Node
  ↓
Roadmap
  ↓
Project
  ↓
Goal
```

---

# 22. Notifications and Reminders

PBOS may provide reminders, but reminders must follow strict rules.

## FR-089 — Reminders Must Be Meaningful

Notifications should exist only when they help the user act.

They should not become another source of interruption.

---

## FR-090 — Avoid Notification Overload

The system should avoid repeated notifications for the same unresolved item unless the user explicitly requests them.

---

## FR-091 — No Shame-Based Notifications

The system must not use language that frames missed actions as moral failure.

Avoid concepts such as:

> "You failed again."

Prefer:

> "You can resume from here."

---

# 23. Data Reliability

## FR-092 — Persistent State

Important application state must persist across:

- refresh
- browser restart
- temporary disconnection
- accidental closure

where technically applicable.

---

## FR-093 — Consistent State

A completed action should not leave contradictory states elsewhere in the system.

Example:

If a Node is completed, PBOS must not continue presenting its Next Action as the current active action unless there is a valid reason.

---

## FR-094 — Atomic User Actions

Where a user action changes multiple related objects, the system should maintain consistency.

Example:

Completing a Next Action may update:

- Next Action status
- Node progress
- Session status
- Daily Target progress

These changes must not leave the system in a partially updated state.

---

# 24. Offline / Temporary Connectivity

If PBOS eventually uses network-dependent functionality, the architecture should support graceful temporary disconnection.

Core actions should not become unusable merely because connectivity is temporarily unavailable, where technically feasible.

The exact offline architecture will be defined later.

---

# 25. Accessibility

## FR-095 — Keyboard Accessibility

Core actions should be usable through keyboard interaction where applicable.

---

## FR-096 — Clear Interaction States

Interactive elements must provide understandable states such as:

- active
- focused
- disabled
- selected
- loading
- success
- error

---

## FR-097 — Readable Information

The interface must not rely only on color to communicate important state.

---

# 26. Error Handling

## FR-098 — Explain Errors Clearly

Errors should tell the user:

1. What happened.
2. Whether their data was saved.
3. What they can do next.

---

## FR-099 — Never Silently Lose User Work

If an operation fails, PBOS should not silently discard important user input.

---

# 27. Empty States

Empty states must be actionable.

Bad:

> "No projects."

Better:

> "No active projects yet. Create your first project or review your archived projects."

The empty state should provide the most relevant next action.

---

# 28. Loading States

Operations that require noticeable processing should provide a clear loading state.

The system should avoid leaving the user uncertain about whether an action was registered.

---

# 29. Validation Rules

PBOS should validate data before saving when necessary.

Examples:

- required names cannot be empty
- invalid relationships must be rejected
- impossible dependencies must be prevented
- invalid time values must be rejected
- duplicate/conflicting relationships should be handled
- invalid state transitions must be blocked

Validation should be helpful rather than punitive.

---

# 30. Adaptive Planning

PBOS should support changing plans without treating change as failure.

The system must allow:

```text
Original Plan
      ↓
New Information
      ↓
Plan Adjustment
      ↓
Continue
```

This is a core difference between PBOS and a rigid checklist application.

---

# 31. Contextual Recommendations

PBOS may recommend actions when sufficient context exists.

Examples:

- next available Node
- unresolved blocker
- unfinished Session
- pending recovery
- overdue reflection
- Inbox item requiring review

However:

> **Recommendations must remain suggestions unless the user explicitly enables automation.**

The system must not make major life/work decisions autonomously.

---

# 32. Automation Boundaries

PBOS may automate repetitive system operations such as:

- calculating duration
- updating derived progress
- saving state
- restoring paused sessions
- detecting incomplete sessions
- organizing historical records

PBOS should not automatically make high-impact semantic decisions such as:

- changing the user's Goal
- deleting a Project
- declaring a Project complete
- converting a craving into meaningful work
- deciding that the user's plan has failed

Human judgment remains important where meaning is involved.

---

# 33. Progress Calculation

Progress should be derived from meaningful structure rather than raw activity count whenever possible.

The system should distinguish between:

- activity
- completion
- meaningful progress

Example:

```text
10 small tasks completed
≠
10 meaningful units of progress
```

The exact progress algorithm will be defined in later technical/product design.

---

# 34. Event and History Principle

Important changes should be traceable.

Examples:

```text
Node created
Node moved
Node completed
Next Action created
Next Action completed
Session started
Session paused
Session resumed
Session completed
Session interrupted
Roadmap changed
Daily Target changed
Recovery started
Recovery completed
```

The technical architecture should later determine whether these are stored as explicit events, history records, audit entries, or another appropriate mechanism.

---

# 35. Cross-Feature Integrity Rules

## FR-100 — Parent Context Must Remain Valid

Objects must not silently lose their meaningful parent context.

---

## FR-101 — Completed Work Must Remain Historical

Completion should change active state, not erase historical evidence.

---

## FR-102 — Current Action Must Be Unambiguous

PBOS should avoid presenting multiple unrelated items as:

> "Your current Next Action"

unless the user explicitly chooses a multi-action mode.

---

## FR-103 — Focused Execution

PBOS should default to one active focused Session at a time.

This applies to actual focused execution, regardless of whether the Session originated from:

- Project work
- Habit execution
- another supported activity

Multiple paused or historical Sessions may exist.

---

## FR-104 — Session Execution Context

Every Session must have a clear execution context.

The context may originate from:

- a Project Next Action
- a Daily Habit Execution
- another explicitly supported meaningful activity

A Session must not be created as an unexplained timer record.

The user should normally start a Session through the executable item rather than manually constructing Session metadata.

---

## FR-105 — No Orphaned Execution

The system should avoid creating execution records that cannot be connected to meaningful context unless the user intentionally records an unplanned activity.

---

# 36. Recovery-First Edge Cases

PBOS must explicitly handle at least the following cases:

### Case A — User closes the app during a Session

Preserve recoverable state.

### Case B — Timer reaches target while work is almost complete

Allow overtime.

### Case C — User is interrupted

Pause and preserve context.

### Case D — User returns after a long interruption

Show recovery context rather than starting from a blank screen.

### Case E — User misses the entire day's plan

Offer recovery rather than treating the day as permanently lost.

### Case F — User has no clear Next Action

Open Next Decision.

### Case G — Current Next Action becomes blocked

Allow blocker handling or alternative action selection.

### Case H — User creates a new idea while working

Capture to Inbox and return to work.

### Case I — User creates an invalid Roadmap dependency

Prevent or clearly resolve the invalid relationship.

### Case J — User accidentally deletes important information

Provide undo/recovery where possible.

---

# 37. Core User Journey

The primary intended workflow is:

```text
Open PBOS
    ↓
Today / Current Context
    ↓
See meaningful target
    ↓
See / choose Next Action
    ↓
Review concise context
    ↓
Start Session
    ↓
Do actual work
    │
    ├── Craving?
    │      ↓
    │   Capture
    │      ↓
    │   Return
    │
    ├── Interrupted?
    │      ↓
    │   Pause
    │      ↓
    │   Responsibility
    │      ↓
    │   Resume
    │
    └── Target reached?
           ↓
       Continue if needed
           ↓
       Complete manually
           ↓
       Record outcome
           ↓
       Next Action / Recovery
```

---

# 38. End-of-Day Flow

The intended daily closing flow is:

```text
Review Day
    ↓
What happened?
    ↓
What did I learn?
    ↓
Where did I get stuck?
    ↓
What should change?
    ↓
Prepare relevant next context
    ↓
End
```

This should remain low-friction.

---

# 39. Pre-Planning Flow

For planned Career work:

```text
Previous Evening
      ↓
Review Project / Roadmap
      ↓
Identify current Node
      ↓
Select / define Next Action
      ↓
Set intended Session target
      ↓
Next Day
      ↓
Start with reduced decision cost
```

---

# 40. Functional Priority Levels

Not all requirements have equal implementation priority.

## P0 — Core

Without these PBOS cannot fulfill its primary purpose.

Examples:

- Projects
- Roadmap
- Nodes
- Next Actions
- Sessions
- Daily execution
- Pause/resume
- Context preservation
- Completion
- persistence
- recovery basics

---

## P1 — Important

Strongly improves the core experience.

Examples:

- mind-map navigation
- Next Decision
- Craving / Inbox
- Minimum Floor
- Daily Reflection
- Habit flexibility
- history
- undo
- search

---

## P2 — Enhancement

Useful but not required for the first usable version.

Examples:

- advanced analytics
- sophisticated recommendations
- advanced notifications
- advanced automation
- rich visualizations

---

# 41. Non-Functional Requirements That Affect Functionality

Although detailed non-functional requirements belong in the technical architecture, the following constraints are functionally important.

PBOS should be:

- fast to open
- fast to start a Session
- resilient to accidental closure
- safe against data loss
- responsive on common screen sizes
- accessible
- understandable without documentation
- low-friction
- visually calm
- resistant to feature overload

---

# 42. Product-Level Anti-Patterns

The following behaviors should be considered architecture violations unless explicitly justified.

### Anti-pattern 1

Adding a feature because another productivity app has it.

### Anti-pattern 2

Making every activity a task.

### Anti-pattern 3

Turning every meaningful action into a micro-checklist.

### Anti-pattern 4

Forcing the user to maintain a rigid schedule.

### Anti-pattern 5

Automatically declaring a Session complete because the timer ended.

### Anti-pattern 6

Using guilt or shame to increase compliance.

### Anti-pattern 7

Making the user repeatedly reconstruct context.

### Anti-pattern 8

Making the user spend more time managing PBOS than doing meaningful work.

### Anti-pattern 9

Using streaks as the primary measure of success.

### Anti-pattern 10

Adding notifications that interrupt meaningful work unnecessarily.

---

# 43. Functional Requirement Traceability

Each future implementation task should be traceable to one or more functional requirements.

Example:

```text
Implementation Task
       ↓
FR-055 — Resume Session
       ↓
Relevant UI
       ↓
Relevant application logic
       ↓
Relevant data model
       ↓
Tests
```

This prevents AI agents from implementing arbitrary features without understanding their purpose.

---

# 44. Requirements Change Rule

Functional requirements may evolve.

When a requirement changes:

1. Identify the affected requirement.
2. Explain why it changed.
3. Check dependent requirements.
4. Check affected domain concepts.
5. Check affected user flows.
6. Check affected technical architecture.
7. Update the relevant documentation.
8. Do not silently create conflicting behavior.

---

# 45. Definition of Functional Completeness

A feature should not be considered functionally complete merely because its UI exists.

A feature is functionally complete when:

```text
User Intent
    ↓
UI Interaction
    ↓
Validation
    ↓
Correct State Change
    ↓
Persistence
    ↓
Related State Updates
    ↓
Recovery / Error Handling
    ↓
Historical Record
    ↓
User Can Continue
```

The exact testing criteria will be defined in the development and testing documentation.

---

# 46. Step 3 Completion

The functional model now establishes that PBOS must support:

- adaptive daily planning
- Life Domains
- Goals
- Projects
- mind-map Roadmaps
- Nodes
- branches
- dependencies
- Next Actions
- Next Decision
- Daily Targets
- flexible Habits
- focused Sessions
- pause/resume
- Context Snapshots
- interruptions
- Emergency / Responsibility Sessions
- overtime
- manual completion
- partial completion
- recovery
- Minimum Floor
- Craving / Inbox
- Reflection
- history
- safe modification
- undo where appropriate
- search
- meaningful reminders
- persistence
- data integrity
- error recovery
- accessibility
- adaptive planning

---

# 47. Next Step

The next architecture stage is:

> **Step 4 — User Flows & State Machines**

Step 4 will define the exact state transitions for the most important PBOS processes.

At minimum:

```text
Session State Machine
Next Action State Machine
Node State Machine
Project State Machine
Daily Target State Machine
Habit State Machine
Craving / Inbox State Machine
Recovery State Machine
Interruption / Resume Flow
Roadmap Branch Flow
```

It will answer:

> **"At every possible point, what state is the system in, what can the user do next, and what is allowed or forbidden?"**

No implementation should assume state behavior that has not been defined or approved.
