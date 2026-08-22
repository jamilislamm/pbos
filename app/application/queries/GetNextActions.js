/**
 * GetNextActions Query
 * Retrieves all executable Next Actions.
 *
 * Architecture: FR-006
 */

export async function getNextActions(deps) {
  const { nextActionRepository } = deps;

  const available = await nextActionRepository.findExecutable();
  const blocked = await nextActionRepository.findBlocked();

  return {
    executable: available,
    blocked: blocked,
    all: [...available, ...blocked],
  };
}
