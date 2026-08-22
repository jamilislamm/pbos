/**
 * HabitStatus
 * Represents the lifecycle states of a Habit definition.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §7.1
 */

export const HabitStatus = Object.freeze({
  ACTIVE: "active",
  PAUSED: "paused",
  ARCHIVED: "archived",
});

export const HabitStatusTransitions = Object.freeze({
  [HabitStatus.ACTIVE]: [HabitStatus.PAUSED, HabitStatus.ARCHIVED],
  [HabitStatus.PAUSED]: [HabitStatus.ACTIVE, HabitStatus.ARCHIVED],
  [HabitStatus.ARCHIVED]: [], // Restoration requires explicit mechanism
});

export function isValidHabitStatusTransition(from, to) {
  if (!HabitStatusTransitions[from]) return false;
  return HabitStatusTransitions[from].includes(to);
}

export function isExecutableHabitStatus(status) {
  return status === HabitStatus.ACTIVE;
}
