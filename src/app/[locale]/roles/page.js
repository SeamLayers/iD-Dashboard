"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import RetryButton from '@/shared/components/RetryButton';
import { toast } from 'react-hot-toast';
import { Plus, ShieldCheck } from 'lucide-react';
import {
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAssignUsersToRole,
} from '@/shared/api/hooks';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import { useAuth } from '@/shared/auth/AuthProvider';
import { useRouter } from '@/i18n/routing';
import {
  RoleCard,
  CreateRoleDialog,
  DeleteRoleDialog,
  RoleDetail,
} from '@/components/features/roles/RolesSections';

export default function RolesPage() {
  const t = useTranslations('Roles');
  const tCommon = useTranslations('Common');
  const { hasPermission, hasRole, isReady } = useAuth();
  const router = useRouter();

  // Roles & Permissions manages the GLOBAL platform roles, so it's
  // superadmin-only. The sidebar hides it, but a direct URL would still render
  // it — so guard the route too and bounce anyone else home (no flash of the
  // superadmin cards for an owner). Wait for auth to be ready first.
  const isSuperadmin = hasRole(['superadmin']);
  useEffect(() => {
    if (isReady && !isSuperadmin) router.replace('/');
  }, [isReady, isSuperadmin, router]);

  // Write actions stay permission-checked as belt-and-suspenders.
  const canCreate = hasPermission('role.create');
  const canUpdate = hasPermission('role.update');
  const canDelete = hasPermission('role.delete');

  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const { data: roles, isLoading, isError, error, refetch } = useRoles();

  // When a role is selected, we fetch its full record (which includes `employees`).
  const { data: selectedRoleDetail } = useRole(selectedRoleId);

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();
  const assignMutation = useAssignUsersToRole();

  // Find a fallback row from the list so we can render the detail header
  // even before the detail fetch resolves.
  const selectedRoleFromList = Array.isArray(roles)
    ? roles.find((r) => r.id === selectedRoleId)
    : null;
  const activeRole = selectedRoleDetail || selectedRoleFromList;

  useEffect(() => {
    if (!selectedRoleId) return;
    if (Array.isArray(roles) && roles.length > 0) {
      const stillExists = roles.some((r) => r.id === selectedRoleId);
      if (!stillExists) setSelectedRoleId(null);
    }
  }, [roles, selectedRoleId]);

  const handleCreate = async (payload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success(t('createSuccess'));
      setShowCreate(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleUpdate = async (payload) => {
    if (!selectedRoleId) return;
    try {
      await updateMutation.mutateAsync({ id: selectedRoleId, payload });
      toast.success(t('updateSuccess'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(t('deleteSuccess'));
      if (selectedRoleId === deleteTarget.id) setSelectedRoleId(null);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleAssignUsers = async (userIds) => {
    if (!selectedRoleId) return;
    try {
      await assignMutation.mutateAsync({ roleId: selectedRoleId, userIds });
      toast.success(t('assignUsersSuccess'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  // Non-superadmins are being redirected by the effect above — render nothing
  // in the meantime so the roles UI never flashes for them.
  if (!isReady || !isSuperadmin) return null;

  if (selectedRoleId && activeRole) {
    return (
      <div className="page-wrap">
        <RoleDetail
          t={t}
          role={activeRole}
          onBack={() => setSelectedRoleId(null)}
          onUpdate={handleUpdate}
          onAssignUsers={handleAssignUsers}
          isUpdatePending={updateMutation.isPending}
          isAssignPending={assignMutation.isPending}
          canUpdate={canUpdate}
        />
      </div>
    );
  }

  const items = Array.isArray(roles) ? roles : [];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
        {canCreate && (
          <div className="page-actions">
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} />
              <span>{t('addRole')}</span>
            </button>
          </div>
        )}
      </div>

      {isLoading && <div className="entity-loading glass-panel">{tCommon('loading')}</div>}

      {isError && (
        <div className="entity-error glass-panel">
          {getApiErrorMessage(error)}
          <div style={{ marginTop: 12 }}>
            <RetryButton onClick={() => refetch()} variant="ghost" />
          </div>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="entity-empty glass-panel">
          <ShieldCheck size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noRoles')}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="cards-grid">
          {items.map((role) => (
            <RoleCard
              key={role.id}
              t={t}
              role={role}
              onSelect={(r) => setSelectedRoleId(r.id)}
              onDelete={setDeleteTarget}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}

      <CreateRoleDialog
        t={t}
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <DeleteRoleDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
