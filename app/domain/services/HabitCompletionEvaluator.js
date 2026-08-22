/**
 * HabitCompletionEvaluator
 * Evaluates whether a Daily Habit Execution satisfies its completion criteria.
 *
 * Architecture: APPLICATION_LOGIC.md §34-40
 * USER_FLOWS_STATE_MACHINES.md §8.2, §9, §11
 * DOMAIN_MODEL.md §14.5, §14.6, §14.8
 *
 * Principle: Actual execution is compared against the selected execution level.
 * The Habit's Target definition is NEVER overwritten by actual performance.
 */

import { Duration } from "../value-objects/Duration.js";
import { ExecutionLevel } from "../value-objects/ExecutionLevel.js";

/**
 * Result of evaluating a Habit execution.
 */
export class HabitCompletionResult {
  /**
   * @param {boolean} satisfied - Whether the execution meets criteria
   * @param {string} achievedLevel - Which level was achieved (target/reduced/minimum/none)
   * @param {Duration} actualDuration - Total actual execution time
   * @param {Duration} requiredDuration - The duration required for the achieved level
   * @param {string} [note] - Optional explanation
   */
  constructor(
    satisfied,
    achievedLevel,
    actualDuration,
    requiredDuration,
    note = "",
  ) {
    this.satisfied = satisfied;
    this.achievedLevel = achievedLevel;
    this.actualDuration = actualDuration;
    this.requiredDuration = requiredDuration;
    this.note = note;
    Object.freeze(this);
  }
}

/**
 * Evaluate a Habit execution against its configuration.
 *
 * Architecture: APPLICATION_LOGIC.md §35
 * "Habit completion must be determined from the Habit's defined rules."
 *
 * @param {Duration} actualDuration - Total actual execution time (aggregated across all Sessions)
 * @param {string} selectedLevel - The execution level the user chose (target/reduced/minimum)
 * @param {Object} habitConfig - The Habit's execution configuration
 * @param {Duration} habitConfig.targetDuration
 * @param {Duration} habitConfig.reducedDuration
 * @param {Duration} habitConfig.minimumDuration
 * @returns {HabitCompletionResult}
 */
export function evaluateHabitCompletion(
  actualDuration,
  selectedLevel,
  habitConfig,
) {
  const { targetDuration, reducedDuration, minimumDuration } = habitConfig;

  // Validate inputs
  if (!actualDuration || !habitConfig) {
    return new HabitCompletionResult(
      false,
      "none",
      actualDuration || Duration.zero(),
      Duration.zero(),
      "Missing execution data",
    );
  }

  // Check against selected level first
  // Architecture: APPLICATION_LOGIC.md §38 — "may satisfy the Reduced execution standard"
  let requiredDuration;
  switch (selectedLevel) {
    case ExecutionLevel.TARGET:
      requiredDuration = targetDuration;
      break;
    case ExecutionLevel.REDUCED:
      requiredDuration = reducedDuration;
      break;
    case ExecutionLevel.MINIMUM:
      requiredDuration = minimumDuration;
      break;
    default:
      requiredDuration = targetDuration;
  }

  // If actual meets or exceeds the selected level → satisfied at that level
  if (actualDuration.isGreaterThanOrEqual(requiredDuration)) {
    return new HabitCompletionResult(
      true,
      selectedLevel,
      actualDuration,
      requiredDuration,
      `Achieved ${selectedLevel} level`,
    );
  }

  // If not satisfied at selected level, check if it satisfies a lower level
  // This handles cases where user selected Target but only did Minimum amount
  // Architecture: APPLICATION_LOGIC.md §40 — "evaluate the result according to the Habit's completion policy"

  if (actualDuration.isGreaterThanOrEqual(minimumDuration)) {
    // At least minimum was achieved
    if (actualDuration.isGreaterThanOrEqual(reducedDuration)) {
      return new HabitCompletionResult(
        true,
        ExecutionLevel.REDUCED,
        actualDuration,
        reducedDuration,
        `Did not meet ${selectedLevel} but achieved Reduced level`,
      );
    }
    return new HabitCompletionResult(
      true,
      ExecutionLevel.MINIMUM,
      actualDuration,
      minimumDuration,
      `Did not meet ${selectedLevel} but achieved Minimum level`,
    );
  }

  // Nothing satisfied
  return new HabitCompletionResult(
    false,
    "none",
    actualDuration,
    requiredDuration,
    `Did not meet ${selectedLevel} or any lower level`,
  );
}

/**
 * Determine the highest execution level achieved by a given duration.
 * Useful for analytics and history display.
 *
 * @param {Duration} actualDuration
 * @param {Object} habitConfig
 * @param {Duration} habitConfig.targetDuration
 * @param {Duration} habitConfig.reducedDuration
 * @param {Duration} habitConfig.minimumDuration
 * @returns {string} - The highest level achieved
 */
export function getHighestAchievedLevel(actualDuration, habitConfig) {
  const { targetDuration, reducedDuration, minimumDuration } = habitConfig;

  if (actualDuration.isGreaterThanOrEqual(targetDuration)) {
    return ExecutionLevel.TARGET;
  }
  if (actualDuration.isGreaterThanOrEqual(reducedDuration)) {
    return ExecutionLevel.REDUCED;
  }
  if (actualDuration.isGreaterThanOrEqual(minimumDuration)) {
    return ExecutionLevel.MINIMUM;
  }
  return "none";
}
