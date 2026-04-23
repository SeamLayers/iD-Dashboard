"use client";

import { Plus, Upload, Search, MoreVertical, ChevronLeft, ChevronRight, Edit2, Trash2, X, Check } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';

function EmployeeFormFields({ t, values, setValues, departments, roles }) {
  return (
    <>
      <div className="modal-field"><label>{t('colName')}</label><input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} className="modal-input" /></div>
      <div className="modal-field"><label>{t('email')}</label><input value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} className="modal-input" /></div>
      <div className="modal-field"><label>{t('colJobTitle')}</label><input value={values.jobTitle} onChange={(event) => setValues({ ...values, jobTitle: event.target.value })} className="modal-input" /></div>
      <div className="modal-field">
        <label>{t('colDepartment')}</label>
        <select value={values.department} onChange={(event) => setValues({ ...values, department: event.target.value })} className="modal-input">
          {departments.filter((department) => department !== 'all').map((department) => (
            <option key={department} value={department}>{t(`dept_${department}`)}</option>
          ))}
        </select>
      </div>
      <div className="modal-field">
        <label>{t('colRole')}</label>
        <select value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value })} className="modal-input">
          {roles.filter((role) => role !== 'all').map((role) => (
            <option key={role} value={role}>{t(`role_${role}`)}</option>
          ))}
        </select>
      </div>
    </>
  );
}

export function EmployeesHeader({ t, onSendInvitations, onBulkUpload, onAddEmployee }) {
  return (
    <div className="emp-header">
      <div>
        <h1 className="emp-title text-gradient">{t('title')}</h1>
        <p className="emp-subtitle">{t('subtitle')}</p>
      </div>
      <div className="emp-header-actions">
        <button className="btn-primary transition-all duration-300" style={{ background: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }} onClick={onSendInvitations}>
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

export function EmployeesFilters({ t, searchQuery, setSearchQuery, departmentFilter, setDepartmentFilter, roleFilter, setRoleFilter, departments, roles }) {
  return (
    <div className="emp-filters">
      <div className="emp-search">
        <Search size={18} className="emp-search-icon" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="emp-search-input"
        />
        {searchQuery && (
          <button className="emp-search-clear" onClick={() => setSearchQuery('')}>
            <X size={14} />
          </button>
        )}
      </div>
      <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="emp-select">
        {departments.map((department) => <option key={department} value={department}>{t(`dept_${department}`)}</option>)}
      </select>
      <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="emp-select">
        {roles.map((role) => <option key={role} value={role}>{t(`role_${role}`)}</option>)}
      </select>
    </div>
  );
}

export function EmployeesTable({ t, employees, openMenuId, setOpenMenuId, onEdit, onDelete }) {
  return (
    <div className="emp-table-wrap glass-panel">
      <table className="emp-table">
        <thead>
          <tr>
            <th>{t('colName')}</th>
            <th>{t('colJobTitle')}</th>
            <th>{t('colDepartment')}</th>
            <th>{t('colRole')}</th>
            <th>{t('colCardStatus')}</th>
            <th className="th-actions">{t('colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="6" className="emp-empty">{t('noResults')}</td></tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="emp-user">
                    <div className="emp-avatar">{employee.avatar}</div>
                    <div><p className="emp-name">{employee.name}</p><p className="emp-email">{employee.email}</p></div>
                  </div>
                </td>
                <td className="emp-job">{employee.jobTitle}</td>
                <td>{t(`dept_${employee.department}`)}</td>
                <td><span className={`emp-role-badge role-${employee.role}`}>{t(`role_${employee.role}`)}</span></td>
                <td><span className={`emp-status-pill status-${employee.cardStatus}`}>{t(`card_${employee.cardStatus}`)}</span></td>
                <td className="td-actions">
                  <div className="kebab-wrapper">
                    <button className="kebab-btn" onClick={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}>
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === employee.id && (
                      <div className="kebab-menu glass-panel">
                        <button className="kebab-item" onClick={() => onEdit(employee)}>
                          <Edit2 size={14} /><span>{t('edit')}</span>
                        </button>
                        <button className="kebab-item kebab-danger" onClick={() => onDelete(employee.id)}>
                          <Trash2 size={14} /><span>{t('delete')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function EmployeesPagination({ t, totalPages, currentPage, setCurrentPage, filteredEmployeesLength, itemsPerPage }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="emp-pagination">
      <span className="emp-page-info">
        {t('showing', { from: (currentPage - 1) * itemsPerPage + 1, to: Math.min(currentPage * itemsPerPage, filteredEmployeesLength), total: filteredEmployeesLength })}
      </span>
      <div className="emp-page-controls">
        <button className="emp-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}><ChevronLeft size={18} /></button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} className={`emp-page-num ${page === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
        ))}
        <button className="emp-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}

export function DeleteEmployeeDialog({ t, isOpen, onClose, onConfirm }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('confirmDelete')}</h3>
      <p className="modal-desc">{t('confirmDeleteDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{t('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm}><Trash2 size={14} /><span>{t('delete')}</span></button>
      </div>
    </Dialog>
  );
}

export function AddEmployeeDialog({ t, isOpen, onClose, onSubmit, departments, roles }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{t('addEmployee')}</h3>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="modal-field"><label>{t('colName')}</label><input name="name" required className="modal-input" /></div>
        <div className="modal-field"><label>{t('email')}</label><input name="email" type="email" required className="modal-input" /></div>
        <div className="modal-field"><label>{t('colJobTitle')}</label><input name="jobTitle" required className="modal-input" /></div>
        <div className="modal-field">
          <label>{t('colDepartment')}</label>
          <select name="department" className="modal-input">{departments.filter((department) => department !== 'all').map((department) => <option key={department} value={department}>{t(`dept_${department}`)}</option>)}</select>
        </div>
        <div className="modal-field">
          <label>{t('colRole')}</label>
          <select name="role" defaultValue="employee" className="modal-input">{roles.filter((role) => role !== 'all').map((role) => <option key={role} value={role}>{t(`role_${role}`)}</option>)}</select>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="btn-primary"><Plus size={14} /><span>{t('addEmployee')}</span></button>
        </div>
      </form>
    </Dialog>
  );
}

export function EditEmployeeDialog({ t, isOpen, onClose, employee, onChange, onSave, departments, roles }) {
  if (!employee) {
    return null;
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{t('editEmployee')}</h3>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
      </div>
      <EmployeeFormFields t={t} values={employee} setValues={onChange} departments={departments} roles={roles} />
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{t('cancel')}</button>
        <button className="btn-primary" onClick={onSave}><Check size={14} /><span>{t('saveChanges')}</span></button>
      </div>
    </Dialog>
  );
}