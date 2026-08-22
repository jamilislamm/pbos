/**
 * UpdateHabit Command
 * Updates a Habit's configuration.
 *
 * Architecture: FR-046, APPLICATION_LOGIC.md §13
 * Configuration changes must not affect historical executions.
 *
 * @param {Object} deps
 * @param {HabitRepository} deps.habitRepository
 * @param {Object} deps.systemClock
 * @param {Object} input
 * @returns {Promise<Habit>}
 */
export async function updateHabit(deps, input) {
  const { habitRepository, systemClock } = deps;

  if (!input.habitId) {
    throw new Error("Habit ID is required");
  }

  const habit = await habitRepository.findById(input.habitId);
  if (!habit) {
    throw new Error(`Habit not found: ${input.habitId}`);
  }

  const now = systemClock.now();
  let updated = false;

  // Update title
  if (input.title !== undefined) {
    habit.rename(input.title, now);
    updated = true;
  }

  // Update description
  if (input.description !== undefined) {
    habit.updateDescription(input.description, now);
    updated = true;
  }

  // Update schedule
  if (input.schedule !== undefined) {
    habit._schedule = input.schedule;
    habit._updatedAt = now;
    updated = true;
  }

  // Update execution levels
  if (input.targetConfig || input.reducedConfig || input.minimumConfig) {
    const { HabitLevelConfig } = await import("../../domain/entities/Habit.js");
    const { Duration } = await import("../../domain/value-objects/Duration.js");

    const configUpdate = {};
    if (input.targetConfig) {
      configUpdate.targetConfig = new HabitLevelConfig({
        duration:
          input.targetConfig.duration instanceof Duration
            ? input.targetConfig.duration
            : Duration.fromMinutes(input.targetConfig.durationMinutes),
        description: input.targetConfig.description || "",
      });
    }
    if (input.reducedConfig) {
      configUpdate.reducedConfig = new HabitLevelConfig({
        duration:
          input.reducedConfig.duration instanceof Duration
            ? input.reducedConfig.duration
            : Duration.fromMinutes(input.reducedConfig.durationMinutes),
        description: input.reducedConfig.description || "",
      });
    }
    if (input.minimumConfig) {
      configUpdate.minimumConfig = new HabitLevelConfig({
        duration:
          input.minimumConfig.duration instanceof Duration
            ? input.minimumConfig.duration
            : Duration.fromMinutes(input.minimumConfig.durationMinutes),
        description: input.minimumConfig.description || "",
      });
    }
    habit.updateConfig(configUpdate, now);
    updated = true;
  }

  if (updated) {
    await habitRepository.save(habit);
  }

  return habit;
}
