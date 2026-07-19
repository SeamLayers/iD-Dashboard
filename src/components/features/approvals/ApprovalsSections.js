"use client";

import {
  Check, X, Eye, Clock, Phone, Mail, Linkedin, MapPin, RotateCcw, AlertTriangle,
  Building2, Hash, Briefcase, Twitter, Github, Globe,
} from 'lucide-react';
import Dialog from '@/components/ui/Dialog';

const FALLBACK_PRIMARY = 'var(--accent-cyan, #00C4CC)';
const FALLBACK_ACCENT = 'var(--accent-teal, #00999E)';

function initialsOf(name = '') {
  return (
    name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'
  );
}

const isUrl = (u) => typeof u === 'string' && /^https?:\/\//i.test(u);

/** A single labelled review row — renders nothing when the value is empty. */
function ReviewRow({ icon: Icon, label, value, href, accent }) {
  if (!value) return null;
  return (
    <div className="cardrev-row">
      <span className="cardrev-row-ico" style={{ color: accent }}><Icon size={15} /></span>
      <span className="cardrev-row-label">{label}</span>
      {href ? (
        <a className="cardrev-row-val cardrev-link" href={href} target="_blank" rel="noopener noreferrer">{value}</a>
      ) : (
        <span className="cardrev-row-val">{value}</span>
      )}
    </div>
  );
}

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
                    <div className="emp-avatar">{initialsOf(request.name)}</div>
                    <div>
                      <div className="emp-name">{request.name}</div>
                      <div className="emp-email">{request.department || '—'}</div>
                    </div>
                  </div>
                </td>
                <td>{request.jobTitle || '—'}</td>
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

