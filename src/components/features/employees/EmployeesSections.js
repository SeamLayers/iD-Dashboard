"use client";

import { useTranslations } from 'next-intl';
import {
  Plus, Upload, Search, Edit2, Trash2, X, Check,
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

export function EmployeesTable({ t, employees, onEdit, onDelete }) {
  const tCommon = useTranslations('Common');
  const { hasPermission, hasRole } = useAuth();
  // Owners and superadmins can delete employees (backend enforces role +
  // tenancy). Gate on ROLE (already present at login) rather than the
  // fine-grained `employee.delete` permission so the button never depends on
  // the roles seeder having been re-run on the server.
  const canDelete = hasRole(['superadmin', 'owner']) || hasPermission('employee.delete');
  return (
    <div className="emp-table-wrap glass-panel">
      <table className="emp-table">
        <thead>
          <tr>
            <th>{t('colName')}</th>
            <th>{t('colJobTitle')}</th>
            <th>{t('colEmployeeNumber')}</th>
            <th>{t('colDepartment')}</th>
            <th>{t('branch')}</th>
            <th>{t('colCardStatus')}</th>
            <th className="th-actions">{t('colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="7" className="emp-empty">{t('noResults')}</td></tr>
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
                  <td className="emp-job">{employee.position || '—'}</td>
                  <td className="emp-empnum">{employee.employee_number || '—'}</td>
                  <td>{employee.department?.name || '—'}</td>
                  <td>{employee.branch?.name || '—'}</td>
                  <td>
                    <span className={`emp-status-pill status-${status}`}>{t(`status_${status}`)}</span>
                  </td>
                  <td className="td-actions">
                    <div className="emp-row-actions">
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => onEdit(employee)}
                        title={tCommon('edit')}
                        aria-label={tCommon('edit')}
                      >
                        <Edit2 size={16} />
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          className="btn-icon danger"
                          onClick={() => onDelete(employee)}
                          title={tCommon('delete')}
                          aria-label={tCommon('delete')}
                        >
                          <Trash2 size={16} />
                        </button>
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

// NOTE: the old EmployeeFormDialog modal was removed — creating and editing
// employees now happens on the dedicated full-page screen at /employees/new
// (see components/features/employees/EmployeeForm.js). The modal couldn't fit
// all the required fields (it was even missing the backend-required `position`)
// and the client asked for a proper screen instead of a popup.
