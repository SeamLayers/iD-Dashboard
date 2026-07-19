"use client";

import { LockKeyhole } from 'lucide-react';

/**
 * Compact, honest "coming soon" panel for features that have no backend yet.
 * All copy is passed in already-translated so the component stays reusable.
 *
 * @param {string} title        heading (e.g. "Delegation")
 * @param {string} description  one-line explanation
 * @param {string} [badge]      small pill label (e.g. "Coming soon")
 * @param {React.ReactNode} [children] optional extra content shown below
 */
export default function ComingSoonPanel({ title, description, badge, children }) {
  return (
    <div className="coming-soon-panel">
      <div className="coming-soon-icon">
        <LockKeyhole size={26} />
      </div>
      <div className="coming-soon-body">
        <div className="coming-soon-headline">
          <h3 className="coming-soon-title">{title}</h3>
          {badge && <span className="coming-soon-badge">{badge}</span>}
        </div>
        <p className="coming-soon-desc">{description}</p>
        {children}
      </div>
    </div>
  );
}
