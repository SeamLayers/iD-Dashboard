"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Folder, Calendar, Pencil, Trash2, X, Plus, Check, Search, Users, Loader2 } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { useAuth } from '@/shared/auth/AuthProvider';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return value;
  }
}

export function ProjectsFilters({ t, search, setSearch, companyId, setCompanyId, companies, showCompanyFilter = true }) {
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
        <select className="emp-select" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
          <option value="">{t('filterByCompany')}</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}
    </div>
  );
}

export function ProjectCard({ t, project, onEdit, onDelete }) {
  const { hasPermission, hasRole } = useAuth();
  const canDelete = hasRole(['superadmin', 'owner']) || hasPermission('project.delete');
  const employeesCount = project.employees_count ?? project.employees?.length ?? 0;
  return (
    <div className="entity-card glass-panel">
      <div className="entity-card-header">
        <div className="entity-avatar"><Folder size={22} /></div>
        <div>
          <p className="entity-name">{project.name}</p>
          <p className="entity-meta">{project.company?.name || `#${project.company_id}`}</p>
        </div>
      </div>
      <div className="entity-card-body">
        <div className="entity-card-row">
          <span className="label"><Calendar size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('startDate')}</span>
          <span className="value" dir="ltr">{formatDate(project.start_date)}</span>
        </div>
        <div className="entity-card-row">
          <span className="label"><Calendar size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('endDate')}</span>
          <span className="value" dir="ltr">{formatDate(project.end_date)}</span>
        </div>
        <div className="entity-card-row">
          <span className="label"><Users size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('employees')}</span>
          <span className="value">{t('employeesCount', { count: employeesCount })}</span>
        </div>
      </div>
      <div className="entity-card-actions">
        <button className="btn-outline" onClick={() => onEdit(project)}>
          <Pencil size={14} />
          <span>{t('editProject')}</span>
        </button>
        {canDelete && (
          <button className="btn-icon danger" onClick={() => onDelete(project)} aria-label="Delete">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function ProjectFormDialog({ t, isOpen, onClose, initial, companies, employees, onSubmit, isPending }) {
  const tCommon = useTranslations('Common');
  const isEdit = Boolean(initial?.id);
  const [companyId, setCompanyId] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [empSearch, setEmpSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const initialCompanyId = initial?.company_id ? String(initial.company_id) : '';
    setCompanyId(
      initialCompanyId || (companies.length === 1 ? String(companies[0].id) : '')
    );
    setName(initial?.name || '');
    setStartDate(initial?.start_date ? initial.start_date.slice(0, 10) : '');
    setEndDate(initial?.end_date ? initial.end_date.slice(0, 10) : '');
    setSelectedEmployees(new Set((initial?.employees || []).map((e) => e.id)));
    setEmpSearch('');
  }, [isOpen, initial, companies]);

  const filteredEmployees = (() => {
    // Employee list items expose the company as a NESTED relation object
    // (company: { id }) and NOT a flat company_id, so match on either —
    // otherwise String(undefined) never equals the companyId and every
    // employee is filtered out ("No employees found"). Mirrors EmployeeForm.
    let list = companyId
      ? employees.filter(
          (e) => String(e.company_id ?? e.company?.id) === String(companyId)
        )
      : employees;
    if (empSearch) {
      const q = empSearch.toLowerCase();
      list = list.filter((e) =>
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.employee_number?.toLowerCase().includes(q)
      );
    }
    return list;
  })();

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      company_id: Number(companyId),
      name,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      employee_ids: Array.from(selectedEmployees),
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{isEdit ? t('editProject') : t('addProject')}</h3>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="modal-field">
            <label>{t('startDate')}</label>
            <input className="modal-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>{t('endDate')}</label>
            <input className="modal-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || undefined} />
          </div>
        </div>
        <div className="modal-field multi-select">
          <label>{t('selectEmployees')}</label>
          <input
            className="modal-input"
            placeholder="Search employees…"
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
          />
          <div className="multi-select-list">
            {filteredEmployees.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.4rem' }}>
                No employees found
              </p>
            )}
            {filteredEmployees.map((emp) => (
              <label key={emp.id} className="multi-select-row">
                <input
                  type="checkbox"
                  checked={selectedEmployees.has(emp.id)}
                  onChange={() => toggleEmployee(emp.id)}
                />
                <span>{emp.name} <small style={{ color: 'var(--text-muted)' }}>({emp.employee_number || emp.email})</small></span>
              </label>
            ))}
          </div>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            {selectedEmployees.size} selected
          </small>
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
                ? t('editProject')
                : t('addProject')}
            </span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteProjectDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteProject')}</h3>
      <p className="modal-desc">{t('deleteProjectDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}
