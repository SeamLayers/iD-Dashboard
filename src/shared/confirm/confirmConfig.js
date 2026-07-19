/**
 * Which action types ask for confirmation before the mutation fires.
 *
 * This is the single switchboard for the whole dashboard — flip a value here
 * and every call site follows, no component edits needed.
 *
 *   create   — "Add"   buttons (new company, branch, employee, card, …)
 *   update   — "Save"  / "Edit" submissions
 *   destroy  — available for new code; every existing Delete already routes
 *              through its own per-entity dialog (DeleteEmployeeDialog etc.),
 *              which is left in place so deletions aren't confirmed twice
 *   workflow — irreversible card lifecycle steps: submit, publish, deactivate,
 *              approve, reject, and removing a user from a role
 *
 * Note on `create`/`update`: confirming every routine save is heavier than the
 * usual enterprise pattern, and users learn to click through it, which blunts
 * the prompt on the one action that is actually irreversible. If that becomes a
 * complaint, set these two to false — destructive and workflow confirmations
 * keep working untouched.
 */
export const CONFIRM_ACTIONS = {
  create: true,
  update: true,
  destroy: true,
  workflow: true,
};

/** Actions rendered with the red/danger treatment. */
export const DANGER_ACTIONS = new Set(['destroy', 'reject', 'deactivate', 'removeUser']);
