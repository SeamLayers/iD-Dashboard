"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { Plus, Building2, ShieldAlert } from 'lucide-react';
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from '@/shared/api/hooks';
import { useRole } from '@/shared/auth/useRole';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';
import {
  CompanyCard,
  CompanyFormDialog,
  DeleteCompanyDialog,
} from '@/components/features/companies/CompaniesSections';

export default function CompaniesPage() {
  const t = useTranslations('Companies');
  const tCommon = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { isSuperadmin, isReady } = useRole();

  // The companies index endpoint is superadmin-only — gate the query so
  // non-superadmins never fire the request (the guard below renders instead).
  const { data, isLoading, isError, error, refetch } = useCompanies({ page }, { enabled: isSuperadmin });
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();

  const items = Array.isArray(data?.data) ? data.data : [];
  const meta = data
    ? {
        current_page: data.current_page,
        last_page: data.last_page,
        from: data.from,
        to: data.to,
        total: data.total,
      }
    : null;

  const handleSubmit = async (payload) => {
    try {
      if (editTarget?.id) {
        await updateMutation.mutateAsync({ id: editTarget.id, payload });
        toast.success(t('updateSuccess'));
      } else {
        const created = await createMutation.mutateAsync(payload);
        const temp = created?.temp_password;
        // Surface the owner's one-time password so the superadmin can share it.
        toast.success(
          temp ? t('createSuccessTemp', { password: temp }) : t('createSuccess'),
          { duration: temp ? 10000 : 3000 },
        );
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(t('deleteSuccess'));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleAdd = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const handleEdit = (company) => {
    setEditTarget(company);
    setShowForm(true);
  };

  // Page guard: the companies index is superadmin-only (same pattern as my-company).
  if (isReady && !isSuperadmin) {
    return (
      <div className="page-wrap">
        <div className="entity-empty glass-panel">
          <ShieldAlert size={48} />
          <h3>{tCommon('errorOccurred')}</h3>
          <p>{t('forbidden')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={16} />
            <span>{t('addCompany')}</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="entity-loading glass-panel">{tCommon('loading')}</div>
      )}

      {isError && (
        <div className="entity-error glass-panel">
          {getApiErrorMessage(error)}
          <div style={{ marginTop: 12 }}>
            <button className="btn-outline" onClick={() => refetch()}>{tCommon('retry')}</button>
          </div>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="entity-empty glass-panel">
          <Building2 size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noCompanies')}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="cards-grid">
          {items.map((company) => (
            <CompanyCard
              key={company.id}
              t={t}
              company={company}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <CompanyFormDialog
        t={t}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditTarget(null);
        }}
        initial={editTarget}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteCompanyDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
