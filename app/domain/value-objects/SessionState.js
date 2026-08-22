/**
 * SessionState
 * Represents the lifecycle states of a focused execution Session.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §5.1, §5.2, §5.3, §5.4, §5.5
 * Invariant: Only valid state transitions are permitted.
 */

export const SessionState = Object.freeze({
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused",
  INTERRUPTED: "interrupted",
  COMPLETED: "completed",
  ABANDONED: "abandoned",
});

/**
 * Valid state transitions.
 * Architecture: APPLICATION_LOGIC.md §24
 */
export const SessionTransitions = Object.freeze({
  [SessionState.READY]: [SessionState.RUNNING],
  [SessionState.RUNNING]: [
    SessionState.PAUSED,
    SessionState.INTERRUPTED,
    SessionState.COMPLETED,
  ],
  [SessionState.PAUSED]: [
    SessionState.RUNNING,
    SessionState.INTERRUPTED,
    SessionState.ABANDONED,
  ],
  [SessionState.INTERRUPTED]: [SessionState.RUNNING, SessionState.ABANDONED],
  [SessionState.COMPLETED]: [],
  [SessionState.ABANDONED]: [],
});

/**
 * Check if a state transition is valid.
 * @param {string} from - Current state
 * @param {string} to - Target state
 * @returns {boolean}
 */
export function isValidSessionTransition(from, to) {
  if (!SessionTransitions[from]) return false;
  return SessionTransitions[from].includes(to);
}

/**
 * Get all valid next states from a given state.
 * @param {string} state
 * @returns {string[]}
 */
export function getValidNextSessionStates(state) {
  return SessionTransitions[state] ? [...SessionTransitions[state]] : [];
}

/**
 * Check if a Session state represents an active (non-terminal) state.
 * @param {string} state
 * @returns {boolean}
 */
export function isActiveSessionState(state) {
  return (
    state === SessionState.RUNNING ||
    state === SessionState.PAUSED ||
    state === SessionState.INTERRUPTED
  );
}

/**
 * Check if a Session state represents a terminal state.
 * @param {string} state
 * @returns {boolean}
 */
export function isTerminalSessionState(state) {
  return state === SessionState.COMPLETED || state === SessionState.ABANDONED;
}
