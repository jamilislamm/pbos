/**
 * UpdateProject Command
 * Updates a Project's information.
 *
 * Architecture: FR-016
 */

export async function updateProject(deps, input) {
  const { projectRepository, systemClock } = deps;

  if (!input.projectId) {
    throw new Error("Project ID is required");
  }

  const project = await projectRepository.findById(input.projectId);
  if (!project) {
    throw new Error(`Project not found: ${input.projectId}`);
  }

  const now = systemClock.now();
  let updated = false;

  if (input.title !== undefined) {
    project.rename(input.title, now);
    updated = true;
  }

  if (input.description !== undefined) {
    project.updateDescription(input.description, now);
    updated = true;
  }

  if (updated) {
    await projectRepository.save(project);
  }

  return project;
}
