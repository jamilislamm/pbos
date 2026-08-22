/**
 * DeferNextAction Command
 * Defers a Next Action to later.
 *
 * Architecture: USER_FLOWS_STATE_MACHINES.md §4.5
 */

export async function deferNextAction(deps, input) {
  const { nextActionRepository, systemClock } = deps;

  if (!input.nextActionId) {
    throw new Error("Next Action ID is required");
  }

  const nextAction = await nextActionRepository.findById(input.nextActionId);
  if (!nextAction) {
    throw new Error(`Next Action not found: ${input.nextActionId}`);
  }

  const { NextActionState } =
    await import("../../domain/value-objects/NextActionState.js");
  nextAction.transitionStatus(NextActionState.DEFERRED, systemClock.now());
  await nextActionRepository.save(nextAction);

  return nextAction;
}
