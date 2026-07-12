"use client";

import { useEffect, useRef, useState, Children } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

/**
 * Row actions (⋮) menu rendered in a PORTAL with fixed positioning.
 *
 * Table wrappers use `overflow-x: auto`, which per the CSS spec also clips
 * vertical overflow — so an in-flow dropdown on the last row got cut off and
 * scrolled the table. Portalling to <body> and positioning against the
 * button's rect (flipping up near the viewport bottom) escapes the clip.
 */
export default function RowActionsMenu({ open, onToggle, ariaLabel, children }) {
  const btnRef = useRef(null);
  const [coords, setCoords] = useState(null);

  // Depend on the item COUNT (a stable number), never the children node — a
  // children array in the deps list changes the deps size between renders.
  const itemCount = Math.max(1, Children.toArray(children).length);

  useEffect(() => {
    if (!open) { setCoords(null); return; }
    const update = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const menuW = 176;
      // Estimate height from the real item count so the flip-up only triggers
      // when the menu genuinely wouldn't fit, and lands right under the button.
      const estH = itemCount * 42 + 14;
      const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
      let left = isRtl ? r.left : r.right - menuW;
      left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));
      let top = r.bottom + 6;
      if (top + estH > window.innerHeight - 8) top = Math.max(8, r.top - estH - 6); // flip up
      setCoords({ top, left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, itemCount]);

  return (
    <div className="kebab-wrapper">
      <button
        ref={btnRef}
        className="kebab-btn"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <MoreVertical size={18} />
      </button>
      {open && coords && typeof document !== 'undefined' && createPortal(
        <>
          <div className="kebab-backdrop" onClick={onToggle} />
          <div
            className="kebab-menu glass-panel"
            role="menu"
            style={{ position: 'fixed', top: coords.top, left: coords.left, right: 'auto', zIndex: 1000 }}
          >
            {children}
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}
