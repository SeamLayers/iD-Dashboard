"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, X, Plus, UserPlus } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { useAuth } from '@/shared/auth/AuthProvider';

function formatDateTime(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toISOString().replace('T', ' ').slice(0, 16);
  } catch {
    return value;
  }
}

export function AssignmentsFilters({ t, employeeId, setEmployeeId, projectId, setProjectId, employees, projects }) {
  return (
    <div className="emp-filters">
      <select className="emp-select" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
        <option value="">{t('filterByEmployee')}</option>
        {employees.map((e) => (
          <option key={e.id} value={e.id}>{e.name} ({e.employee_number || e.email})</option>
        ))}
      </select>
      <select className="emp-select" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
        <option value="">{t('filterByProject')}</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}

export function AssignmentsTable({ t, items, onDelete }) {
  const tCommon = useTranslations('Common');
  const { hasPermission, hasRole } = useAuth();
  const canDelete = hasRole(['superadmin', 'owner']) || hasPermission('employee_project.delete');
  return (
    <div className="emp-table-wrap glass-panel assignment-table-wrap">
      <table className="assignment-table">
        <thead>
          <tr>
            <th>{t('employee')}</th>
            <th>{t('project')}</th>
            <th>{t('assignedAt')}</th>
            <th style={{ textAlign: 'end' }}>{tCommon('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan="4" className="emp-empty">{t('noAssignments')}</td></tr>
          ) : items.map((row) => (
            <tr key={row.id}>
              <td>
                <p className="emp-name">{row.employee?.name || `#${row.employee_id}`}</p>
                <p className="emp-email">{row.employee?.email || row.employee?.employee_number || '—'}</p>
              </td>
              <td>{row.project?.name || `#${row.project_id}`}</td>
              <td dir="ltr">{formatDateTime(row.assigned_at)}</td>
              <td style={{ textAlign: 'end' }}>
                {canDelete && (
                  <button className="btn-icon danger" onClick={() => onDelete(row)} aria-label="Remove">
                    <Trash2 size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AssignmentFormDialog({ t, isOpen, onClose, employees, projects, onSubmit, isPending }) {
  const tCommon = useTranslations('Common');
  const [employeeId, setEmployeeId] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmployeeId('');
      setProjectId('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      employee_id: Number(employeeId),
      project_id: Number(projectId),
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{t('addAssignment')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label>{t('employee')}</label>
          <select className="modal-input" required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">{t('selectEmployee')}</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_number || emp.email})</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>{t('project')}</label>
          <select className="modal-input" required value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">{t('selectProject')}</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            <UserPlus size={14} />
            <span>{t('addAssignment')}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteAssignmentDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteAssignment')}</h3>
      <p className="modal-desc">{t('deleteAssignmentDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}
