"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { Plus, CreditCard } from 'lucide-react';
import {
  useBusinessCards,
  useCreateBusinessCard,
  useUpdateBusinessCard,
  useDeleteBusinessCard,
  useSubmitBusinessCard,
  usePublishBusinessCard,
  useDeactivateBusinessCard,
  useCompaniesForCurrentUser,
  useEmployees,
  useBusinessCardTemplates,
} from '@/shared/api/hooks';
import { useAuth } from '@/shared/auth/AuthProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';
import {
  BusinessCardCard,
  BusinessCardFormDialog,
  DeleteBusinessCardDialog,
  IssueCardsDialog,
} from '@/components/features/business-cards/BusinessCardsSections';

const STATUSES = ['draft', 'submitted', 'approved', 'rejected', 'published'];

export default function BusinessCardsPage() {
  const t = useTranslations('BusinessCards');
  const tCommon = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [companyId, setCompanyId] = useState('');
  const [status, setStatus] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showIssue, setShowIssue] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [companyId, status]);

  const queryParams = {
    page,
    ...(status ? { status } : {}),
    ...(companyId ? { company_id: companyId } : {}),
  };

  const { hasRole } = useAuth();
  const isOwner = hasRole('owner') && !hasRole('superadmin');

  const { data, isLoading, isError, error, refetch } = useBusinessCards(queryParams);
  const { data: companiesData } = useCompaniesForCurrentUser({ per_page: 100 });
  const { data: employeesData } = useEmployees({ per_page: 200, ...(companyId ? { company_id: companyId } : {}) });
  const { data: templatesData } = useBusinessCardTemplates({ per_page: 100, ...(companyId ? { company_id: companyId } : {}) });

  const createMutation = useCreateBusinessCard();
  const updateMutation = useUpdateBusinessCard();
  const deleteMutation = useDeleteBusinessCard();
  const submitMutation = useSubmitBusinessCard();
  const publishMutation = usePublishBusinessCard();
  const deactivateMutation = useDeactivateBusinessCard();

  const items = Array.isArray(data?.data) ? data.data : [];
  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const employees = Array.isArray(employeesData?.data) ? employeesData.data : [];
  const templates = Array.isArray(templatesData?.data) ? templatesData.data : [];

  const meta = data
    ? { current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to, total: data.total }
    : null;

  const handleIssue = async (payload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success(t('createSuccess'));
      setShowIssue(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleUpdate = async (payload) => {
    if (!editTarget?.id) return;
    try {
      await updateMutation.mutateAsync({ id: editTarget.id, payload });
      toast.success(t('updateSuccess'));
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

  const handleSubmitForReview = async (card) => {
    try {
      await submitMutation.mutateAsync(card.id);
      toast.success(t('submitSuccess'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handlePublish = async (card) => {
    try {
      await publishMutation.mutateAsync(card.id);
      toast.success(t('publishSuccess'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDeactivate = async (card) => {
    try {
      await deactivateMutation.mutateAsync(card.id);
      toast.success(t('deactivateSuccess'));
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
          <button className="btn-primary" onClick={() => setShowIssue(true)}>
            <Plus size={16} />
            <span>{t('issueCards')}</span>
          </button>
        </div>
      </div>

      <div className="page-filters">
        {!isOwner && (
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            <option value="">{t('filterByCompany')}</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <div className="status-toggles">
          <button
            type="button"
            className={`status-toggle ${!status ? 'active' : ''}`}
            onClick={() => setStatus('')}
          >
            {tCommon('all')}
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`status-toggle ${status === s ? 'active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {t(`status_${s}`)}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="entity-loading glass-panel">{tCommon('loading')}</div>}

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
          <CreditCard size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noCards')}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="cards-grid">
          {items.map((card) => (
            <BusinessCardCard
              key={card.id}
              t={t}
              tCommon={tCommon}
              card={card}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onSubmit={handleSubmitForReview}
              onPublish={handlePublish}
              onDeactivate={handleDeactivate}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <IssueCardsDialog
        t={t}
        isOpen={showIssue}
        onClose={() => setShowIssue(false)}
        employees={employees}
        templates={templates}
        companies={companies}
        onSubmit={handleIssue}
        isPending={createMutation.isPending}
      />

      <BusinessCardFormDialog
        t={t}
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        initial={editTarget}
        templates={templates}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />

      <DeleteBusinessCardDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
