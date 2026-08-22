/**
 * CreateProject Command
 * Creates a new Project under a Goal.
 *
 * Architecture: FR-015
 */

export async function createProject(deps, input) {
  const { projectRepository, uuidGenerator, systemClock } = deps;

  if (
    !input.title ||
    typeof input.title !== "string" ||
    input.title.trim().length === 0
  ) {
    throw new Error("Project title is required");
  }

  const { Project } = await import("../../domain/entities/Project.js");

  const project = new Project({
    id: uuidGenerator.generate(),
    title: input.title.trim(),
    description: (input.description || "").trim(),
    status: "planned",
    createdAt: systemClock.now(),
  });

  await projectRepository.save(project);
  return project;
}
