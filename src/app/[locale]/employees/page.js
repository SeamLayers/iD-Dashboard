"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import {
  EmployeesHeader,
  EmployeesFilters,
  EmployeesTable,
  DeleteEmployeeDialog,
  EmployeeFormDialog,
} from '@/components/features/employees/EmployeesSections';
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useCompaniesForCurrentUser,
  useBranches,
  useDepartments,
} from '@/shared/api/hooks';
import { useAuth } from '@/shared/auth/AuthProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';

export default function EmployeesPage() {
  const t = useTranslations('Employees');
  const tCommon = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [companyId, branchId]);

  const queryParams = {
    page,
    ...(companyId ? { company_id: companyId } : {}),
    ...(branchId ? { branch_id: branchId } : {}),
  };

  const { hasRole } = useAuth();
  const isOwner = hasRole('owner') && !hasRole('superadmin');

  const { data, isLoading, isError, error, refetch } = useEmployees(queryParams);
  const { data: companiesData } = useCompaniesForCurrentUser({ per_page: 100 });
  const { data: branchesData } = useBranches({ per_page: 200 });
  const { data: departmentsData } = useDepartments({ per_page: 200 });

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];
  const departments = Array.isArray(departmentsData?.data) ? departmentsData.data : [];

  const filteredEmployees = useMemo(() => {
    const allEmployees = Array.isArray(data?.data) ? data.data : [];
    if (!searchQuery) return allEmployees;
    const q = searchQuery.toLowerCase();
    return allEmployees.filter((emp) => (
      emp.name?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.employee_number?.toLowerCase().includes(q)
    ));
  }, [data, searchQuery]);

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
      setOpenMenuId(null);
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
        onAddEmployee={() => { setEditTarget(null); setShowForm(true); }}
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
            <button className="btn-outline" onClick={() => refetch()}>{tCommon('retry')}</button>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <EmployeesTable
          t={t}
          employees={filteredEmployees}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onEdit={(emp) => { setEditTarget(emp); setShowForm(true); setOpenMenuId(null); }}
          onDelete={(emp) => { setDeleteTarget(emp); setOpenMenuId(null); }}
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

      <EmployeeFormDialog
        t={t}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
        initial={editTarget}
        companies={companies}
        branches={branches}
        departments={departments}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
