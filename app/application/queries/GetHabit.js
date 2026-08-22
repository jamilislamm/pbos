/**
 * GetHabit Query
 * Retrieves a Habit by ID with today's execution (if any).
 *
 * Architecture: FR-046, UI_UX_ARCHITECTURE.md §18
 *
 * @param {Object} deps
 * @param {HabitRepository} deps.habitRepository
 * @param {HabitExecutionRepository} deps.habitExecutionRepository
 * @param {Object} deps.systemClock
 * @param {Object} input
 * @returns {Promise<{habit: Habit, todayExecution: HabitExecution|null}>}
 */
export async function getHabit(deps, input) {
  const { habitRepository, habitExecutionRepository, systemClock } = deps;

  if (!input.habitId) {
    throw new Error("Habit ID is required");
  }

  const habit = await habitRepository.findById(input.habitId);
  if (!habit) {
    throw new Error(`Habit not found: ${input.habitId}`);
  }

  const date = input.date || systemClock.todayDateString();
  const todayExecution = await habitExecutionRepository.findByHabitIdAndDate(
    habit.id,
    date,
  );

  return { habit, todayExecution };
}
