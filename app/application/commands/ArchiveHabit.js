/**
 * ArchiveHabit Command
 * Archives a Habit definition.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §7.1
 * Historical executions must remain available after archiving.
 *
 * @param {Object} deps
 * @param {HabitRepository} deps.habitRepository
 * @param {Object} deps.systemClock
 * @param {Object} input
 * @returns {Promise<Habit>}
 */
export async function archiveHabit(deps, input) {
  const { habitRepository, systemClock } = deps;

  if (!input.habitId) {
    throw new Error("Habit ID is required");
  }

  const habit = await habitRepository.findById(input.habitId);
  if (!habit) {
    throw new Error(`Habit not found: ${input.habitId}`);
  }

  const { HabitStatus } =
    await import("../../domain/value-objects/HabitStatus.js");

  // Only archive if currently active or paused
  if (habit.status === HabitStatus.ARCHIVED) {
    throw new Error("Habit is already archived");
  }

  habit.transitionStatus(HabitStatus.ARCHIVED, systemClock.now());
  await habitRepository.save(habit);

  return habit;
}
