"use client";

import { Check, X, Eye, Clock, Phone, Mail, Linkedin, MapPin, RotateCcw, AlertTriangle } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';

const primaryColor = 'var(--accent-cyan, #00C4CC)';
const accentColor = 'var(--accent-teal, #00999E)';

export function ApprovalsTable({ t, approvalRequests, onPreview }) {
  return (
    <div className="emp-table-container glass-panel">
      <table className="emp-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Job Title</th>
            <th>Submitted</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvalRequests.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                No pending card approvals at the moment.
              </td>
            </tr>
          ) : (
            approvalRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="emp-info">
                    <div className="emp-avatar">{request.name.split(' ').map((name) => name[0]).join('')}</div>
                    <div>
                      <div className="emp-name">{request.name}</div>
                      <div className="emp-email">{request.department}</div>
                    </div>
                  </div>
                </td>
                <td>{request.jobTitle}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} /> {request.submittedAt}
                  </div>
                </td>
                <td>
                  <span className="status-pill pending-pill">{t('status_review')}</span>
                </td>
                <td className="text-right">
                  <button className="btn-primary transition-all duration-300" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => onPreview(request)}>
                    <Eye size={14} /> <span>{t('preview')}</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ApprovalPreviewDialog({ t, selectedRequest, isOpen, onClose, onApprove, onOpenReject, isFlipped, setIsFlipped }) {
  if (!selectedRequest) {
    return null;
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="modal-box glass-panel"
      panelStyle={{ maxWidth: '800px', display: 'flex', gap: '2rem', padding: '0' }}
    >
      <div className="cb-preview" style={{ flex: 1, borderRadius: '20px 0 0 20px', minHeight: '500px' }}>
        <div className="cb-preview-bg" style={{ borderRadius: '20px 0 0 20px' }}>
          <div className="cb-orb cb-orb-1" style={{ background: primaryColor }} />
          <div className="cb-stage">
            <button className="cb-flip-btn" onClick={() => setIsFlipped(!isFlipped)}>
              <RotateCcw size={18} />
            </button>
            <div className={`cb-card-3d ${isFlipped ? 'flipped' : ''}`} style={{ transform: isFlipped ? 'rotateY(180deg) scale(0.85)' : 'rotateY(0) scale(0.85)' }}>
              <div className="cb-card cb-card-front" style={{ borderColor: primaryColor, '--card-glow': primaryColor }}>
                <div className="cb-card-top-line" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }} />
                <div className="cb-card-body">
                  <div className="cb-card-logo-area">
                    <span className="cb-card-logo-placeholder" style={{ color: primaryColor }}>iD+</span>
                  </div>
                  <div className="cb-card-info">
                    <h3 className="cb-card-name" style={{ color: 'var(--text-primary)' }}>{selectedRequest.name}</h3>
                    <p className="cb-card-title" style={{ color: accentColor }}>{selectedRequest.jobTitle}</p>
                  </div>
                  <div className="cb-card-fields">
                    <div className="cb-card-field"><Phone size={13} style={{ color: primaryColor }} /><span>{selectedRequest.phone}</span></div>
                    <div className="cb-card-field"><Mail size={13} style={{ color: primaryColor }} /><span>{selectedRequest.email}</span></div>
                    <div className="cb-card-field"><Linkedin size={13} style={{ color: primaryColor }} /><span>{selectedRequest.linkedin}</span></div>
                    <div className="cb-card-field"><MapPin size={13} style={{ color: primaryColor }} /><span>{selectedRequest.address}</span></div>
                  </div>
                </div>
              </div>

              <div className="cb-card cb-card-back" style={{ borderColor: primaryColor, '--card-glow': primaryColor }}>
                <div className="cb-card-top-line" style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})` }} />
                <div className="cb-card-back-content">
                  <span className="cb-card-logo-placeholder cb-back-logo" style={{ color: primaryColor }}>iD+</span>
                  <div className="cb-qr-placeholder" style={{ borderColor: `${primaryColor}44` }}>
                    <div style={{ width: '80px', height: '80px', background: primaryColor, opacity: 0.5, borderRadius: '8px' }} />
                  </div>
                  <p className="cb-card-scan-text" style={{ color: accentColor }}>Scan to Connect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="modal-header">
          <h2 className="modal-title">Review Card Details</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <p className="modal-desc" style={{ marginBottom: '2rem' }}>
          Review the customized layout submitted by <strong>{selectedRequest.name}</strong>. If everything aligns with company guidelines, approve to publish.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn-primary" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => onApprove(selectedRequest.id)}>
            <Check size={18} /> <span>{t('approve')}</span>
          </button>
          <button className="btn-danger" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={onOpenReject}>
            <X size={18} /> <span>{t('reject')}</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export function RejectReasonDialog({ t, selectedRequest, isOpen, reason, setReason, onClose, onConfirm }) {
  if (!selectedRequest) {
    return null;
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName="fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(var(--color-black-rgb),0.55)] px-4 backdrop-blur-md"
      panelClassName="w-full max-w-[560px] overflow-hidden rounded-[28px] border border-red-500/20 bg-[rgba(var(--color-black-rgb),0.78)] text-[var(--text-primary)] shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      panelStyle={{}}
      ariaLabelledBy="reject-card-approval-title"
    >
      <div className="border-b border-red-500/10 bg-gradient-to-r from-red-500/10 via-transparent to-transparent px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <AlertTriangle size={20} />
          </div>
          <div className="min-w-0">
            <h2 id="reject-card-approval-title" className="text-xl font-semibold tracking-tight text-red-500">
              {t('rejectCardApproval')}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {selectedRequest.name} · {selectedRequest.jobTitle}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onConfirm} className="px-6 py-5">
        <label htmlFor="rejection-reason" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          {t('reasonForRejection')}
        </label>
        <textarea
          id="rejection-reason"
          required
          autoFocus
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('reasonForRejectionPlaceholder')}
          className="min-h-[140px] w-full resize-none rounded-[18px] border border-[rgba(var(--color-white-rgb),0.08)] bg-[rgba(var(--color-white-rgb),0.05)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
          dir="auto"
        />

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-[rgba(var(--color-white-rgb),0.08)] bg-[rgba(var(--color-black-rgb),0.1)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[rgba(var(--color-white-rgb),0.08)]"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={!reason.trim()}
            className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
          >
            {t('confirmRejection')}
          </button>
        </div>
      </form>
    </Dialog>
  );
}