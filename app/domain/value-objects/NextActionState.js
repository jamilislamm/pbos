/**
 * NextActionState
 * Represents the lifecycle states of a Next Action.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §4.1, §4.2, §4.3, §4.4, §4.5, §4.6
 */

export const NextActionState = Object.freeze({
  AVAILABLE: "available",
  ACTIVE: "active",
  BLOCKED: "blocked",
  DEFERRED: "deferred",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const NextActionTransitions = Object.freeze({
  [NextActionState.AVAILABLE]: [
    NextActionState.ACTIVE,
    NextActionState.DEFERRED,
    NextActionState.CANCELLED,
  ],
  [NextActionState.ACTIVE]: [
    NextActionState.BLOCKED,
    NextActionState.COMPLETED,
    NextActionState.CANCELLED,
  ],
  [NextActionState.BLOCKED]: [
    NextActionState.AVAILABLE,
    NextActionState.ACTIVE,
    NextActionState.CANCELLED,
  ],
  [NextActionState.DEFERRED]: [
    NextActionState.AVAILABLE,
    NextActionState.CANCELLED,
  ],
  [NextActionState.COMPLETED]: [], // Reopening requires explicit mechanism
  [NextActionState.CANCELLED]: [], // Reactivation requires explicit mechanism
});

export function isValidNextActionTransition(from, to) {
  if (!NextActionTransitions[from]) return false;
  return NextActionTransitions[from].includes(to);
}

export function getValidNextNextActionStates(state) {
  return NextActionTransitions[state] ? [...NextActionTransitions[state]] : [];
}

export function isExecutableNextActionState(state) {
  return (
    state === NextActionState.AVAILABLE || state === NextActionState.ACTIVE
  );
}
