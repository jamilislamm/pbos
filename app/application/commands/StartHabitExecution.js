/**
 * StartHabitExecution Command
 * Starts a Session for a Daily Habit Execution.
 *
 * Architecture: FR-049, APPLICATION_LOGIC.md §18, §20-22
 *
 * @param {Object} deps
 * @param {HabitExecutionRepository} deps.habitExecutionRepository
 * @param {SessionRepository} deps.sessionRepository
 * @param {Object} deps.uuidGenerator
 * @param {Object} deps.systemClock
 * @param {Object} input
 * @returns {Promise<{session: Session, habitExecution: HabitExecution}>}
 */
export async function startHabitExecution(deps, input) {
  const {
    habitExecutionRepository,
    sessionRepository,
    uuidGenerator,
    systemClock,
  } = deps;

  if (!input.habitExecutionId) {
    throw new Error("Habit Execution ID is required");
  }

  const habitExecution = await habitExecutionRepository.findById(
    input.habitExecutionId,
  );
  if (!habitExecution) {
    throw new Error(`Habit Execution not found: ${input.habitExecutionId}`);
  }

  // Validate execution can be started
  const { DailyHabitExecutionStatus } =
    await import("../../domain/value-objects/DailyHabitExecutionStatus.js");
  const executableStatuses = [
    DailyHabitExecutionStatus.SCHEDULED,
    DailyHabitExecutionStatus.READY,
    DailyHabitExecutionStatus.PARTIAL,
  ];
  if (!executableStatuses.includes(habitExecution.status)) {
    throw new Error(
      `Cannot start Habit Execution with status: ${habitExecution.status}`,
    );
  }

  // Check no conflicting active Session
  const { validateNoConflictingActiveSession } =
    await import("../../domain/validators/SessionValidator.js");
  const activeSessions = await sessionRepository.findActive();
  const conflictCheck = validateNoConflictingActiveSession(activeSessions);
  if (!conflictCheck.valid) {
    throw new Error(conflictCheck.error);
  }

  const now = systemClock.now();

  // Transition execution to IN_PROGRESS
  if (habitExecution.status === DailyHabitExecutionStatus.SCHEDULED) {
    habitExecution.transitionStatus(DailyHabitExecutionStatus.READY, now);
  }
  habitExecution.transitionStatus(DailyHabitExecutionStatus.IN_PROGRESS, now);

  // Create and start Session
  const { Session } = await import("../../domain/entities/Session.js");
  const { SessionState } =
    await import("../../domain/value-objects/SessionState.js");

  const session = new Session({
    id: uuidGenerator.generate(),
    sourceType: "habit_execution",
    sourceId: habitExecution.id,
    state: SessionState.READY,
    createdAt: now,
  });

  session.start(now);

  await habitExecutionRepository.save(habitExecution);
  await sessionRepository.save(session);

  return { session, habitExecution };
}
