/**
 * CompleteHabitExecution Command
 * Completes a Session and evaluates the Habit Execution.
 *
 * Architecture: FR-050, APPLICATION_LOGIC.md §28, §34-40
 * USER_FLOWS_STATE_MACHINES.md §6, §8.2
 *
 * @param {Object} deps
 * @param {SessionRepository} deps.sessionRepository
 * @param {HabitExecutionRepository} deps.habitExecutionRepository
 * @param {Object} deps.systemClock
 * @param {Object} input
 * @returns {Promise<{session: Session, habitExecution: HabitExecution, evaluation: HabitCompletionResult}>}
 */
export async function completeHabitExecution(deps, input) {
  const { sessionRepository, habitExecutionRepository, systemClock } = deps;

  if (!input.sessionId) {
    throw new Error("Session ID is required");
  }

  const session = await sessionRepository.findById(input.sessionId);
  if (!session) {
    throw new Error(`Session not found: ${input.sessionId}`);
  }

  if (session.sourceType !== "habit_execution") {
    throw new Error("Session is not associated with a Habit Execution");
  }

  const now = systemClock.now();

  // Complete the Session
  session.complete(input.outcome || "", now);
  await sessionRepository.save(session);

  // Find and update the HabitExecution
  const habitExecution = await habitExecutionRepository.findById(
    session.sourceId,
  );
  if (!habitExecution) {
    throw new Error(`Habit Execution not found: ${session.sourceId}`);
  }

  // Add Session's actual duration to the execution
  const sessionDuration = session.getActiveDuration(now);
  habitExecution.addActualDuration(sessionDuration, now);

  // Evaluate completion
  const { evaluateHabitCompletion } =
    await import("../../domain/services/HabitCompletionEvaluator.js");
  const { ExecutionLevel } =
    await import("../../domain/value-objects/ExecutionLevel.js");
  const { DailyHabitExecutionStatus } =
    await import("../../domain/value-objects/DailyHabitExecutionStatus.js");

  const executionConfig = habitExecution.getExecutionConfig();
  const evaluation = evaluateHabitCompletion(
    habitExecution.getActualDuration(),
    habitExecution.selectedLevel,
    {
      targetDuration: executionConfig.target,
      reducedDuration: executionConfig.reduced,
      minimumDuration: executionConfig.minimum,
    },
  );

  // Transition HabitExecution status based on evaluation
  if (evaluation.satisfied) {
    habitExecution.transitionStatus(DailyHabitExecutionStatus.COMPLETED, now);
    habitExecution.markCompleted(now);
  } else {
    // If not satisfied, mark as PARTIAL (can continue later)
    if (habitExecution.status !== DailyHabitExecutionStatus.COMPLETED) {
      habitExecution.transitionStatus(DailyHabitExecutionStatus.PARTIAL, now);
    }
  }

  await habitExecutionRepository.save(habitExecution);

  return { session, habitExecution, evaluation };
}
