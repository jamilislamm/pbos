/**
 * CreateNextAction Command
 * Creates a new Next Action for a Project.
 *
 * Architecture: FR-006, FR-019-021
 */

export async function createNextAction(deps, input) {
  const { nextActionRepository, uuidGenerator, systemClock } = deps;

  if (!input.projectId) {
    throw new Error("Project ID is required");
  }
  if (
    !input.title ||
    typeof input.title !== "string" ||
    input.title.trim().length === 0
  ) {
    throw new Error("Next Action title is required");
  }

  const { NextAction } = await import("../../domain/entities/NextAction.js");

  const nextAction = new NextAction({
    id: uuidGenerator.generate(),
    projectId: input.projectId,
    nodeId: input.nodeId || null,
    title: input.title.trim(),
    description: (input.description || "").trim(),
    status: "available",
    createdAt: systemClock.now(),
  });

  await nextActionRepository.save(nextAction);
  return nextAction;
}
