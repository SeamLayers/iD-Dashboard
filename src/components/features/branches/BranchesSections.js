"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Pencil, Trash2, X, Plus, Check, Building2, Loader2 } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';

export function BranchCard({ t, branch, onEdit, onDelete }) {
  return (
    <div className="entity-card glass-panel">
      <div className="entity-card-header">
        <div className="entity-avatar"><MapPin size={22} /></div>
        <div>
          <p className="entity-name">{branch.name}</p>
          <p className="entity-meta">{branch.company?.name || `#${branch.company_id}`}</p>
        </div>
      </div>
      <div className="entity-card-body">
        <div className="entity-card-row">
          <span className="label">{t('company')}</span>
          <span className="value">{branch.company?.name || '—'}</span>
        </div>
        <div className="entity-card-row">
          <span className="label">{t('address')}</span>
          <span className="value">{branch.address || '—'}</span>
        </div>
      </div>
      <div className="entity-card-actions">
        <button className="btn-outline" onClick={() => onEdit(branch)}>
          <Pencil size={14} />
          <span>{t('editBranch')}</span>
        </button>
        <button className="btn-icon danger" onClick={() => onDelete(branch)} aria-label="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function BranchFormDialog({ t, isOpen, onClose, initial, companies = [], onSubmit, isPending }) {
  const tCommon = useTranslations('Common');
  const isEdit = Boolean(initial?.id);
  const [companyId, setCompanyId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    // Owners (and anyone scoped to one company) get the company auto-picked so
    // the required <select> isn't left empty.
    const initialCompanyId = initial?.company_id ? String(initial.company_id) : '';
    setCompanyId(
      initialCompanyId || (companies.length === 1 ? String(companies[0].id) : '')
    );
    setName(initial?.name || '');
    setAddress(initial?.address || '');
  }, [isOpen, initial, companies]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      company_id: Number(companyId),
      name,
      address: address || undefined,
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{isEdit ? t('editBranch') : t('addBranch')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        {companies.length > 1 && (
          <div className="modal-field">
            <label>{t('company')}</label>
            <select className="modal-input" required value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
              <option value="">{t('filterByCompany')}</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="modal-field">
          <label>{t('name')}</label>
          <input className="modal-input" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('address')}</label>
          <input className="modal-input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
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
                ? t('editBranch')
                : t('addBranch')}
            </span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteBranchDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteBranch')}</h3>
      <p className="modal-desc">{t('deleteBranchDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}
