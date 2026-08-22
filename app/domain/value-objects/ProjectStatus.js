/**
 * ProjectStatus
 * Represents the lifecycle states of a Project.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §19
 */

export const ProjectStatus = Object.freeze({
  PLANNED: "planned",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  ARCHIVED: "archived",
});

export const ProjectStatusTransitions = Object.freeze({
  [ProjectStatus.PLANNED]: [ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED],
  [ProjectStatus.ACTIVE]: [
    ProjectStatus.PAUSED,
    ProjectStatus.COMPLETED,
    ProjectStatus.ARCHIVED,
  ],
  [ProjectStatus.PAUSED]: [ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED],
  [ProjectStatus.COMPLETED]: [ProjectStatus.ARCHIVED],
  [ProjectStatus.ARCHIVED]: [], // Restoration requires explicit mechanism
});

export function isValidProjectStatusTransition(from, to) {
  if (!ProjectStatusTransitions[from]) return false;
  return ProjectStatusTransitions[from].includes(to);
}

export function isActiveProjectStatus(status) {
  return status === ProjectStatus.ACTIVE || status === ProjectStatus.PAUSED;
}
