/**
 * NodeState
 * Represents the lifecycle states of a Roadmap Node.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §18
 */

export const NodeState = Object.freeze({
  PLANNED: "planned",
  ACTIVE: "active",
  BLOCKED: "blocked",
  COMPLETED: "completed",
  ARCHIVED: "archived",
});

export const NodeTransitions = Object.freeze({
  [NodeState.PLANNED]: [NodeState.ACTIVE, NodeState.ARCHIVED],
  [NodeState.ACTIVE]: [
    NodeState.BLOCKED,
    NodeState.COMPLETED,
    NodeState.ARCHIVED,
  ],
  [NodeState.BLOCKED]: [NodeState.ACTIVE, NodeState.ARCHIVED],
  [NodeState.COMPLETED]: [NodeState.ARCHIVED],
  [NodeState.ARCHIVED]: [], // Restoration requires explicit mechanism
});

export function isValidNodeTransition(from, to) {
  if (!NodeTransitions[from]) return false;
  return NodeTransitions[from].includes(to);
}

export function getValidNextNodeStates(state) {
  return NodeTransitions[state] ? [...NodeTransitions[state]] : [];
}
