"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { Plus, Briefcase } from 'lucide-react';
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useCompaniesForCurrentUser,
  useBranches,
} from '@/shared/api/hooks';
import { useAuth } from '@/shared/auth/AuthProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';
import {
  DepartmentsFilters,
  DepartmentCard,
  DepartmentFormDialog,
  DeleteDepartmentDialog,
} from '@/components/features/departments/DepartmentsSections';

export default function DepartmentsPage() {
  const t = useTranslations('Departments');
  const tCommon = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, companyId]);

  const queryParams = {
    page,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(companyId ? { company_id: companyId } : {}),
  };

  const { hasRole } = useAuth();
  const isOwner = hasRole('owner') && !hasRole('superadmin');

  const { data, isLoading, isError, error, refetch } = useDepartments(queryParams);
  const { data: companiesData } = useCompaniesForCurrentUser({ per_page: 100 });
  const { data: branchesData } = useBranches({ per_page: 200 });
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const items = Array.isArray(data?.data) ? data.data : [];
  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];
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
            <span>{t('addDepartment')}</span>
          </button>
        </div>
      </div>

      <DepartmentsFilters
        t={t}
        search={search}
        setSearch={setSearch}
        companyId={companyId}
        setCompanyId={setCompanyId}
        companies={companies}
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

      {!isLoading && !isError && items.length === 0 && (
        <div className="entity-empty glass-panel">
          <Briefcase size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noDepartments')}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="cards-grid">
          {items.map((dep) => (
            <DepartmentCard
              key={dep.id}
              t={t}
              department={dep}
              onEdit={(d) => { setEditTarget(d); setShowForm(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <DepartmentFormDialog
        t={t}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
        initial={editTarget}
        companies={companies}
        branches={branches}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteDepartmentDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
