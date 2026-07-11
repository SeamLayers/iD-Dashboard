"use client";

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  Plus,
  Users,
  ArrowLeft,
  Check,
  UserMinus,
} from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { useEmployees } from '@/shared/api/hooks';

// Default permission catalogue (used as a fallback when the backend doesn't
// return existing permissions or when creating brand new roles). Mirrors the
// seeder list in dashboard_endpoints.md §12.
// TODO: replace with a fetched catalogue once GET /dashboard/permissions exists.
const DEFAULT_PERMISSIONS = [
  'company.view', 'company.create', 'company.update', 'company.delete',
  'company_branch.view', 'company_branch.create', 'company_branch.update', 'company_branch.delete',
  'department.view', 'department.create', 'department.update', 'department.delete',
  'employee.view', 'employee.create', 'employee.update', 'employee.delete',
  'project.view', 'project.create', 'project.update', 'project.delete',
  'employee_project.view', 'employee_project.create', 'employee_project.delete',
  'business_card.view', 'business_card.create', 'business_card.update', 'business_card.delete',
  'business_card.submit', 'business_card.approve', 'business_card.reject',
  'business_card.publish', 'business_card.deactivate',
  'business_card_template.view', 'business_card_template.create',
  'business_card_template.update', 'business_card_template.delete',
  'role.view', 'role.create', 'role.update', 'role.delete',
];

function groupPermissions(perms) {
  const grouped = {};
  perms.forEach((p) => {
    const idx = p.indexOf('.');
    const group = idx === -1 ? p : p.slice(0, idx);
    if (!group) return;
    grouped[group] = grouped[group] || [];
    if (!grouped[group].includes(p)) grouped[group].push(p);
  });
  return grouped;
}

