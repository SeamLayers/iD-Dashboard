"use client";

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Info } from 'lucide-react';
import RetryButton from '@/shared/components/RetryButton';
import {
  useBusinessCards,
  useEmployees,
  useApproveBusinessCard,
  useRequestBusinessCardChanges,
  usePublishBusinessCard,
} from '@/shared/api/hooks';
import { useAuth } from '@/shared/auth/AuthProvider';
import { useConfirm } from '@/shared/confirm/ConfirmProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import { ApprovalsTable, ApprovalPreviewDialog, RequestChangesDialog } from '@/components/features/approvals/ApprovalsSections';

function formatSubmitted(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

// Employees pick one of 5 accent swatches when customizing their card. The
// value may be stored as a hex or a named swatch — resolve either to a hex so
// the reviewer sees the true card color (falls back to the brand cyan).
const CARD_ACCENTS = {
  cyan: '#00D3F3', blue: '#00D3F3',
  emerald: '#00C950', green: '#00C950',
  magenta: '#FF2A55', pink: '#FF2A55', red: '#FF2A55',
  gold: '#FF9500', orange: '#FF9500', amber: '#FF9500',
  purple: '#9D4EDD', violet: '#9D4EDD',
};
function resolveCardAccent(data) {
  const raw = data?.accent_color || data?.accentColor || data?.color
    || data?.theme_color || data?.themeColor;
  if (!raw) return null;
  const v = String(raw).trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v;
  return CARD_ACCENTS[v.toLowerCase()] || null;
}

/**
 * Card approvals queue — the owner reviews what each employee personalised.
 *
 * Cards with status `submitted` are pulled from GET /dashboard/business-cards
 * and joined against the employees list for display. The owner either approves
 * (POST /dashboard/business-cards/{id}/approve) or sends the card back with a
 * comment (POST .../request-changes). The legacy /mobile reject route is
 * deliberately not offered here — it is scoped to superadmin|employee and
 * would 403 for a company owner.
 */
export default function ApprovalsPage() {
  const t = useTranslations('Approvals');
  const tCommon = useTranslations('Common');
  const { hasPermission, hasRole } = useAuth();
  const confirm = useConfirm();
  // Role OR permission. The backend deliberately dropped the
  // permission:business_card.approve middleware for these endpoints so owners
  // can review without anyone re-running the roles seeder on the server —
  // gating the buttons on the permission alone just moved that fragility to
  // the client, hiding the review actions from the very person who owns them.
  const isReviewer = hasRole(['superadmin', 'owner']);
  const canApprove = isReviewer || hasPermission('business_card.approve');
  // Sending a card back is part of the same review capability; either review
  // permission is enough to leave a comment.
  const canRequestChanges = isReviewer
    || hasPermission('business_card.approve')
    || hasPermission('business_card.reject');
  const canReview = canApprove || canRequestChanges;

  const {
    data: cardsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBusinessCards({ status: 'submitted', per_page: 100 });
  const { data: employeesData } = useEmployees({ per_page: 200 });

  const approveMutation = useApproveBusinessCard();
  const requestChangesMutation = useRequestBusinessCardChanges();
  const publishMutation = usePublishBusinessCard();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRequestChangesOpen, setIsRequestChangesOpen] = useState(false);
  const [comment, setComment] = useState('');

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
      // Carry the FULL, real card content so the reviewer sees exactly what
      // they're approving — not just a name + 3 fields. Employee (HR) values
      // are authoritative; card_data_json holds what the employee customized.
      return {
        id: card.id,
        name: emp.name || data.name || `#${card.employee_id}`,
        jobTitle: emp.position || data.position || data.title || data.role || '',
        bio: card.bio || data.bio || data.about || '',
        department: deptName || (typeof data.department === 'string' ? data.department : '') || '',
        branch: branchName || (typeof data.branch === 'string' ? data.branch : '') || '',
        company: emp.company?.name || (typeof data.company === 'string' ? data.company : '') || '',
        employeeNumber: emp.employee_number || data.employee_number || '',
        submittedAt: formatSubmitted(card.submitted_at || card.created_at),
        status: card.status || 'submitted',
        phone: emp.phone || data.phone || '',
        secondaryPhone: card.secondary_phone || data.secondary_phone || data.secondaryPhone || '',
        email: emp.email || data.email || '',
        linkedin: data.linkedin || data.linkedIn || '',
        twitter: data.twitter || data.x || '',
        github: data.github || '',
        address: data.address || branchName || '',
        // `effective_theme` is the template theme with the employee's overrides
        // already merged — it is what the published card will actually look like.
        theme: card.effective_theme || card.theme || null,
        accentColor: card.effective_theme?.accent || card.effective_theme?.primary || resolveCardAccent(data),
        reviewComment: card.review_comment || '',
        publicUrl: card.public_url || '',
        qrCode: card.qr_code || '',
        templateName: card.template?.name || '',
        photo: card.photo || '',
        avatar: card.photo || emp.logo || data.image || data.photo || '',
      };
    });
  }, [cardsData, employeesById]);

  const closePreviewModal = () => {
    setSelectedRequest(null);
    setIsFlipped(false);
    setIsRequestChangesOpen(false);
    setComment('');
  };

  const openRequestChangesDialog = () => {
    setComment('');
    setIsRequestChangesOpen(true);
  };

  const closeRequestChangesDialog = () => {
    setIsRequestChangesOpen(false);
    setComment('');
  };

  const handleApprove = async (id) => {
    const target = approvalRequests.find((r) => r.id === id);
    const ok = await confirm({ action: 'approve', name: target?.name });
    if (!ok) return;
    try {
      await approveMutation.mutateAsync(id);
      // Approve only sets status='approved'; the card is not reachable at its
      // public URL until it is published. Chained here so the owner's single
      // "Approve (Publish)" click does what the label promises — otherwise the
      // card silently never went live and the employee's QR stayed empty.
      await publishMutation.mutateAsync(id);
      toast.success(t('approveSuccess'));
      closePreviewModal();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleConfirmRequestChanges = async (event) => {
    // RequestChangesDialog's own form handler already preventDefaults and calls
    // this with no argument, so `event` is optional here.
    event?.preventDefault();
    if (!selectedRequest) return;
    const trimmed = comment.trim();
    if (!trimmed) return;
    const ok = await confirm({ action: 'requestChanges', name: selectedRequest.name });
    if (!ok) return;
    try {
      await requestChangesMutation.mutateAsync({ id: selectedRequest.id, comment: trimmed });
      toast.success(t('requestChangesSuccess'));
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
        <RetryButton onClick={() => refetch()} loading={isLoading} variant="solid" />
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
            setIsRequestChangesOpen(false);
            setComment('');
          }}
        />
      )}

      <ApprovalPreviewDialog
        t={t}
        selectedRequest={selectedRequest}
        isOpen={Boolean(selectedRequest) && !isRequestChangesOpen}
        onClose={closePreviewModal}
        onApprove={handleApprove}
        onOpenRequestChanges={openRequestChangesDialog}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        canApprove={canApprove}
        canRequestChanges={canRequestChanges}
        isApproving={approveMutation.isPending}
      />

      <RequestChangesDialog
        isOpen={Boolean(selectedRequest) && isRequestChangesOpen}
        name={selectedRequest?.name}
        comment={comment}
        setComment={setComment}
        onClose={closeRequestChangesDialog}
        onConfirm={handleConfirmRequestChanges}
        isPending={requestChangesMutation.isPending}
      />
    </div>
  );
}
