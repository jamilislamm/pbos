# `PBOS_TESTING.md`

# Step 10 — Testing, Validation & Definition of Done

**Version:** 1.0  
**Status:** Initial Specification

---

## 1. Purpose

A development phase is complete only when the feature is:

```text
Implemented
+
Tested
+
Integrated
+
Validated
+
Documented
```

Code existing in the repository does **not** mean the phase is complete.

---

# 2. Testing Levels

PBOS should use multiple levels of validation.

```text
Unit Tests
    ↓
Domain Tests
    ↓
Integration Tests
    ↓
User Flow Tests
    ↓
UI / UX Validation
    ↓
Regression Tests
```

---

# 3. Unit Tests

Test isolated logic such as:

- calculations
- state transitions
- time handling
- Habit progress
- Target / Reduced / Minimum logic
- Session duration
- validation rules

---

# 4. Domain Tests

Verify that business rules remain correct.

Examples:

```text
One Habit
→ one daily execution

One daily Habit execution
→ may contain multiple Sessions

Next Action
→ may be worked on through multiple Sessions

Habit relationships
→ do not create structural dependency
```

---

# 5. Session Tests

At minimum test:

```text
Start
Pause
Resume
Finish
Interrupted Session
Multiple Sessions
Session history
```

Also verify timer accuracy and persistence.

---

# 6. Habit Tests

Test:

```text
Target execution
Reduced execution
Minimum execution
Missed execution
Partial execution
Multiple Sessions
Daily reset/new execution
Historical preservation
```

The system must not accidentally treat:

```text
Reduced
```

as:

```text
Target
```

or:

```text
Minimum
```

as:

```text
Missed
```

unless the architecture explicitly defines such behavior.

---

# 7. Project / Next Action Tests

Test:

```text
Create Project
Create Next Action
Start Next Action
Pause work
Continue later
Complete Next Action
Multiple Sessions
```

Stopping a Session must not automatically mean that the Next Action is complete.

---

# 8. Cross-Domain Relationship Tests

Verify that:

- one Habit can support multiple Goals
- one Habit can influence multiple Life Domains
- relationships are many-to-many where defined
- relationships do not block execution
- deleting/removing a relationship does not corrupt the Habit
- analytics do not claim unsupported causality

---

# 9. Persistence Tests

Verify:

```text
Create
Read
Update
Delete / Archive
Restart application
Historical retrieval
Data integrity
```

Important execution records must survive normal application restart.

---

# 10. User Flow Tests

Test complete real-world flows.

### Normal Habit Day

```text
Open Today
→ Start Habit
→ Select Target
→ Session
→ Finish
→ Reflection
→ Today updated
```

### Difficult Day

```text
Open Today
→ Start Habit
→ Select Reduced
→ Session
→ Finish
→ Correct progress
```

### Project Work

```text
Project
→ Next Action
→ Start
→ Session
→ Finish
→ Continue / Complete
```

### Recovery

```text
Missed Habit
→ Recovery
→ Select execution level
→ Start
→ Complete
```

---

# 11. Regression Testing

After every significant change, previously working functionality must be checked.

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

# 12. Edge Cases

At minimum validate:

- application closed during Session
- browser refresh during Session
- duplicate start attempts
- multiple Sessions
- zero-duration/invalid duration
- incomplete Session
- missed Habit
- deleted/archived related object
- changed Habit schedule
- changed Project state
- stale UI state
- persistence failure

---

# 13. UX Validation

Verify that the user can:

- understand what to do
- start work quickly
- return to an active Session
- understand Habit progress
- distinguish Target/Reduced/Minimum
- understand whether work is complete
- recover after interruption
- find history
- navigate without learning the internal architecture

---

# 14. Definition of Done

A feature is **Done** only when all are true:

```text
[ ] Requirements implemented
[ ] Architecture respected
[ ] Domain rules tested
[ ] Persistence tested
[ ] Main user flow tested
[ ] Edge cases considered
[ ] Regression tests pass
[ ] UI states implemented
[ ] Accessibility considered
[ ] No known critical bug
[ ] Documentation updated
[ ] Git state clean
```

---

# 15. Phase-Level Definition of Done

A phase cannot be marked complete merely because:

```text
"The code runs."
```

It must satisfy:

```text
Feature works
+
Feature survives realistic usage
+
Existing features still work
+
Architecture remains consistent
```

---

# 16. Critical Failure Rule

If a test reveals a contradiction in the architecture, do not simply patch the symptom.

Determine whether the problem is:

```text
Implementation bug
OR
Architecture problem
```

If it is architectural, update the architecture documentation before continuing.

---

# 17. Final Product Definition of Done

PBOS is ready for initial release when:

- core daily flows work reliably
- Habits work correctly
- Sessions work correctly
- Next Actions work correctly
- Today works as the operational center
- persistence is reliable
- history is trustworthy
- recovery works
- major UX flows are usable on desktop and mobile
- critical tests pass
- no known critical data-loss issue exists

---
