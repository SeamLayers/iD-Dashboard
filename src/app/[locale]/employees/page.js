"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import RetryButton from '@/shared/components/RetryButton';
import { toast } from 'react-hot-toast';
import {
  EmployeesHeader,
  EmployeesFilters,
  EmployeesTable,
  DeleteEmployeeDialog,
} from '@/components/features/employees/EmployeesSections';
import {
  useEmployees,
  useDeleteEmployee,
  useCompaniesForCurrentUser,
  useBranches,
} from '@/shared/api/hooks';
import { useRole } from '@/shared/auth/useRole';
import { useRouter } from '@/i18n/routing';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';

export default function EmployeesPage() {
  const t = useTranslations('Employees');
  const tCommon = useTranslations('Common');
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [companyId, branchId]);

  const queryParams = {
    page,
    ...(companyId ? { company_id: companyId } : {}),
    ...(branchId ? { branch_id: branchId } : {}),
  };

  const { isOwner } = useRole();

  const { data, isLoading, isError, error, refetch } = useEmployees(queryParams);
  const { data: companiesData } = useCompaniesForCurrentUser({ per_page: 100 });
  const { data: branchesData } = useBranches({ per_page: 200 });

  const deleteMutation = useDeleteEmployee();

  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  const filteredEmployees = useMemo(() => {
    const allEmployees = Array.isArray(data?.data) ? data.data : [];
    if (!searchQuery) return allEmployees;
    const q = searchQuery.toLowerCase();
    return allEmployees.filter((emp) => (
      emp.name?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.position?.toLowerCase().includes(q) ||
      emp.employee_number?.toLowerCase().includes(q)
    ));
  }, [data, searchQuery]);

  const meta = data
    ? { current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to, total: data.total }
    : null;

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
    <div className="emp-page">
      <EmployeesHeader
        t={t}
        onSendInvitations={() => toast.success(t('invitationsSent'))}
        onBulkUpload={() => toast(t('bulkUploadHint'))}
        onAddEmployee={() => router.push('/employees/new')}
      />

      <EmployeesFilters
        t={t}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        companyId={companyId}
        setCompanyId={setCompanyId}
        branchId={branchId}
        setBranchId={setBranchId}
        companies={companies}
        branches={branches}
        showCompanyFilter={!isOwner}
      />

      {isLoading && <div className="entity-loading glass-panel">{tCommon('loading')}</div>}

      {isError && (
        <div className="entity-error glass-panel">
          {getApiErrorMessage(error)}
          <div style={{ marginTop: 12 }}>
            <RetryButton onClick={() => refetch()} variant="ghost" />
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <EmployeesTable
          t={t}
          employees={filteredEmployees}
          onEdit={(emp) => router.push(`/employees/new?id=${emp.id}`)}
          onDelete={(emp) => setDeleteTarget(emp)}
        />
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <DeleteEmployeeDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