function formatGroupLabel(slug) {
  return slug
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function actionFromPermission(perm) {
  const idx = perm.indexOf('.');
  return idx === -1 ? perm : perm.slice(idx + 1);
}

export function RoleCard({ t, role, onSelect, onDelete, canDelete = true }) {
  const permissionsCount = Array.isArray(role.permissions) ? role.permissions.length : 0;
  const usersCount = Array.isArray(role.employees) ? role.employees.length : 0;
  return (
    <div className="entity-card glass-panel" onClick={() => onSelect(role)} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
      <div className="entity-card-header">
        <div className="entity-avatar"><ShieldCheck size={22} /></div>
        <div>
          <p className="entity-name">{role.name}</p>
          <p className="entity-meta">{role.guard_name || 'api'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="pill pill-info">{t('permissionsCount', { count: permissionsCount })}</span>
        <span className="pill pill-muted">{t('usersCount', { count: usersCount })}</span>
      </div>
      <div className="entity-card-actions">
        <button className="btn-outline" onClick={(e) => { e.stopPropagation(); onSelect(role); }}>
          <Pencil size={14} />
          <span>{t('editRole')}</span>
        </button>
        {canDelete && (
          <button className="btn-icon danger" onClick={(e) => { e.stopPropagation(); onDelete(role); }} aria-label="Delete">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function CreateRoleDialog({ t, isOpen, onClose, onSubmit, isPending }) {
  const tCommon = useTranslations('Common');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setSelected([]);
    setError(null);
  }, [isOpen]);

  const grouped = useMemo(() => groupPermissions(DEFAULT_PERMISSIONS), []);

  const toggle = (perm) => {
    setSelected((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));
  };

  const toggleGroup = (group, perms, allSelected) => {
    setSelected((prev) => {
      if (allSelected) {
        return prev.filter((p) => !perms.includes(p));
      }
      return Array.from(new Set([...prev, ...perms]));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError(t('validation.nameRequired'));
      return;
    }
    onSubmit({ name: name.trim(), permissions: selected });
  };

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form" panelStyle={{ maxWidth: 720 }}>
      <div className="modal-header">
        <h3 className="modal-title">{t('addRole')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label>{t('name')}</label>
          <input
            className="modal-input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
          />
        </div>
        <div className="modal-field">
          <label>{t('permissions')}</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(grouped).map(([group, perms]) => {
              const allSelected = perms.every((p) => selected.includes(p));
              return (
                <div key={group} className="perm-group glass-panel">
                  <div className="perm-group-header">
                    <span className="perm-group-title">{formatGroupLabel(group)}</span>
                    <div className="perm-group-actions">
                      <button type="button" onClick={() => toggleGroup(group, perms, allSelected)}>
                        {allSelected ? t('clearGroup') : t('selectAllInGroup')}
                      </button>
                    </div>
                  </div>
                  <div className="perm-grid">
                    {perms.map((perm) => (
                      <label key={perm} className="perm-row">
                        <input
                          type="checkbox"
                          checked={selected.includes(perm)}
                          onChange={() => toggle(perm)}
                        />
                        <span>{actionFromPermission(perm)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '1rem' }}>{error}</p>
        )}
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            <Plus size={14} />
            <span>{t('addRole')}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteRoleDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteRole')}</h3>
      <p className="modal-desc">{t('deleteRoleDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}

export function RoleDetail({
  t,
  role,
  onBack,
  onUpdate,
  onAssignUsers,
  isUpdatePending,
  isAssignPending,
  canUpdate = true,
}) {
  const tCommon = useTranslations('Common');
  const [activeTab, setActiveTab] = useState('permissions');
  const [name, setName] = useState(role?.name || '');
  const [selectedPerms, setSelectedPerms] = useState(
    (role?.permissions || []).map((p) => (typeof p === 'string' ? p : p.name))
  );

  useEffect(() => {
    setName(role?.name || '');
    setSelectedPerms((role?.permissions || []).map((p) => (typeof p === 'string' ? p : p.name)));
  }, [role]);

  const knownPerms = useMemo(() => {
    const fromRole = (role?.permissions || []).map((p) => (typeof p === 'string' ? p : p.name));
    return Array.from(new Set([...DEFAULT_PERMISSIONS, ...fromRole]));
  }, [role]);

  const grouped = useMemo(() => groupPermissions(knownPerms), [knownPerms]);

  const togglePerm = (perm) => {
    setSelectedPerms((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));
  };

  const toggleGroup = (perms, allSelected) => {
    setSelectedPerms((prev) => {
      if (allSelected) return prev.filter((p) => !perms.includes(p));
      return Array.from(new Set([...prev, ...perms]));
    });
  };

  const handleSave = () => {
    onUpdate({ name, permissions: selectedPerms });
  };

  const users = Array.isArray(role?.employees) ? role.employees : [];

  return (
    <div className="role-detail">
      <div className="role-detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button className="btn-outline" onClick={onBack}>
            <ArrowLeft size={14} />
            <span>{t('back')}</span>
          </button>
          <input
            className="modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            style={{ width: 'auto', minWidth: 220 }}
          />
        </div>
        <div className="role-detail-tabs">
          <button
            type="button"
            className={`role-detail-tab ${activeTab === 'permissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            {t('permissionsTab')}
          </button>
          <button
            type="button"
            className={`role-detail-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            {t('usersTab')}
          </button>
        </div>
      </div>

      {activeTab === 'permissions' && (
        <>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('groupedBy')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(grouped).map(([group, perms]) => {
              const allSelected = perms.every((p) => selectedPerms.includes(p));
              return (
                <div key={group} className="perm-group glass-panel">
                  <div className="perm-group-header">
                    <span className="perm-group-title">{formatGroupLabel(group)}</span>
                    <div className="perm-group-actions">
                      <button type="button" onClick={() => toggleGroup(perms, allSelected)}>
                        {allSelected ? t('clearGroup') : t('selectAllInGroup')}
                      </button>
                    </div>
                  </div>
                  <div className="perm-grid">
                    {perms.map((perm) => (
                      <label key={perm} className="perm-row">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(perm)}
                          onChange={() => togglePerm(perm)}
                        />
                        <span>{actionFromPermission(perm)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {canUpdate && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={handleSave} disabled={isUpdatePending}>
                <Check size={14} />
                <span>{t('savePermissions')}</span>
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'users' && (
        <RoleUsersTab
          t={t}
          tCommon={tCommon}
          users={users}
          onAssignUsers={onAssignUsers}
          isAssignPending={isAssignPending}
          canManage={canUpdate}
        />
      )}
    </div>
  );
}

function RoleUsersTab({ t, users, onAssignUsers, isAssignPending, canManage = true }) {
  const [showAdd, setShowAdd] = useState(false);
  const [currentIds, setCurrentIds] = useState(users.map((u) => u.id));

  useEffect(() => {
    setCurrentIds(users.map((u) => u.id));
  }, [users]);

  const handleRemove = (userId) => {
    const next = currentIds.filter((id) => id !== userId);
    setCurrentIds(next);
    onAssignUsers(next);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('usersCount', { count: users.length })}</span>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Users size={14} />
            <span>{t('addUsers')}</span>
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <div className="entity-empty glass-panel">
          <Users size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noUsers')}</p>
        </div>
      ) : (
        <div className="role-users-list">
          {users.map((u) => (
            <div key={u.id} className="role-user-row">
              <div className="role-user-info">
                <span className="name">{u.name}</span>
                <span className="email">{u.email}</span>
              </div>
              {canManage && (
                <button className="btn-icon danger" onClick={() => handleRemove(u.id)} aria-label="Remove">
                  <UserMinus size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <AddUsersDialog
        t={t}
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        currentIds={currentIds}
        onSave={(ids) => {
          onAssignUsers(ids);
          setShowAdd(false);
        }}
        isPending={isAssignPending}
      />
    </>
  );
}

function AddUsersDialog({ t, isOpen, onClose, currentIds, onSave, isPending }) {
  const tCommon = useTranslations('Common');
  // We pull from the employees endpoint because the backend exposes user
  // accounts that way: each employee row carries the underlying user record.
  // TODO: replace with a dedicated /dashboard/users endpoint when available.
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setSelected(currentIds || []);
  }, [isOpen, currentIds]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form" panelStyle={{ maxWidth: 560 }}>
      <div className="modal-header">
        <h3 className="modal-title">{t('selectUsers')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <AddUsersDialogBody
        t={t}
        tCommon={tCommon}
        selected={selected}
        setSelected={setSelected}
      />
      <div className="modal-actions">
        <button type="button" className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button
          type="button"
          className="btn-primary"
          disabled={isPending}
          onClick={() => onSave(selected)}
        >
          <Check size={14} />
          <span>{t('saveUsers')}</span>
        </button>
      </div>
    </Dialog>
  );
}

// Tiny inner component that fetches employees and shows them as a multi-select.
// Kept here so the dialog only mounts the query when it opens.
function AddUsersDialogBody({ t, tCommon, selected, setSelected }) {
  const { data, isLoading } = useEmployees({ per_page: 200 });
  const employees = Array.isArray(data?.data) ? data.data : [];

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="modal-field">
      <label>{t('selectUsers')}</label>
      <div className="multi-select">
        <div className="multi-select-list">
          {isLoading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '0.75rem' }}>
              {tCommon('loading')}
            </p>
          )}
          {!isLoading && employees.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '0.75rem' }}>
              {tCommon('noData')}
            </p>
          )}
          {employees.map((emp) => {
            const userId = emp.user?.id || emp.user_id;
            if (!userId) return null;
            return (
              <label key={`${emp.id}-${userId}`} className="multi-select-row">
                <input
                  type="checkbox"
                  checked={selected.includes(userId)}
                  onChange={() => toggle(userId)}
                />
                <span>{emp.user?.name || emp.name || `#${userId}`}</span>
                <span className="row-sub">{emp.user?.email || emp.email || ''}</span>
              </label>
            );
          })}
        </div>
        {selected.length > 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            {tCommon('selected', { count: selected.length })}
          </p>
        )}
      </div>
    </div>
  );
}
