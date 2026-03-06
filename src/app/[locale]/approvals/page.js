"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, X, Eye, Clock, Phone, Mail, Linkedin, MapPin, RotateCcw } from 'lucide-react';

const PENDING_REQUESTS = [
  { id: 101, name: 'Omar Farouk', jobTitle: 'Marketing Specialist', department: 'Marketing', submittedAt: '2 hours ago', status: 'pending', phone: '+966 50 987 6543', email: 'omar.f@mhawer.com', linkedin: 'linkedin.com/in/omarf', address: 'Riyadh, KSA' },
  { id: 102, name: 'Youssef Amin', jobTitle: 'Account Manager', department: 'Sales', submittedAt: '5 hours ago', status: 'pending', phone: '+966 50 111 2222', email: 'youssef.a@mhawer.com', linkedin: 'linkedin.com/in/youssefa', address: 'Jeddah, KSA' },
];

export default function ApprovalsPage() {
  const t = useTranslations('Approvals');
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setSelectedRequest(null);
    showToast('Card Approved & Published successfully!');
  };

  const handleReject = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setSelectedRequest(null);
    showToast('Card Rejected. Employee notified to make changes.');
  };

  // Base Template Styles matching current Theme (Mocking Admin's predefined styles)
  const primaryColor = 'var(--accent-cyan, #00C4CC)';
  const accentColor = 'var(--accent-teal, #00999E)';

  return (
    <div className="emp-page" style={{ animation: 'empFadeIn 0.5s ease-out' }}>
      {toast && (
        <div className="toast-notification">
          <Check size={16} /><span>{toast}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="emp-header">
        <div>
          <h1 className="emp-title text-gradient">{t('title')}</h1>
          <p className="emp-subtitle">{t('subtitle')}</p>
        </div>
      </div>

      {/* ── Data Table ── */}
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
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                  No pending card approvals at the moment.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div className="emp-info">
                      <div className="emp-avatar">{req.name.split(' ').map(n=>n[0]).join('')}</div>
                      <div>
                        <div className="emp-name">{req.name}</div>
                        <div className="emp-email">{req.department}</div>
                      </div>
                    </div>
                  </td>
                  <td>{req.jobTitle}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} /> {req.submittedAt}
                    </div>
                  </td>
                  <td>
                    <span className="status-pill pending-pill">{t('status_review')}</span>
                  </td>
                  <td className="text-right">
                    <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedRequest(req)}>
                      <Eye size={14} /> <span>{t('preview')}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Preview Modal ── */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-box" style={{ maxWidth: '800px', display: 'flex', gap: '2rem', padding: '0' }} onClick={e => e.stopPropagation()}>
            
            {/* Left side: Card Preview */}
            <div className="cb-preview" style={{ flex: 1, borderRadius: '20px 0 0 20px', minHeight: '500px' }}>
              <div className="cb-preview-bg" style={{ borderRadius: '20px 0 0 20px' }}>
                <div className="cb-orb cb-orb-1" style={{ background: primaryColor }} />
                <div className="cb-stage">
                  <button className="cb-flip-btn" onClick={() => setIsFlipped(!isFlipped)}>
                    <RotateCcw size={18} />
                  </button>
                  <div className={`cb-card-3d ${isFlipped ? 'flipped' : ''}`} style={{ transform: isFlipped ? 'rotateY(180deg) scale(0.85)' : 'rotateY(0) scale(0.85)' }}>
                    
                    {/* Front */}
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

                    {/* Back */}
                    <div className="cb-card cb-card-back" style={{ borderColor: primaryColor, '--card-glow': primaryColor }}>
                      <div className="cb-card-top-line" style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})` }} />
                      <div className="cb-card-back-content">
                        <span className="cb-card-logo-placeholder cb-back-logo" style={{ color: primaryColor }}>iD+</span>
                        <div className="cb-qr-placeholder" style={{ borderColor: `${primaryColor}44` }}>
                          <div style={{ width: '80px', height: '80px', background: primaryColor, opacity: 0.5, borderRadius: '8px' }}></div>
                        </div>
                        <p className="cb-card-scan-text" style={{ color: accentColor }}>Scan to Connect</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Review Actions */}
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="modal-header">
                <h2 className="modal-title">Review Card Details</h2>
                <button className="modal-close" onClick={() => setSelectedRequest(null)}><X size={18} /></button>
              </div>
              <p className="modal-desc" style={{ marginBottom: '2rem' }}>
                Review the customized layout submitted by <strong>{selectedRequest.name}</strong>. If everything aligns with company guidelines, approve to publish.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button className="btn-primary" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => handleApprove(selectedRequest.id)}>
                  <Check size={18} /> <span>{t('approve')}</span>
                </button>
                <button className="btn-danger" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => handleReject(selectedRequest.id)}>
                  <X size={18} /> <span>{t('reject')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