export function ApprovalPreviewDialog({ t, selectedRequest, isOpen, onClose, onApprove, onOpenReject, isFlipped, setIsFlipped, canApprove = true, canReject = true, isApproving = false }) {
  if (!selectedRequest) {
    return null;
  }

  const r = selectedRequest;
  const accent = r.accentColor || FALLBACK_PRIMARY;

  const handle = (v) => (v ? String(v).replace(/^@/, '') : '');
  const linkedinHref = r.linkedin ? (isUrl(r.linkedin) ? r.linkedin : `https://www.linkedin.com/in/${handle(r.linkedin)}`) : null;
  const twitterHref = r.twitter ? (isUrl(r.twitter) ? r.twitter : `https://x.com/${handle(r.twitter)}`) : null;
  const githubHref = r.github ? (isUrl(r.github) ? r.github : `https://github.com/${handle(r.github)}`) : null;

  const hasContact = r.phone || r.secondaryPhone || r.email;
  const hasCompany = r.company || r.department || r.branch || r.employeeNumber;
  const hasLinks = r.linkedin || r.twitter || r.github || r.publicUrl;
  const hasStyle = r.accentColor || r.templateName;
  const hasAnything = hasContact || hasCompany || hasLinks || hasStyle || r.bio;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="modal-box glass-panel cardrev-dialog"
      panelStyle={{ maxWidth: '880px', display: 'flex', gap: '0', padding: '0', overflow: 'hidden' }}
    >
      {/* LEFT — faithful card preview (real accent colour, avatar & QR) */}
      <div className="cb-preview cardrev-preview">
        <div className="cb-preview-bg">
          <div className="cb-orb cb-orb-1" style={{ background: accent }} />
          <div className="cb-stage">
            <button className="cb-flip-btn" onClick={() => setIsFlipped(!isFlipped)} aria-label="Flip card">
              <RotateCcw size={18} />
            </button>
            <div className={`cb-card-3d ${isFlipped ? 'flipped' : ''}`} style={{ transform: isFlipped ? 'rotateY(180deg) scale(0.85)' : 'rotateY(0) scale(0.85)' }}>
              <div className="cb-card cb-card-front" style={{ borderColor: accent, '--card-glow': accent }}>
                <div className="cb-card-top-line" style={{ background: `linear-gradient(90deg, ${accent}, ${FALLBACK_ACCENT})` }} />
                <div className="cb-card-body">
                  <div className="cb-card-logo-area">
                    {r.avatar ? (
                      <img className="cardrev-card-avatar" src={r.avatar} alt={r.name} />
                    ) : (
                      <span className="cb-card-logo-placeholder" style={{ color: accent }}>iD+</span>
                    )}
                  </div>
                  <div className="cb-card-info">
                    <h3 className="cb-card-name" style={{ color: 'var(--text-primary)' }}>{r.name}</h3>
                    {r.jobTitle && <p className="cb-card-title" style={{ color: accent }}>{r.jobTitle}</p>}
                  </div>
                  <div className="cb-card-fields">
                    {r.phone && <div className="cb-card-field"><Phone size={13} style={{ color: accent }} /><span>{r.phone}</span></div>}
                    {r.email && <div className="cb-card-field"><Mail size={13} style={{ color: accent }} /><span>{r.email}</span></div>}
                    {r.company && <div className="cb-card-field"><Building2 size={13} style={{ color: accent }} /><span>{r.company}</span></div>}
                    {r.address && <div className="cb-card-field"><MapPin size={13} style={{ color: accent }} /><span>{r.address}</span></div>}
                  </div>
                </div>
              </div>

              <div className="cb-card cb-card-back" style={{ borderColor: accent, '--card-glow': accent }}>
                <div className="cb-card-top-line" style={{ background: `linear-gradient(90deg, ${FALLBACK_ACCENT}, ${accent})` }} />
                <div className="cb-card-back-content">
                  <span className="cb-card-logo-placeholder cb-back-logo" style={{ color: accent }}>iD+</span>
                  {isUrl(r.qrCode) ? (
                    <img className="cardrev-qr" src={r.qrCode} alt="QR" />
                  ) : (
                    <div className="cb-qr-placeholder" style={{ borderColor: `${accent}44` }}>
                      <Globe size={38} style={{ color: accent, opacity: 0.75 }} />
                    </div>
                  )}
                  <p className="cb-card-scan-text" style={{ color: accent }}>{t('scanToConnect')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — the readable, grouped review of the real card content */}
      <div className="cardrev-panel">
        <div className="cardrev-head">
          <div>
            <h2 className="modal-title">{t('reviewCardDetails')}</h2>
            <p className="cardrev-intro">{t('reviewIntro', { name: r.name })}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label={t('cancel')}><X size={18} /></button>
        </div>

        <div className="cardrev-scroll">
          <div className="cardrev-identity">
            <div className="cardrev-avatar" style={{ borderColor: accent }}>
              {r.avatar ? <img src={r.avatar} alt={r.name} /> : <span>{initialsOf(r.name)}</span>}
            </div>
            <div className="cardrev-identity-txt">
              <h3>{r.name}</h3>
              {r.jobTitle && <p style={{ color: accent }}>{r.jobTitle}</p>}
              <span className="status-pill pending-pill">{t('status_review')}</span>
            </div>
          </div>

          <div className="cardrev-metaline">
            <span><Clock size={13} /> {t('submittedLabel')}: {r.submittedAt}</span>
            {r.employeeNumber && <span><Hash size={13} /> {r.employeeNumber}</span>}
            {r.templateName && <span><Briefcase size={13} /> {r.templateName}</span>}
          </div>

          {r.bio && <p className="cardrev-bio">{r.bio}</p>}

          {hasContact && (
            <section className="cardrev-group">
              <h4 className="cardrev-group-title">{t('sectionContact')}</h4>
              <ReviewRow icon={Phone} label={t('fieldPhone')} value={r.phone} href={r.phone ? `tel:${r.phone}` : null} accent={accent} />
              <ReviewRow icon={Phone} label={t('fieldSecondPhone')} value={r.secondaryPhone} href={r.secondaryPhone ? `tel:${r.secondaryPhone}` : null} accent={accent} />
              <ReviewRow icon={Mail} label={t('fieldEmail')} value={r.email} href={r.email ? `mailto:${r.email}` : null} accent={accent} />
            </section>
          )}

          {hasCompany && (
            <section className="cardrev-group">
              <h4 className="cardrev-group-title">{t('sectionCompany')}</h4>
              <ReviewRow icon={Building2} label={t('fieldCompany')} value={r.company} accent={accent} />
              <ReviewRow icon={Briefcase} label={t('fieldDepartment')} value={r.department} accent={accent} />
              <ReviewRow icon={MapPin} label={t('fieldBranch')} value={r.branch} accent={accent} />
              <ReviewRow icon={Hash} label={t('fieldEmployeeNo')} value={r.employeeNumber} accent={accent} />
            </section>
          )}

          {hasLinks && (
            <section className="cardrev-group">
              <h4 className="cardrev-group-title">{t('sectionLinks')}</h4>
              <ReviewRow icon={Linkedin} label={t('fieldLinkedin')} value={r.linkedin} href={linkedinHref} accent={accent} />
              <ReviewRow icon={Twitter} label={t('fieldTwitter')} value={r.twitter} href={twitterHref} accent={accent} />
              <ReviewRow icon={Github} label={t('fieldGithub')} value={r.github} href={githubHref} accent={accent} />
              <ReviewRow icon={Globe} label={t('publicCard')} value={r.publicUrl ? t('viewPublicCard') : ''} href={r.publicUrl || null} accent={accent} />
            </section>
          )}

          {hasStyle && (
            <section className="cardrev-group">
              <h4 className="cardrev-group-title">{t('sectionStyle')}</h4>
              {r.accentColor && (
                <div className="cardrev-row">
                  <span className="cardrev-row-ico"><span className="cardrev-swatch" style={{ background: r.accentColor }} /></span>
                  <span className="cardrev-row-label">{t('accentColor')}</span>
                  <span className="cardrev-row-val" style={{ textTransform: 'uppercase' }}>{r.accentColor}</span>
                </div>
              )}
              <ReviewRow icon={Briefcase} label={t('template')} value={r.templateName} accent={accent} />
            </section>
          )}

          {!hasAnything && <p className="cardrev-empty">{t('nothingProvided')}</p>}
        </div>

        <div className="cardrev-actions">
          {canApprove || canReject ? (
            <>
              {canReject && (
                <button className="btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }} onClick={onOpenReject}>
                  <X size={18} /> <span>{t('reject')}</span>
                </button>
              )}
              {canApprove && (
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }} onClick={() => onApprove(r.id)} disabled={isApproving}>
                  <Check size={18} /> <span>{t('approve')}</span>
                </button>
              )}
            </>
          ) : (
            <p className="cardrev-note">{t('reviewerNote')}</p>
          )}
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
