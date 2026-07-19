"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import RetryButton from '@/shared/components/RetryButton';
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
  useRequestBusinessCardChanges,
  useCompaniesForCurrentUser,
  useEmployees,
  useBusinessCardTemplates,
} from '@/shared/api/hooks';
import { useRole } from '@/shared/auth/useRole';
import { useConfirm } from '@/shared/confirm/ConfirmProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';
import {
  BusinessCardCard,
  BusinessCardFormDialog,
  DeleteBusinessCardDialog,
  IssueCardsDialog,
} from '@/components/features/business-cards/BusinessCardsSections';
// Same review dialog the Approvals queue uses — it carries its own copy.
import { RequestChangesDialog } from '@/components/features/approvals/ApprovalsSections';

const STATUSES = ['draft', 'submitted', 'changes_requested', 'approved', 'rejected', 'published'];

const cardName = (card) => card?.card_data_json?.name || card?.employee?.name || undefined;

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
  const [changesTarget, setChangesTarget] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setPage(1);
  }, [companyId, status]);

  const queryParams = {
    page,
    ...(status ? { status } : {}),
    ...(companyId ? { company_id: companyId } : {}),
  };

  const { isOwner } = useRole();
  const confirm = useConfirm();

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
  const requestChangesMutation = useRequestBusinessCardChanges();

  const items = Array.isArray(data?.data) ? data.data : [];
  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const employees = Array.isArray(employeesData?.data) ? employeesData.data : [];
  const templates = Array.isArray(templatesData?.data) ? templatesData.data : [];

  const meta = data
    ? { current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to, total: data.total }
    : null;

  const handleIssue = async (payload) => {
    const ok = await confirm({ action: 'create' });
    if (!ok) return;
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
    const ok = await confirm({ action: 'update', name: cardName(editTarget) });
    if (!ok) return;
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
    const ok = await confirm({ action: 'submit', name: cardName(card) });
    if (!ok) return;
    try {
      await submitMutation.mutateAsync(card.id);
      toast.success(t('submitSuccess'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handlePublish = async (card) => {
    const ok = await confirm({ action: 'publish', name: cardName(card) });
    if (!ok) return;
    try {
      await publishMutation.mutateAsync(card.id);
      toast.success(t('publishSuccess'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const openRequestChanges = (card) => {
    setComment('');
    setChangesTarget(card);
  };

  const closeRequestChanges = () => {
    setChangesTarget(null);
    setComment('');
  };

  const handleRequestChanges = async () => {
    if (!changesTarget?.id) return;
    const trimmed = comment.trim();
    if (!trimmed) return;
    const ok = await confirm({ action: 'requestChanges', name: cardName(changesTarget) });
    if (!ok) return;
    try {
      await requestChangesMutation.mutateAsync({ id: changesTarget.id, comment: trimmed });
      toast.success(t('requestChangesSuccess'));
      closeRequestChanges();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDeactivate = async (card) => {
    const ok = await confirm({ action: 'deactivate', name: cardName(card) });
    if (!ok) return;
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
            <RetryButton onClick={() => refetch()} variant="ghost" />
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
              onRequestChanges={openRequestChanges}
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

      <RequestChangesDialog
        isOpen={Boolean(changesTarget)}
        name={cardName(changesTarget)}
        comment={comment}
        setComment={setComment}
        onClose={closeRequestChanges}
        onConfirm={handleRequestChanges}
        isPending={requestChangesMutation.isPending}
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
