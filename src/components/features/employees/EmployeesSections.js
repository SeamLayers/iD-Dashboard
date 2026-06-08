"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus, Upload, Search, MoreVertical, Edit2, Trash2, X, Check, Mail, Phone, Hash, Loader2,
} from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { useAuth } from '@/shared/auth/AuthProvider';

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function EmployeesHeader({ t, onSendInvitations, onBulkUpload, onAddEmployee }) {
  return (
    <div className="emp-header">
      <div>
        <h1 className="emp-title text-gradient">{t('title')}</h1>
        <p className="emp-subtitle">{t('subtitle')}</p>
      </div>
      <div className="emp-header-actions">
        <button
          className="btn-primary transition-all duration-300"
          style={{ background: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}
          onClick={onSendInvitations}
        >
          <Check size={16} />
          <span>{t('sendInvitations')}</span>
        </button>
        <button className="btn-outline transition-all duration-300" onClick={onBulkUpload}>
          <Upload size={16} />
          <span>{t('bulkUpload')}</span>
        </button>
        <button className="btn-primary transition-all duration-300" onClick={onAddEmployee}>
          <Plus size={16} />
          <span>{t('addEmployee')}</span>
        </button>
      </div>
    </div>
  );
}

export function EmployeesFilters({
  t,
  searchQuery,
  setSearchQuery,
  companyId,
  setCompanyId,
  branchId,
  setBranchId,
  companies,
  branches,
  showCompanyFilter = true,
}) {
  return (
    <div className="emp-filters">
      <div className="emp-search">
        <Search size={18} className="emp-search-icon" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="emp-search-input"
        />
        {searchQuery && (
          <button className="emp-search-clear" onClick={() => setSearchQuery('')}>
            <X size={14} />
          </button>
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
      <select
        value={branchId}
        onChange={(e) => setBranchId(e.target.value)}
        className="emp-select"
      >
        <option value="">{t('filterByBranch')}</option>
        {branches.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
    </div>
  );
}

export function EmployeesTable({ t, employees, openMenuId, setOpenMenuId, onEdit, onDelete }) {
  const tCommon = useTranslations('Common');
  const { hasPermission } = useAuth();
  return (
    <div className="emp-table-wrap glass-panel">
      <table className="emp-table">
        <thead>
          <tr>
            <th>{t('colName')}</th>
            <th>{t('colJobTitle')}</th>
            <th>{t('colDepartment')}</th>
            <th>{t('branch')}</th>
            <th>{t('colCardStatus')}</th>
            <th className="th-actions">{t('colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="6" className="emp-empty">{t('noResults')}</td></tr>
          ) : (
            employees.map((employee) => {
              const initials = getInitials(employee.name);
              const status = employee.status || 'active';
              return (
                <tr key={employee.id}>
                  <td>
                    <div className="emp-user">
                      <div className="emp-avatar">
                        {employee.logo ? <img src={employee.logo} alt={employee.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : initials}
                      </div>
                      <div>
                        <p className="emp-name">{employee.name || '—'}</p>
                        <p className="emp-email">{employee.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="emp-job">{employee.employee_number || '—'}</td>
                  <td>{employee.department?.name || '—'}</td>
                  <td>{employee.branch?.name || '—'}</td>
                  <td>
                    <span className={`emp-status-pill status-${status}`}>{t(`status_${status}`)}</span>
                  </td>
                  <td className="td-actions">
                    <div className="kebab-wrapper">
                      <button
                        className="kebab-btn"
                        onClick={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openMenuId === employee.id && (
                        <div className="kebab-menu glass-panel">
                          <button className="kebab-item" onClick={() => onEdit(employee)}>
                            <Edit2 size={14} /><span>{tCommon('edit')}</span>
                          </button>
                          {hasPermission('employee.delete') && (
                            <button className="kebab-item kebab-danger" onClick={() => onDelete(employee)}>
                              <Trash2 size={14} /><span>{tCommon('delete')}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export function DeleteEmployeeDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteEmployee')}</h3>
      <p className="modal-desc">{t('deleteEmployeeDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}

export function EmployeeFormDialog({
  t,
  isOpen,
  onClose,
  initial,
  companies,
  branches,
  departments,
  onSubmit,
  isPending,
}) {
  const tCommon = useTranslations('Common');
  const isEdit = Boolean(initial?.id);
  const [companyId, setCompanyId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [userId, setUserId] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [iqamaNumber, setIqamaNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const initialCompanyId = initial?.company_id
      ? String(initial.company_id)
      : initial?.company?.id
      ? String(initial.company.id)
      : '';
    // For owners (and any user who scopes to a single company) pre-pick it so
    // they aren't blocked by the native "please select an item in the list"
    // validation on the required <select>.
    setCompanyId(
      initialCompanyId || (companies.length === 1 ? String(companies[0].id) : '')
    );
    setBranchId(initial?.branch_id ? String(initial.branch_id) : initial?.branch?.id ? String(initial.branch.id) : '');
    setDepartmentId(initial?.department_id ? String(initial.department_id) : initial?.department?.id ? String(initial.department.id) : '');
    setUserId(initial?.user_id ? String(initial.user_id) : initial?.user?.id ? String(initial.user.id) : '');
    setEmployeeNumber(initial?.employee_number || '');
    setIqamaNumber(initial?.iqama_number || '');
    setName(initial?.name || '');
    setEmail(initial?.email || '');
    setPhone(initial?.phone || '');
    setStatus(initial?.status || 'active');
    setLogo(null);
    setLogoPreview(initial?.logo || null);
  }, [isOpen, initial, companies]);

  const filteredBranches = companyId
    ? branches.filter((b) => String(b.company_id) === String(companyId))
    : branches;
  const filteredDepartments = companyId
    ? departments.filter((d) => String(d.company_id) === String(companyId))
    : departments;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result || null);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      company_id: Number(companyId),
      branch_id: Number(branchId),
      department_id: departmentId ? Number(departmentId) : undefined,
      user_id: Number(userId),
      employee_number: employeeNumber,
      iqama_number: iqamaNumber, // required (DB: UNIQUE NOT NULL)
      name,
      email, // required (DB: UNIQUE NOT NULL)
      phone: phone || undefined,
      status,
    };
    if (logo) payload.logo = logo;
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{isEdit ? t('editEmployee') : t('addEmployee')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        {companies.length > 1 && (
          <div className="modal-field">
            <label>{t('company')}</label>
            <select className="modal-input" required value={companyId} onChange={(e) => { setCompanyId(e.target.value); setBranchId(''); setDepartmentId(''); }}>
              <option value="">{t('filterByCompany')}</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <div className="modal-field">
          <label>{t('branch')}</label>
          <select className="modal-input" required value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            <option value="">{t('filterByBranch')}</option>
            {filteredBranches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="modal-field">
          <label>{t('department')}</label>
          <select className="modal-input" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">—</option>
            {filteredDepartments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="modal-field">
          <label><Hash size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('user')}</label>
          <input className="modal-input" type="number" required value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="5" />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('userIdHint')}</small>
        </div>
        <div className="modal-field">
          <label>{t('employeeNumber')}</label>
          <input className="modal-input" required value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} placeholder="EMP-001" />
        </div>
        <div className="modal-field">
          <label>{t('iqamaNumber')}</label>
          <input className="modal-input" required value={iqamaNumber} onChange={(e) => setIqamaNumber(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('name')}</label>
          <input className="modal-input" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="modal-field">
          <label><Mail size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('email')}</label>
          <input className="modal-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="modal-field">
          <label><Phone size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('phone')}</label>
          <input className="modal-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('status')}</label>
          <select className="modal-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">{t('status_active')}</option>
            <option value="inactive">{t('status_inactive')}</option>
          </select>
        </div>
        <div className="modal-field">
          <label>{t('logo')}</label>
          <label className="file-upload">
            <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFile} />
            <div className="file-upload-icon"><Upload size={20} /></div>
            <div className="file-upload-text">
              <span>{logo?.name || (logoPreview ? 'Replace photo' : 'Upload photo')}</span>
              <small>{t('uploadHint')}</small>
            </div>
          </label>
          {logoPreview && (
            <div className="file-preview">
              <img src={logoPreview} alt="Preview" />
            </div>
          )}
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
                ? t('saveChanges')
                : t('addEmployee')}
            </span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}
