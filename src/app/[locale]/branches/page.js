"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import RetryButton from '@/shared/components/RetryButton';
import { toast } from 'react-hot-toast';
import { Plus, MapPin } from 'lucide-react';
import {
  useBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
  useCompaniesForCurrentUser,
} from '@/shared/api/hooks';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';
import {
  BranchCard,
  BranchFormDialog,
  DeleteBranchDialog,
} from '@/components/features/branches/BranchesSections';

export default function BranchesPage() {
  const t = useTranslations('Branches');
  const tCommon = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, error, refetch } = useBranches({ page });
  const { data: companiesData } = useCompaniesForCurrentUser({ per_page: 100 });
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();

  const items = Array.isArray(data?.data) ? data.data : [];
  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const meta = data
    ? { current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to, total: data.total }
    : null;

  const handleSubmit = async (payload) => {
    try {
      if (editTarget?.id) {
        await updateMutation.mutateAsync({ id: editTarget.id, payload });
        toast.success(t('updateSuccess'));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t('createSuccess'));
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

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
            <Plus size={16} />
            <span>{t('addBranch')}</span>
          </button>
        </div>
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
          <MapPin size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noBranches')}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="cards-grid">
          {items.map((branch) => (
            <BranchCard
              key={branch.id}
              t={t}
              branch={branch}
              onEdit={(b) => { setEditTarget(b); setShowForm(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <BranchFormDialog
        t={t}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
        initial={editTarget}
        companies={companies}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteBranchDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
