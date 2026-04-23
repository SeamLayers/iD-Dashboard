"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { useDemoStore } from '@/components/DemoStoreProvider';
import { ApprovalsTable, ApprovalPreviewDialog, RejectReasonDialog } from '@/components/features/approvals/ApprovalsSections';

export default function ApprovalsPage() {
  const t = useTranslations('Approvals');
  const tDemo = useTranslations('Demo');
  const { approvalRequests, approveCard, rejectCard } = useDemoStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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

  const handleApprove = (id) => {
    approveCard(id);
    closePreviewModal();
    toast.success(tDemo('cardApproved'));
  };

  const handleConfirmRejection = (event) => {
    event.preventDefault();

    if (!selectedRequest) {
      return;
    }

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      return;
    }

    rejectCard(selectedRequest.id, trimmedReason);
    closePreviewModal();
    toast.error(tDemo('cardRejected'));
  };

  return (
    <div className="emp-page" style={{ animation: 'empFadeIn 0.5s ease-out' }}>
      <div className="emp-header">
        <div>
          <h1 className="emp-title text-gradient">{t('title')}</h1>
          <p className="emp-subtitle">{t('subtitle')}</p>
        </div>
      </div>

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

      <ApprovalPreviewDialog
        t={t}
        selectedRequest={selectedRequest}
        isOpen={Boolean(selectedRequest) && !isRejectDialogOpen}
        onClose={closePreviewModal}
        onApprove={handleApprove}
        onOpenReject={openRejectDialog}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />

      <RejectReasonDialog
        t={t}
        selectedRequest={selectedRequest}
        isOpen={Boolean(selectedRequest) && isRejectDialogOpen}
        reason={rejectReason}
        setReason={setRejectReason}
        onClose={closeRejectDialog}
        onConfirm={handleConfirmRejection}
      />
    </div>
  );
}
