"use client";

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { ShieldCheck, RefreshCcw, Info } from 'lucide-react';
import {
  useBusinessCards,
  useEmployees,
  useApproveBusinessCard,
  useRejectBusinessCard,
} from '@/shared/api/hooks';
import { useAuth } from '@/shared/auth/AuthProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import { ApprovalsTable, ApprovalPreviewDialog, RejectReasonDialog } from '@/components/features/approvals/ApprovalsSections';

function formatSubmitted(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

/**
 * Card approvals queue — real submitted business cards awaiting review.
 *
 * Cards with status `submitted` are pulled from GET /dashboard/business-cards
 * and joined against the employees list for display. Approve / reject call the
 * real /mobile/business-cards/{id}/approve|reject endpoints, which only
 * superadmins (and the mobile reviewer employee) may perform — so the review
 * actions are gated on the `business_card.approve` / `.reject` permissions.
 */
export default function ApprovalsPage() {
  const t = useTranslations('Approvals');
  const tCommon = useTranslations('Common');
  const { hasPermission } = useAuth();
  const canApprove = hasPermission('business_card.approve');
  const canReject = hasPermission('business_card.reject');
  const canReview = canApprove || canReject;

  const {
    data: cardsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBusinessCards({ status: 'submitted', per_page: 100 });
  const { data: employeesData } = useEmployees({ per_page: 200 });

  const approveMutation = useApproveBusinessCard();
  const rejectMutation = useRejectBusinessCard();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const employeesById = useMemo(() => {
    const rows = Array.isArray(employeesData?.data) ? employeesData.data : [];
    const map = {};
    rows.forEach((e) => { map[e.id] = e; });
    return map;
  }, [employeesData]);

  const approvalRequests = useMemo(() => {
    const cards = Array.isArray(cardsData?.data) ? cardsData.data : [];
    return cards.map((card) => {
      const emp = employeesById[card.employee_id] || {};
      const data = card.card_data_json || {};
      const deptName = typeof emp.department === 'object' ? emp.department?.name : emp.department;
      const branchName = typeof emp.branch === 'object' ? emp.branch?.name : emp.branch;
      return {
        id: card.id,
        name: emp.name || data.name || `#${card.employee_id}`,
        jobTitle: emp.position || data.position || data.title || '—',
        department: deptName || '—',
        submittedAt: formatSubmitted(card.submitted_at || card.created_at),
        phone: emp.phone || data.phone || '—',
        email: emp.email || data.email || '—',
        linkedin: data.linkedin || data.linkedIn || '—',
        address: data.address || branchName || '—',
      };
    });
  }, [cardsData, employeesById]);

  const closePreviewModal = () => {
    setSelectedRequest(null);
    setIsFlipped(false);
    setIsRejectDialogOpen(false);
    setRejectReason('');
  };

  const openRejectDialog = () => {
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setIsRejectDialogOpen(false);
    setRejectReason('');
  };

  const handleApprove = async (id) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success(t('approveSuccess'));
      closePreviewModal();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleConfirmRejection = async (event) => {
    event.preventDefault();
    if (!selectedRequest) return;
    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) return;
    try {
      await rejectMutation.mutateAsync({ id: selectedRequest.id, reason: trimmedReason });
      toast.success(t('rejectSuccess'));
      closePreviewModal();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <div className="emp-page" style={{ animation: 'empFadeIn 0.5s ease-out' }}>
      <div className="emp-header">
        <div>
          <h1 className="emp-title text-gradient">{t('title')}</h1>
          <p className="emp-subtitle">{t('subtitle')}</p>
        </div>
        <button className="btn-secondary" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCcw size={16} />
          <span>{tCommon('retry')}</span>
        </button>
      </div>

      {!canReview && (
        <div className="glass-panel" style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.9rem 1.1rem', marginBottom: '1rem' }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--accent-cyan, #00C4CC)' }} />
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{t('reviewerNote')}</p>
        </div>
      )}

      {isLoading && <div className="entity-loading glass-panel">{tCommon('loading')}</div>}

      {isError && (
        <div className="entity-empty glass-panel">
          <ShieldCheck size={44} style={{ opacity: 0.4, marginBottom: 12 }} />
          <h3>{tCommon('errorOccurred')}</h3>
          <p>{getApiErrorMessage(error)}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <ApprovalsTable
          t={t}
          approvalRequests={approvalRequests}
          onPreview={(request) => {
            setSelectedRequest(request);
            setIsFlipped(false);
            setIsRejectDialogOpen(false);
            setRejectReason('');
          }}
        />
      )}

      <ApprovalPreviewDialog
        t={t}
        selectedRequest={selectedRequest}
        isOpen={Boolean(selectedRequest) && !isRejectDialogOpen}
        onClose={closePreviewModal}
        onApprove={handleApprove}
        onOpenReject={openRejectDialog}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        canApprove={canApprove}
        canReject={canReject}
        isApproving={approveMutation.isPending}
      />

      <RejectReasonDialog
        t={t}
        selectedRequest={selectedRequest}
        isOpen={Boolean(selectedRequest) && isRejectDialogOpen}
        reason={rejectReason}
        setReason={setRejectReason}
        onClose={closeRejectDialog}
        onConfirm={handleConfirmRejection}
        isPending={rejectMutation.isPending}
      />
    </div>
  );
}
