"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Briefcase, Pencil, Trash2, X, Plus, Check, Search, Loader2 } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';

export function DepartmentsFilters({ t, search, setSearch, companyId, setCompanyId, companies, showCompanyFilter = true }) {
  return (
    <div className="emp-filters">
      <div className="emp-search">
        <Search size={18} className="emp-search-icon" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="emp-search-input"
        />
        {search && (
          <button className="emp-search-clear" onClick={() => setSearch('')}><X size={14} /></button>
        )}
      </div>
      {showCompanyFilter && (
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="emp-select"
        >
          <option value="">{t('filterByCompany')}</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export function DepartmentCard({ t, department, onEdit, onDelete }) {
  return (
    <div className="entity-card glass-panel">
      <div className="entity-card-header">
        <div className="entity-avatar"><Briefcase size={22} /></div>
        <div>
          <p className="entity-name">{department.name}</p>
          <p className="entity-meta">{department.code || `#${department.id}`}</p>
        </div>
      </div>
      <div className="entity-card-body">
        <div className="entity-card-row">
          <span className="label">{t('company')}</span>
          <span className="value">{department.company?.name || '—'}</span>
        </div>
        <div className="entity-card-row">
          <span className="label">{t('code')}</span>
          <span className="value">{department.code || '—'}</span>
        </div>
        <div className="entity-card-row">
          <span className="label">Employees</span>
          <span className="value">{department.employees_count ?? department.employees?.length ?? 0}</span>
        </div>
      </div>
      <div className="entity-card-actions">
        <button className="btn-outline" onClick={() => onEdit(department)}>
          <Pencil size={14} />
          <span>{t('editDepartment')}</span>
        </button>
        <button className="btn-icon danger" onClick={() => onDelete(department)} aria-label="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function DepartmentFormDialog({ t, isOpen, onClose, initial, companies, onSubmit, isPending }) {
  const tCommon = useTranslations('Common');
  const isEdit = Boolean(initial?.id);
  const [companyId, setCompanyId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const initialCompanyId = initial?.company_id ? String(initial.company_id) : '';
    setCompanyId(
      initialCompanyId || (companies.length === 1 ? String(companies[0].id) : '')
    );
    setName(initial?.name || '');
    setCode(initial?.code || '');
  }, [isOpen, initial, companies]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      company_id: Number(companyId),
      name,
      code: code || undefined,
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{isEdit ? t('editDepartment') : t('addDepartment')}</h3>
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
          <label>{t('code')}</label>
          <input className="modal-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="IT-001" />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('codeHint')}</small>
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
                ? t('editDepartment')
                : t('addDepartment')}
            </span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteDepartmentDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteDepartment')}</h3>
      <p className="modal-desc">{t('deleteDepartmentDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}
