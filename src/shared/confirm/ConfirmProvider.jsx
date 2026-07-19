"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { CONFIRM_ACTIONS, DANGER_ACTIONS } from './confirmConfig';

/**
 * Promise-based confirmation for every mutating action in the dashboard.
 *
 * Usage in any handler:
 *
 *   const confirm = useConfirm();
 *   const ok = await confirm({ action: 'create', name: payload.name });
 *   if (!ok) return;
 *   await createMutation.mutateAsync(payload);
 *
 * `action` decides both the copy and whether the prompt appears at all — see
 * shared/confirm/confirmConfig.js. An action that is switched off resolves
 * `true` immediately, so call sites never need their own conditionals.
 */
const ConfirmContext = createContext(null);

const ACTION_TO_GATE = {
  create: 'create',
  update: 'update',
  destroy: 'destroy',
  submit: 'workflow',
  publish: 'workflow',
  deactivate: 'workflow',
  approve: 'workflow',
  reject: 'workflow',
  // Sending a card back for edits — a normal review outcome, not a rejection,
  // so it deliberately stays out of DANGER_ACTIONS.
  requestChanges: 'workflow',
  removeUser: 'workflow',
  discard: 'workflow',
};

export function ConfirmProvider({ children }) {
  const t = useTranslations('Confirm');
  const tCommon = useTranslations('Common');
  const [request, setRequest] = useState(null);
  // Held in a ref so resolving doesn't depend on render timing.
  const resolverRef = useRef(null);

  const settle = useCallback((result) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setRequest(null);
    if (resolve) resolve(result);
  }, []);

  const confirm = useCallback((options = {}) => {
    const action = options.action || 'update';
    const gate = ACTION_TO_GATE[action] || 'update';

    if (!CONFIRM_ACTIONS[gate]) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      // A second confirm() (double-clicked Save) would orphan the first
      // promise, leaving its handler awaiting forever. Settle it as cancelled.
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setRequest({ ...options, action });
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  const action = request?.action;
  const isDanger = action ? DANGER_ACTIONS.has(action) : false;
  // Callers may override any of these; otherwise the action supplies the copy.
  const title = request?.title || (action ? t(`${action}_title`) : '');
  const description =
    request?.description
    || (action
      ? request?.name
        ? t(`${action}_descNamed`, { name: request.name })
        : t(`${action}_desc`)
      : '');
  const confirmLabel = request?.confirmLabel || (action ? t(`${action}_cta`) : tCommon('yes'));

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Dialog
        isOpen={Boolean(request)}
        onClose={() => settle(false)}
        panelClassName="modal-box glass-panel confirm-box"
        ariaLabelledBy="confirm-dialog-title"
      >
        <div className={`confirm-icon ${isDanger ? 'is-danger' : ''}`}>
          {isDanger ? <AlertTriangle size={22} /> : <HelpCircle size={22} />}
        </div>
        <h3 className="modal-title" id="confirm-dialog-title">{title}</h3>
        <p className="modal-desc">{description}</p>
        <div className="modal-actions">
          {/* Destructive prompts focus Cancel; routine save/create prompts focus
              the primary action, so Enter completes the flow the user started. */}
          <button
            type="button"
            className="btn-outline"
            onClick={() => settle(false)}
            autoFocus={isDanger}
          >
            {tCommon('cancel')}
          </button>
          <button
            type="button"
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={() => settle(true)}
            autoFocus={!isDanger}
          >
            {confirmLabel}
          </button>
        </div>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  // Without a provider (e.g. an isolated test render) every action proceeds,
  // so a missing provider can never block a user from saving.
  if (!ctx) {
    return () => Promise.resolve(true);
  }
  return ctx.confirm;
}



