/**
 * CreateHabitExecution Command
 * Creates today's Daily Habit Execution for a Habit.
 *
 * Architecture: FR-047, APPLICATION_LOGIC.md §8, §14-16
 * The Daily Habit Execution snapshots the Habit's current config.
 *
 * @param {Object} deps
 * @param {HabitRepository} deps.habitRepository
 * @param {HabitExecutionRepository} deps.habitExecutionRepository
 * @param {Object} deps.uuidGenerator
 * @param {Object} deps.systemClock
 * @param {Object} input
 * @returns {Promise<HabitExecution>}
 */
export async function createHabitExecution(deps, input) {
  const {
    habitRepository,
    habitExecutionRepository,
    uuidGenerator,
    systemClock,
  } = deps;

  if (!input.habitId) {
    throw new Error("Habit ID is required");
  }

  const habit = await habitRepository.findById(input.habitId);
  if (!habit) {
    throw new Error(`Habit not found: ${input.habitId}`);
  }

  const { HabitStatus } =
    await import("../../domain/value-objects/HabitStatus.js");
  if (habit.status !== HabitStatus.ACTIVE) {
    throw new Error(
      `Cannot create execution for Habit with status: ${habit.status}`,
    );
  }

  const date = input.date || systemClock.todayDateString();

  // Check if execution already exists for this habit+date
  const existing = await habitExecutionRepository.findByHabitIdAndDate(
    habit.id,
    date,
  );
  if (existing) {
    return existing;
  }

  const now = systemClock.now();

  const { HabitExecution } =
    await import("../../domain/entities/HabitExecution.js");
  const { DailyHabitExecutionStatus } =
    await import("../../domain/value-objects/DailyHabitExecutionStatus.js");

  const execution = new HabitExecution({
    id: uuidGenerator.generate(),
    habitId: habit.id,
    date: date,
    status: DailyHabitExecutionStatus.READY,
    selectedLevel: "target",
    targetAtExecutionMs: habit.targetConfig.duration.milliseconds,
    reducedAtExecutionMs: habit.reducedConfig.duration.milliseconds,
    minimumAtExecutionMs: habit.minimumConfig.duration.milliseconds,
    actualDurationMs: 0,
    createdAt: now,
  });

  await habitExecutionRepository.save(execution);
  return execution;
}
