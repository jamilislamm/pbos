/**
 * GetProject Query
 * Retrieves a Project with its Next Actions.
 *
 * Architecture: FR-015-018
 */

export async function getProject(deps, input) {
  const { projectRepository, nextActionRepository } = deps;

  if (!input.projectId) {
    throw new Error("Project ID is required");
  }

  const project = await projectRepository.findById(input.projectId);
  if (!project) {
    throw new Error(`Project not found: ${input.projectId}`);
  }

  const nextActions = await nextActionRepository.findByProjectId(project.id);

  return { project, nextActions };
}
