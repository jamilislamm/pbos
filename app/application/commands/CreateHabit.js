/**
 * CreateHabit Command
 * Creates a new Habit definition with Target/Reduced/Minimum levels.
 *
 * Architecture: FR-046, APPLICATION_LOGIC.md §9-14
 *
 * @param {Object} deps - Dependencies
 * @param {HabitRepository} deps.habitRepository
 * @param {Object} deps.uuidGenerator
 * @param {Object} deps.systemClock
 * @param {Object} input - Command input
 * @returns {Promise<Habit>}
 */
export async function createHabit(deps, input) {
  const { habitRepository, uuidGenerator, systemClock } = deps;

  // Validation
  if (
    !input.title ||
    typeof input.title !== "string" ||
    input.title.trim().length === 0
  ) {
    throw new Error("Habit title is required");
  }

  const targetMinutes = input.targetDurationMinutes ?? input.targetMinutes;
  const reducedMinutes = input.reducedDurationMinutes ?? input.reducedMinutes;
  const minimumMinutes = input.minimumDurationMinutes ?? input.minimumMinutes;

  if (typeof targetMinutes !== "number" || targetMinutes <= 0) {
    throw new Error("Target duration must be a positive number of minutes");
  }
  if (typeof reducedMinutes !== "number" || reducedMinutes <= 0) {
    throw new Error("Reduced duration must be a positive number of minutes");
  }
  if (typeof minimumMinutes !== "number" || minimumMinutes <= 0) {
    throw new Error("Minimum duration must be a positive number of minutes");
  }

  // Duration ordering validation: target >= reduced >= minimum
  if (reducedMinutes > targetMinutes) {
    throw new Error("Reduced duration cannot exceed Target duration");
  }
  if (minimumMinutes > reducedMinutes) {
    throw new Error("Minimum duration cannot exceed Reduced duration");
  }

  const now = systemClock.now();

  // Import here to avoid circular dependency issues at module load time
  const { Habit, HabitLevelConfig } =
    await import("../../domain/entities/Habit.js");
  const { Duration } = await import("../../domain/value-objects/Duration.js");

  const habit = new Habit({
    id: uuidGenerator.generate(),
    title: input.title.trim(),
    description: (input.description || "").trim(),
    status: "active",
    schedule: input.schedule || { type: "daily" },
    targetConfig: new HabitLevelConfig({
      duration: Duration.fromMinutes(targetMinutes),
      description: (input.targetDescription || "").trim(),
    }),
    reducedConfig: new HabitLevelConfig({
      duration: Duration.fromMinutes(reducedMinutes),
      description: (input.reducedDescription || "").trim(),
    }),
    minimumConfig: new HabitLevelConfig({
      duration: Duration.fromMinutes(minimumMinutes),
      description: (input.minimumDescription || "").trim(),
    }),
    createdAt: now,
  });

  await habitRepository.save(habit);
  return habit;
}
