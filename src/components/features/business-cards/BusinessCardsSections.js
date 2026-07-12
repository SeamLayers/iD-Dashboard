"use client";

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  CreditCard,
  Trash2,
  X,
  Plus,
  Send,
  CheckCircle2,
  PauseCircle,
  Calendar,
  Hash,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import RowActionsMenu from '@/components/ui/RowActionsMenu';

const STATUS_PILL_CLASS = {
  draft: 'pill pill-muted',
  submitted: 'pill pill-warning',
  approved: 'pill pill-success',
  rejected: 'pill pill-danger',
  published: 'pill pill-published',
};

export function StatusPill({ status, t }) {
  const cls = STATUS_PILL_CLASS[status] || 'pill pill-muted';
  return <span className={cls}>{t(`status_${status}`)}</span>;
}

function getEmployeeName(card) {
  return (
    card?.card_data_json?.name ||
    card?.employee?.name ||
    `#${card?.employee_id ?? '—'}`
  );
}

function getEmployeeNumber(card) {
  return (
    card?.card_data_json?.employee_number ||
    card?.employee?.employee_number ||
    '—'
  );
}

export function BusinessCardCard({
  t,
  tCommon,
  card,
  openMenuId,
  setOpenMenuId,
  onSubmit,
  onPublish,
  onDeactivate,
  onDelete,
}) {
  const isMenuOpen = openMenuId === card.id;
  const status = card.status || 'draft';
  const name = getEmployeeName(card);
  const employeeNumber = getEmployeeNumber(card);
  const company = card?.card_data_json?.company || card?.employee?.company?.name;
  const templateName = card?.template?.name;

  const canSubmit = status === 'draft';
  const canPublish = status === 'approved';
  const canDeactivate = status === 'published' && card.is_active;

  return (
    <div className={`entity-card bc-card glass-panel ${!card.is_active ? 'is-inactive' : ''}`}>
      <div className="bc-card-top">
        <div className="bc-card-top-info">
          <div className="entity-avatar">
            <CreditCard size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="entity-name">{name}</p>
            <p className="entity-meta">{employeeNumber}</p>
          </div>
        </div>
        <RowActionsMenu
          open={isMenuOpen}
          onToggle={() => setOpenMenuId(isMenuOpen ? null : card.id)}
          ariaLabel={tCommon('actions')}
        >
          {canSubmit && (
            <button className="kebab-item" onClick={() => { setOpenMenuId(null); onSubmit(card); }}>
              <Send size={14} /><span>{t('submitForReview')}</span>
            </button>
          )}
          {canPublish && (
            <button className="kebab-item" onClick={() => { setOpenMenuId(null); onPublish(card); }}>
              <CheckCircle2 size={14} /><span>{t('publish')}</span>
            </button>
          )}
          {canDeactivate && (
            <button className="kebab-item" onClick={() => { setOpenMenuId(null); onDeactivate(card); }}>
              <PauseCircle size={14} /><span>{t('deactivate')}</span>
            </button>
          )}
          <button className="kebab-item kebab-danger" onClick={() => { setOpenMenuId(null); onDelete(card); }}>
            <Trash2 size={14} /><span>{tCommon('delete')}</span>
          </button>
        </RowActionsMenu>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <StatusPill status={status} t={t} />
        {card.is_active === false && status === 'published' && (
          <span className="pill pill-muted">{t('deactivate')}</span>
        )}
      </div>

      {status === 'rejected' && card.rejection_reason && (
        <div className="bc-card-rejection">
          <AlertCircle size={13} style={{ display: 'inline', marginInlineEnd: 4, verticalAlign: '-2px' }} />
          {card.rejection_reason}
        </div>
      )}

      <div className="bc-card-meta">
        {templateName && <div><strong>{t('template')}:</strong> {templateName}</div>}
        {company && <div><strong>{t('company')}:</strong> {company}</div>}
        {card.expiry_public_url && (
          <div>
            <Calendar size={12} style={{ display: 'inline', marginInlineEnd: 4, verticalAlign: '-1px' }} />
            <strong>{t('expiry')}:</strong> <span dir="ltr">{card.expiry_public_url}</span>
          </div>
        )}
        {card.nfc_code && (
          <div>
            <Hash size={12} style={{ display: 'inline', marginInlineEnd: 4, verticalAlign: '-1px' }} />
            <span dir="ltr">{card.nfc_code}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Edit form for a single existing business card.
export function BusinessCardFormDialog({
  t,
  isOpen,
  onClose,
  initial,
  templates,
  onSubmit,
  isPending,
}) {
  const tCommon = useTranslations('Common');
  const [templateId, setTemplateId] = useState('');
  const [nfcCode, setNfcCode] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiryDays, setExpiryDays] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTemplateId(initial?.template?.id ? String(initial.template.id) : initial?.template_id ? String(initial.template_id) : '');
    setNfcCode(initial?.nfc_code || '');
    setIsActive(initial?.is_active ?? true);
    setExpiryDays('');
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!templateId) return;
    const payload = {
      // The update endpoint re-validates the same shape as create, so we send the
      // existing employee id back unchanged.
      employee_ids: [initial?.employee_id],
      template_id: Number(templateId),
      nfc_code: nfcCode || undefined,
      is_active: Boolean(isActive),
    };
    if (expiryDays) {
      payload.expiry_days = Number(expiryDays);
    }
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{t('editCard')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label>{t('template')}</label>
          <select className="modal-input" required value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            <option value="">{t('selectTemplate')}</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>{tpl.name}{tpl.is_default ? ' (default)' : ''}</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>{t('nfcCode')}</label>
          <input className="modal-input" value={nfcCode} onChange={(e) => setNfcCode(e.target.value)} />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('nfcCodeHint')}</small>
        </div>
        <div className="modal-field">
          <label>{t('expiryDays')}</label>
          <input className="modal-input" type="number" min="1" value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)} placeholder="2" />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('expiryDaysHint')}</small>
        </div>
        <div className="modal-field">
          <label className="modal-checkbox">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <span>{t('isActive')}</span>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={isPending}>{tCommon('cancel')}</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending && <Loader2 size={14} className="spinner" />}
            <span>{isPending ? tCommon('saving') : t('editCard')}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteBusinessCardDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteCard')}</h3>
      <p className="modal-desc">{t('deleteCardDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}

// Modal for issuing one or more new business cards (multi-employee, one template).
export function IssueCardsDialog({
  t,
  isOpen,
  onClose,
  employees,
  templates,
  companies,
  onSubmit,
  isPending,
}) {
  const tCommon = useTranslations('Common');
  const [companyFilter, setCompanyFilter] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [nfcCode, setNfcCode] = useState('');
  const [expiryDays, setExpiryDays] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setCompanyFilter('');
    setSelectedEmployees([]);
    setTemplateId('');
    setNfcCode('');
    setExpiryDays('');
    setIsActive(true);
    setError(null);
  }, [isOpen]);

  const filteredEmployees = useMemo(() => {
    if (!companyFilter) return employees;
    return employees.filter((e) => String(e.company_id) === String(companyFilter) || String(e.company?.id) === String(companyFilter));
  }, [employees, companyFilter]);

  const filteredTemplates = useMemo(() => {
    if (!companyFilter) return templates;
    return templates.filter((tpl) => String(tpl.company_id) === String(companyFilter));
  }, [templates, companyFilter]);

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) => (
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (selectedEmployees.length === 0) {
      setError(t('validation.employeesRequired'));
      return;
    }
    if (!templateId) {
      setError(t('validation.templateRequired'));
      return;
    }
    const payload = {
      employee_ids: selectedEmployees,
      template_id: Number(templateId),
      is_active: Boolean(isActive),
    };
    if (nfcCode) payload.nfc_code = nfcCode;
    if (expiryDays) {
      const n = Number(expiryDays);
      if (Number.isNaN(n) || n <= 0) {
        setError(t('validation.expiryInvalid'));
        return;
      }
      payload.expiry_days = n;
    }
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form" panelStyle={{ maxWidth: 640 }}>
      <div className="modal-header">
        <h3 className="modal-title">{t('issueCards')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        {companies.length > 1 && (
          <div className="modal-field">
            <label>{t('company')}</label>
            <select className="modal-input" value={companyFilter} onChange={(e) => {
              setCompanyFilter(e.target.value);
              setSelectedEmployees([]);
              setTemplateId('');
            }}>
              <option value="">{t('filterByCompany')}</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <div className="modal-field">
          <label>{t('employees')}</label>
          <div className="multi-select">
            <div className="multi-select-list">
              {filteredEmployees.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '0.75rem' }}>
                  {tCommon('noData')}
                </p>
              ) : (
                filteredEmployees.map((emp) => (
                  <label key={emp.id} className="multi-select-row">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                    />
                    <span>{emp.name || `#${emp.id}`}</span>
                    <span className="row-sub">{emp.employee_number || ''}</span>
                  </label>
                ))
              )}
            </div>
            {selectedEmployees.length > 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                {tCommon('selected', { count: selectedEmployees.length })}
              </p>
            )}
          </div>
        </div>
        <div className="modal-field">
          <label>{t('template')}</label>
          <select className="modal-input" required value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            <option value="">{t('selectTemplate')}</option>
            {filteredTemplates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>{tpl.name}{tpl.is_default ? ' (default)' : ''}</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>{t('expiryDays')}</label>
          <input className="modal-input" type="number" min="1" value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)} placeholder="2" />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('expiryDaysHint')}</small>
        </div>
        <div className="modal-field">
          <label>{t('nfcCode')}</label>
          <input className="modal-input" value={nfcCode} onChange={(e) => setNfcCode(e.target.value)} />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('nfcCodeHint')}</small>
        </div>
        <div className="modal-field">
          <label className="modal-checkbox">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <span>{t('isActive')}</span>
          </label>
        </div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '1rem' }}>{error}</p>
        )}
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={isPending}>{tCommon('cancel')}</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? <Loader2 size={14} className="spinner" /> : <Plus size={14} />}
            <span>{isPending ? tCommon('saving') : t('issueCards')}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}
