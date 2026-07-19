"use client";

import { useEffect, useRef } from 'react';

/**
 * Base modal used by every dialog in the dashboard.
 *
 * Behaviour added here benefits all of them at once: Escape to close, focus
 * moved into the panel on open and returned to the trigger on close, a Tab trap,
 * and the page behind locked from scrolling.
 *
 * Two things this has to get right, because dialogs stack (a confirmation
 * prompt opens on top of an open form):
 *
 *  1. Only the TOPMOST dialog may react to Escape. Both instances listen on
 *     `document`, and stopPropagation does not stop sibling listeners on the
 *     same node — so without the stack below, one Escape closed both.
 *  2. The scroll lock is ref-counted. Each dialog used to save and restore
 *     `body.style.overflow` independently; when two closed in the same commit
 *     the inner one restored '' and the outer then restored the 'hidden' it had
 *     captured, leaving the page permanently unscrollable until a reload.
 */

// Mounted dialogs, oldest first. Module-level on purpose: the stack is shared.
const dialogStack = [];
let scrollLockCount = 0;
let scrollLockPrevious = '';

export default function Dialog({
  isOpen,
  onClose,
  children,
  overlayClassName = 'modal-overlay',
  panelClassName = 'modal-box glass-panel',
  overlayStyle,
  panelStyle,
  ariaLabelledBy,
  role = 'dialog',
  closeOnEscape = true,
}) {
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);
  // Callers pass an inline arrow for onClose, so its identity changes on every
  // parent render. Keeping it in a ref keeps it OUT of the effect deps — with it
  // in the deps the effect tore down and re-ran on each keystroke, stealing
  // focus back to the first control (a reason textarea accepted one character,
  // then focus jumped to the close button).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    const token = {};
    dialogStack.push(token);

    lastFocusedRef.current = typeof document !== 'undefined' ? document.activeElement : null;

    const FOCUSABLE =
      'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

    // Respect an explicit autoFocus before falling back to the first control.
    const panel = panelRef.current;
    if (panel) {
      const preferred = panel.querySelector('[autofocus], [data-autofocus]');
      const focusable = preferred || panel.querySelector(FOCUSABLE);
      (focusable || panel).focus?.({ preventScroll: true });
    }

    const onKeyDown = (event) => {
      // Only the topmost dialog responds.
      if (dialogStack[dialogStack.length - 1] !== token) return;

      if (closeOnEscape && event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    // Ref-counted scroll lock: capture the page's real value once.
    if (scrollLockCount === 0) {
      scrollLockPrevious = document.body.style.overflow;
    }
    scrollLockCount += 1;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);

      const index = dialogStack.indexOf(token);
      if (index !== -1) dialogStack.splice(index, 1);

      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) {
        document.body.style.overflow = scrollLockPrevious;
      }

      // Only hand focus back if the element is still in the document.
      const previous = lastFocusedRef.current;
      if (previous && previous.isConnected) {
        previous.focus?.({ preventScroll: true });
      }
    };
  }, [isOpen, closeOnEscape]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={overlayClassName} style={overlayStyle} onClick={onClose}>
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={panelClassName}
        style={panelStyle}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
