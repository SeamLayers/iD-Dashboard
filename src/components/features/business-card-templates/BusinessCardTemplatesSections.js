"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Palette, Pencil, Trash2, X, Plus, Check, Loader2 } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { TemplateDesigner } from './TemplateDesigner';

function safeStringify(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
}

export function BusinessCardTemplateCard({ t, template, onEdit, onDelete }) {
  return (
    <div className="entity-card glass-panel">
      <div className="entity-card-header">
        <div className="entity-avatar"><Palette size={22} /></div>
        <div>
          <p className="entity-name">{template.name}</p>
          <p className="entity-meta">{template.company?.name || `#${template.company_id}`}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {template.is_default && <span className="pill pill-success">{t('defaultBadge')}</span>}
      </div>
      <div className="entity-card-body">
        <div className="entity-card-row">
          <span className="label">{t('company')}</span>
          <span className="value">{template.company?.name || '—'}</span>
        </div>
        <div className="entity-card-row">
          <span className="label">{t('name')}</span>
          <span className="value">{template.name}</span>
        </div>
      </div>
      <div className="entity-card-actions">
        <button className="btn-outline" onClick={() => onEdit(template)}>
          <Pencil size={14} />
          <span>{t('editTemplate')}</span>
        </button>
        <button className="btn-icon danger" onClick={() => onDelete(template)} aria-label="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function BusinessCardTemplateFormDialog({ t, isOpen, onClose, initial, companies = [], onSubmit, isPending }) {
  const tCommon = useTranslations('Common');
  const isEdit = Boolean(initial?.id);
  const [companyId, setCompanyId] = useState('');
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [designJson, setDesignJson] = useState('');
  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const initialCompanyId = initial?.company_id
      ? String(initial.company_id)
      : initial?.company?.id
      ? String(initial.company.id)
      : '';
    setCompanyId(
      initialCompanyId || (companies.length === 1 ? String(companies[0].id) : '')
    );
    setName(initial?.name || '');
    setIsDefault(Boolean(initial?.is_default));
    setDesignJson(safeStringify(initial?.design_json));
    setJsonError(null);
  }, [isOpen, initial, companies]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setJsonError(null);

    const payload = {
      company_id: Number(companyId),
      name,
      is_default: Boolean(isDefault),
    };

    if (designJson.trim()) {
      try {
        payload.design_json = JSON.parse(designJson);
      } catch {
        setJsonError(t('designJsonInvalid'));
        return;
      }
    }

    onSubmit(payload);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form" panelStyle={{ maxWidth: 720 }}>
      <div className="modal-header">
        <h3 className="modal-title">{isEdit ? t('editTemplate') : t('addTemplate')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        {companies.length > 1 && (
          <div className="modal-field">
            <label>{t('company')}</label>
            <select className="modal-input" required value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
              <option value="">{t('filterByCompany')}</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <div className="modal-field">
          <label>{t('name')}</label>
          <input className="modal-input" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('designJson')}</label>
          <TemplateDesigner t={t} value={designJson} onChange={setDesignJson} error={jsonError} />
        </div>
        <div className="modal-field">
          <label className="modal-checkbox">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
            <span>{t('isDefault')}</span>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={isPending}>{tCommon('cancel')}</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? (
              <Loader2 size={14} className="spinner" />
            ) : isEdit ? (
              <Check size={14} />
            ) : (
              <Plus size={14} />
            )}
            <span>
              {isPending
                ? tCommon('saving')
                : isEdit
                ? t('editTemplate')
                : t('addTemplate')}
            </span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteBusinessCardTemplateDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteTemplate')}</h3>
      <p className="modal-desc">{t('deleteTemplateDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}
