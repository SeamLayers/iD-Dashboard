"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import RetryButton from '@/shared/components/RetryButton';
import { toast } from 'react-hot-toast';
import { Plus, Palette } from 'lucide-react';
import {
  useBusinessCardTemplates,
  useCreateBusinessCardTemplate,
  useUpdateBusinessCardTemplate,
  useDeleteBusinessCardTemplate,
  useCompaniesForCurrentUser,
} from '@/shared/api/hooks';
import { useRole } from '@/shared/auth/useRole';
import { useConfirm } from '@/shared/confirm/ConfirmProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';
import {
  BusinessCardTemplateCard,
  BusinessCardTemplateFormDialog,
  DeleteBusinessCardTemplateDialog,
} from '@/components/features/business-card-templates/BusinessCardTemplatesSections';

export default function BusinessCardTemplatesPage() {
  const t = useTranslations('BusinessCardTemplates');
  const tCommon = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [companyId, setCompanyId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [companyId]);

  const queryParams = {
    page,
    ...(companyId ? { company_id: companyId } : {}),
  };

  const { isOwner } = useRole();
  const confirm = useConfirm();

  const { data, isLoading, isError, error, refetch } = useBusinessCardTemplates(queryParams);
  const { data: companiesData } = useCompaniesForCurrentUser({ per_page: 100 });

  const createMutation = useCreateBusinessCardTemplate();
  const updateMutation = useUpdateBusinessCardTemplate();
  const deleteMutation = useDeleteBusinessCardTemplate();

  const items = Array.isArray(data?.data) ? data.data : [];
  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const meta = data
    ? { current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to, total: data.total }
    : null;

  const handleSubmit = async (payload) => {
    // Confirm outside the try: a cancel must leave the dialog open with no toast.
    const ok = await confirm({
      action: editTarget?.id ? 'update' : 'create',
      name: payload?.name || editTarget?.name,
    });
    if (!ok) return;
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
            <span>{t('addTemplate')}</span>
          </button>
        </div>
      </div>

      {!isOwner && (
        <div className="page-filters">
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            <option value="">{t('filterByCompany')}</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

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
          <Palette size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noTemplates')}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="cards-grid">
          {items.map((template) => (
            <BusinessCardTemplateCard
              key={template.id}
              t={t}
              template={template}
              onEdit={(tpl) => { setEditTarget(tpl); setShowForm(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <BusinessCardTemplateFormDialog
        t={t}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
        initial={editTarget}
        companies={companies}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteBusinessCardTemplateDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
