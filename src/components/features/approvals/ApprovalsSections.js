"use client";

import { useTranslations } from 'next-intl';
import {
  Check, X, Eye, Clock, Phone, Mail, Linkedin, MapPin, RotateCcw, MessageSquare,
  Building2, Hash, Briefcase, Twitter, Github, Globe, Palette, Image as ImageIcon,
} from 'lucide-react';
import Dialog from '@/components/ui/Dialog';

const COMMENT_MAX = 1000;

// Order the theme keys the way the employee sees them in the app.
const THEME_KEYS = ['background', 'text', 'primary', 'accent'];

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
                    <div className="emp-avatar cardrev-mini-avatar">
                      {request.photo
                        ? <img src={request.photo} alt={request.name} />
                        : initialsOf(request.name)}
                    </div>
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

export function ApprovalPreviewDialog({ t, selectedRequest, isOpen, onClose, onApprove, onOpenRequestChanges, isFlipped, setIsFlipped, canApprove = true, canRequestChanges = true, isApproving = false }) {
  if (!selectedRequest) {
    return null;
  }

  const r = selectedRequest;
  const accent = r.accentColor || FALLBACK_PRIMARY;

  const handle = (v) => (v ? String(v).replace(/^@/, '') : '');
  const linkedinHref = r.linkedin ? (isUrl(r.linkedin) ? r.linkedin : `https://www.linkedin.com/in/${handle(r.linkedin)}`) : null;
  const twitterHref = r.twitter ? (isUrl(r.twitter) ? r.twitter : `https://x.com/${handle(r.twitter)}`) : null;
  const githubHref = r.github ? (isUrl(r.github) ? r.github : `https://github.com/${handle(r.github)}`) : null;

  const themeEntries = THEME_KEYS
    .map((key) => [key, r.theme?.[key]])
    .filter(([, value]) => Boolean(value));

  // The second phone lives in the personalisation block — it is the employee's own addition.
  const hasContact = r.phone || r.email;
  const hasCompany = r.company || r.department || r.branch || r.employeeNumber;
  const hasLinks = r.linkedin || r.twitter || r.github || r.publicUrl;
  const hasStyle = r.templateName;
  // What the employee personalised — the whole reason the owner is here.
  const hasPersonalisation = r.photo || r.bio || r.secondaryPhone || themeEntries.length > 0;
  const hasAnything = hasContact || hasCompany || hasLinks || hasStyle || hasPersonalisation || r.bio;

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

          {r.reviewComment && (
            <div className="cardrev-comment">
              <MessageSquare size={14} />
              <div>
                <strong>{t('lastComment')}</strong>
                <p>{r.reviewComment}</p>
              </div>
            </div>
          )}

          {hasPersonalisation && (
            <section className="cardrev-group cardrev-personal">
              <h4 className="cardrev-group-title">{t('sectionPersonalisation')}</h4>
              {r.photo && (
                <div className="cardrev-row">
                  <span className="cardrev-row-ico" style={{ color: accent }}><ImageIcon size={15} /></span>
                  <span className="cardrev-row-label">{t('fieldPhoto')}</span>
                  <span className="cardrev-row-val">
                    <img className="cardrev-photo" src={r.photo} alt={r.name} />
                  </span>
                </div>
              )}
              <ReviewRow icon={Phone} label={t('fieldSecondPhone')} value={r.secondaryPhone} href={r.secondaryPhone ? `tel:${r.secondaryPhone}` : null} accent={accent} />
              {themeEntries.length > 0 && (
                <div className="cardrev-row">
                  <span className="cardrev-row-ico" style={{ color: accent }}><Palette size={15} /></span>
                  <span className="cardrev-row-label">{t('fieldColors')}</span>
                  <span className="cardrev-row-val cardrev-swatches">
                    {themeEntries.map(([key, value]) => (
                      <span key={key} className="cardrev-swatch-chip" title={`${t(`color_${key}`)} ${value}`}>
                        <span className="cardrev-swatch" style={{ background: value }} />
                        <span>{t(`color_${key}`)}</span>
                      </span>
                    ))}
                  </span>
                </div>
              )}
              {r.bio && (
                <div className="cardrev-row cardrev-row-stack">
                  <span className="cardrev-row-label">{t('fieldBio')}</span>
                  <p className="cardrev-bio">{r.bio}</p>
                </div>
              )}
            </section>
          )}

          {!hasPersonalisation && r.bio && <p className="cardrev-bio">{r.bio}</p>}

          {hasContact && (
            <section className="cardrev-group">
              <h4 className="cardrev-group-title">{t('sectionContact')}</h4>
              <ReviewRow icon={Phone} label={t('fieldPhone')} value={r.phone} href={r.phone ? `tel:${r.phone}` : null} accent={accent} />
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
              <ReviewRow icon={Briefcase} label={t('template')} value={r.templateName} accent={accent} />
            </section>
          )}

          {!hasAnything && <p className="cardrev-empty">{t('nothingProvided')}</p>}
        </div>

        <div className="cardrev-actions">
          {canApprove || canRequestChanges ? (
            <>
              {canRequestChanges && (
                <button className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }} onClick={onOpenRequestChanges}>
                  <MessageSquare size={18} /> <span>{t('requestChanges')}</span>
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

/**
 * "Request changes" — the owner's way of sending a personalised card back to
 * the employee with a comment. Self-contained (reads its own Approvals
 * namespace) so both the Approvals queue and the Business Cards grid can use it.
 */
export function RequestChangesDialog({ isOpen, name, comment, setComment, onClose, onConfirm, isPending = false }) {
  const t = useTranslations('Approvals');
  const tCommon = useTranslations('Common');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <MessageSquare size={20} />
          {t('requestChangesTitle')}
        </h2>
        <button className="modal-close" type="button" onClick={onClose}><X size={18} /></button>
      </div>

      <p className="modal-desc">{t('requestChangesDesc', { name: name || '' })}</p>

      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label htmlFor="request-changes-comment">{t('commentLabel')}</label>
          <textarea
            id="request-changes-comment"
            className="modal-input"
            required
            autoFocus
            rows={5}
            maxLength={COMMENT_MAX}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={t('commentPlaceholder')}
            dir="auto"
            style={{ resize: 'vertical', minHeight: '130px' }}
          />
          <small style={{ display: 'block', marginTop: '0.35rem', textAlign: 'end', color: 'var(--text-muted)', fontSize: '0.78rem' }} dir="ltr">
            {comment.length}/{COMMENT_MAX}
          </small>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={isPending}>
            {tCommon('cancel')}
          </button>
          <button type="submit" className="btn-primary" disabled={isPending || !comment.trim()}>
            <MessageSquare size={14} />
            <span>{isPending ? tCommon('saving') : t('confirmRequestChanges')}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}
