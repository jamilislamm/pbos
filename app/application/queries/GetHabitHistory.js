/**
 * GetHabitHistory Query
 * Retrieves execution history for a Habit.
 *
 * Architecture: UI_UX_ARCHITECTURE.md §19
 *
 * @param {Object} deps
 * @param {HabitExecutionRepository} deps.habitExecutionRepository
 * @param {Object} input
 * @returns {Promise<{executions: HabitExecution[], summary: Object}>}
 */
export async function getHabitHistory(deps, input) {
  const { habitExecutionRepository } = deps;

  if (!input.habitId) {
    throw new Error("Habit ID is required");
  }

  const executions = await habitExecutionRepository.findByHabitId(
    input.habitId,
  );

  // Sort by date descending
  executions.sort((a, b) => b.date.localeCompare(a.date));

  // Calculate summary
  const totalExecutions = executions.length;
  const completedExecutions = executions.filter(
    (e) => e.status === "completed",
  ).length;
  const partialExecutions = executions.filter(
    (e) => e.status === "partial",
  ).length;
  const skippedExecutions = executions.filter(
    (e) => e.status === "skipped",
  ).length;
  const missedExecutions = executions.filter(
    (e) => e.status === "missed",
  ).length;

  const summary = {
    totalExecutions,
    completedExecutions,
    partialExecutions,
    skippedExecutions,
    missedExecutions,
    completionRate:
      totalExecutions > 0
        ? Math.round((completedExecutions / totalExecutions) * 100)
        : 0,
  };

  return { executions, summary };
}
