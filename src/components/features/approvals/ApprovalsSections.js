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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="modal-box glass-panel"
      panelStyle={{ border: '1px solid rgba(239, 83, 80, 0.3)', boxShadow: '0 8px 32px 0 rgba(239, 83, 80, 0.15)' }}
    >
      <div className="modal-header">
        <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EF5350' }}>
          <AlertTriangle size={20} />
          {t('rejectCardApproval')}
        </h2>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
      </div>

      <p className="modal-desc" style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        {t('reasonForRejectionPlaceholder')?.split('...')[0] || `You are rejecting the card layout submitted by ${selectedRequest.name}`} 
        <strong style={{ color: 'var(--text-primary)', marginLeft: '4px' }}>
          {selectedRequest.name}
        </strong>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }} htmlFor="rejection-reason">
            {t('reasonForRejection')}
          </label>
          <textarea
            id="rejection-reason"
            required
            autoFocus
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t('reasonForRejectionPlaceholder')}
            style={{
              width: '100%',
              minHeight: '130px',
              background: 'rgba(var(--color-black-rgb), 0.2)',
              border: '1px solid rgba(239, 83, 80, 0.2)',
              borderRadius: '12px',
              padding: '1rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              resize: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#EF5350';
              e.target.style.boxShadow = '0 0 0 3px rgba(239, 83, 80, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(239, 83, 80, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
            dir="auto"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
            {t('cancel')}
          </button>
          <button 
            type="submit"
            className="btn-danger" 
            style={{ 
              flex: 1, 
              justifyContent: 'center', 
              opacity: !reason.trim() ? 0.5 : 1, 
              cursor: !reason.trim() ? 'not-allowed' : 'pointer',
              pointerEvents: !reason.trim() ? 'none' : 'auto'
            }} 
            disabled={!reason.trim()}
          >
            {t('confirmRejection')}
          </button>
        </div>
      </form>
    </Dialog>
  );
}