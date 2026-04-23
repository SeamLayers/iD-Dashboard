"use client";

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
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={overlayClassName} style={overlayStyle} onClick={onClose}>
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={panelClassName}
        style={panelStyle}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}