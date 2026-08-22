/**
 * SessionValidator
 * Validates Session state transitions and business rules.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §5
 * APPLICATION_LOGIC.md §21-24
 */

import {
  SessionState,
  isValidSessionTransition,
  isActiveSessionState,
  isTerminalSessionState,
} from "../value-objects/SessionState.js";

/**
 * Validate a Session state transition.
 * Architecture: APPLICATION_LOGIC.md §24
 * @param {string} fromState
 * @param {string} toState
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionTransition(fromState, toState) {
  if (!isValidSessionTransition(fromState, toState)) {
    return {
      valid: false,
      error: `Invalid transition: ${fromState} → ${toState}`,
    };
  }
  return { valid: true };
}

/**
 * Validate that a Session can be started.
 * Architecture: APPLICATION_LOGIC.md §21
 * @param {string} currentState
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionStart(currentState) {
  if (currentState !== SessionState.READY) {
    return {
      valid: false,
      error: `Cannot start Session from ${currentState}. Must be ${SessionState.READY}.`,
    };
  }
  return { valid: true };
}

/**
 * Validate that a Session can be paused.
 * @param {string} currentState
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionPause(currentState) {
  if (currentState !== SessionState.RUNNING) {
    return {
      valid: false,
      error: `Cannot pause Session from ${currentState}. Must be ${SessionState.RUNNING}.`,
    };
  }
  return { valid: true };
}

/**
 * Validate that a Session can be resumed.
 * @param {string} currentState
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionResume(currentState) {
  if (
    currentState !== SessionState.PAUSED &&
    currentState !== SessionState.INTERRUPTED
  ) {
    return {
      valid: false,
      error: `Cannot resume Session from ${currentState}. Must be ${SessionState.PAUSED} or ${SessionState.INTERRUPTED}.`,
    };
  }
  return { valid: true };
}

/**
 * Validate that a Session can be completed.
 * Architecture: APPLICATION_LOGIC.md §28
 * @param {string} currentState
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionComplete(currentState) {
  if (
    currentState !== SessionState.RUNNING &&
    currentState !== SessionState.PAUSED
  ) {
    return {
      valid: false,
      error: `Cannot complete Session from ${currentState}. Must be ${SessionState.RUNNING} or ${SessionState.PAUSED}.`,
    };
  }
  return { valid: true };
}

/**
 * Validate that a Session can be abandoned.
 * Architecture: APPLICATION_LOGIC.md §29
 * @param {string} currentState
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionAbandon(currentState) {
  if (
    currentState !== SessionState.RUNNING &&
    currentState !== SessionState.PAUSED &&
    currentState !== SessionState.INTERRUPTED
  ) {
    return {
      valid: false,
      error: `Cannot abandon Session from ${currentState}.`,
    };
  }
  return { valid: true };
}

/**
 * Validate that a Session can be interrupted.
 * @param {string} currentState
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionInterrupt(currentState) {
  if (currentState !== SessionState.RUNNING) {
    return {
      valid: false,
      error: `Cannot interrupt Session from ${currentState}. Must be ${SessionState.RUNNING}.`,
    };
  }
  return { valid: true };
}

/**
 * Validate the one-active-Session rule.
 * Architecture: USER_FLOWS_STATE_MACHINES.md §12
 * APPLICATION_LOGIC.md §20
 * @param {Array<{state: string}>} existingSessions
 * @returns {{valid: boolean, error?: string}}
 */
export function validateNoConflictingActiveSession(existingSessions) {
  const active = existingSessions.filter((s) => isActiveSessionState(s.state));
  if (active.length > 0) {
    return {
      valid: false,
      error: `An active Session already exists. Finish, pause, or abandon it before starting a new one.`,
    };
  }
  return { valid: true };
}

/**
 * Validate that a Session source is executable.
 * Architecture: APPLICATION_LOGIC.md §21
 * @param {{exists: boolean, executable: boolean, cancelled?: boolean, archived?: boolean}} sourceInfo
 * @returns {{valid: boolean, error?: string}}
 */
export function validateSessionSource(sourceInfo) {
  if (!sourceInfo.exists) {
    return { valid: false, error: "Session source does not exist" };
  }
  if (sourceInfo.cancelled) {
    return { valid: false, error: "Session source has been cancelled" };
  }
  if (sourceInfo.archived) {
    return { valid: false, error: "Session source has been archived" };
  }
  if (!sourceInfo.executable) {
    return {
      valid: false,
      error: "Session source is not currently executable",
    };
  }
  return { valid: true };
}
