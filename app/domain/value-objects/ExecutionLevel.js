/**
 * ExecutionLevel
 * Represents the adaptive execution levels for a Habit.
 *
 * Architecture: DOMAIN_MODEL.md §14.5, §14.6
 * APPLICATION_LOGIC.md §9, §10, §11, §12
 *
 * Invariant: Target is the normal desired level. Reduced and Minimum are
 * adaptive fallbacks. The Habit definition itself never changes.
 */

export const ExecutionLevel = Object.freeze({
  TARGET: "target",
  REDUCED: "reduced",
  MINIMUM: "minimum",
});

/**
 * Ordered from highest to lowest ambition.
 * Used for fallback logic.
 */
export const ExecutionLevelPriority = Object.freeze([
  ExecutionLevel.TARGET,
  ExecutionLevel.REDUCED,
  ExecutionLevel.MINIMUM,
]);

/**
 * Get the next lower execution level.
 * @param {string} level
 * @returns {string|null} - Next lower level, or null if already minimum
 */
export function getLowerExecutionLevel(level) {
  const idx = ExecutionLevelPriority.indexOf(level);
  if (idx === -1 || idx >= ExecutionLevelPriority.length - 1) return null;
  return ExecutionLevelPriority[idx + 1];
}

/**
 * Get the display label for an execution level.
 * @param {string} level
 * @returns {string}
 */
export function getExecutionLevelLabel(level) {
  const labels = {
    [ExecutionLevel.TARGET]: "Target",
    [ExecutionLevel.REDUCED]: "Reduced",
    [ExecutionLevel.MINIMUM]: "Minimum",
  };
  return labels[level] || level;
}
