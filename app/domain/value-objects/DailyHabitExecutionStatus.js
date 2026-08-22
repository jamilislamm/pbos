/**
 * DailyHabitExecutionStatus
 * Represents the states of a single day's Habit occurrence.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §8.1, §8.2
 */

export const DailyHabitExecutionStatus = Object.freeze({
  SCHEDULED: "scheduled",
  READY: "ready",
  IN_PROGRESS: "in_progress",
  PARTIAL: "partial",
  COMPLETED: "completed",
  SKIPPED: "skipped",
  MISSED: "missed",
});

export const DailyHabitExecutionTransitions = Object.freeze({
  [DailyHabitExecutionStatus.SCHEDULED]: [
    DailyHabitExecutionStatus.READY,
    DailyHabitExecutionStatus.SKIPPED,
    DailyHabitExecutionStatus.MISSED,
  ],
  [DailyHabitExecutionStatus.READY]: [
    DailyHabitExecutionStatus.IN_PROGRESS,
    DailyHabitExecutionStatus.SKIPPED,
    DailyHabitExecutionStatus.MISSED,
  ],
  [DailyHabitExecutionStatus.IN_PROGRESS]: [
    DailyHabitExecutionStatus.PARTIAL,
    DailyHabitExecutionStatus.COMPLETED,
  ],
  [DailyHabitExecutionStatus.PARTIAL]: [
    DailyHabitExecutionStatus.COMPLETED,
    DailyHabitExecutionStatus.SKIPPED,
    DailyHabitExecutionStatus.MISSED,
  ],
  [DailyHabitExecutionStatus.COMPLETED]: [],
  [DailyHabitExecutionStatus.SKIPPED]: [],
  [DailyHabitExecutionStatus.MISSED]: [],
});

export function isValidDailyHabitExecutionTransition(from, to) {
  if (!DailyHabitExecutionTransitions[from]) return false;
  return DailyHabitExecutionTransitions[from].includes(to);
}

export function isTerminalDailyHabitExecutionStatus(status) {
  return (
    status === DailyHabitExecutionStatus.COMPLETED ||
    status === DailyHabitExecutionStatus.SKIPPED ||
    status === DailyHabitExecutionStatus.MISSED
  );
}

export function isExecutableDailyHabitExecutionStatus(status) {
  return (
    status === DailyHabitExecutionStatus.SCHEDULED ||
    status === DailyHabitExecutionStatus.READY ||
    status === DailyHabitExecutionStatus.IN_PROGRESS ||
    status === DailyHabitExecutionStatus.PARTIAL
  );
}
