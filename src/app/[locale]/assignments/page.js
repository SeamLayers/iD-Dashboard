"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { UserPlus, Briefcase } from 'lucide-react';
import {
  useEmployeeProjects,
  useCreateEmployeeProject,
  useDeleteEmployeeProject,
  useEmployees,
  useProjects,
} from '@/shared/api/hooks';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import Pagination from '@/components/ui/Pagination';
import {
  AssignmentsFilters,
  AssignmentsTable,
  AssignmentFormDialog,
  DeleteAssignmentDialog,
} from '@/components/features/assignments/AssignmentsSections';

export default function AssignmentsPage() {
  const t = useTranslations('Assignments');
  const tCommon = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [employeeId, setEmployeeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [employeeId, projectId]);

  const queryParams = {
    page,
    ...(employeeId ? { employee_id: employeeId } : {}),
    ...(projectId ? { project_id: projectId } : {}),
  };

  const { data, isLoading, isError, error, refetch } = useEmployeeProjects(queryParams);
  const { data: employeesData } = useEmployees({ per_page: 200 });
  const { data: projectsData } = useProjects({ per_page: 200 });

  const createMutation = useCreateEmployeeProject();
  const deleteMutation = useDeleteEmployeeProject();

  const items = Array.isArray(data?.data) ? data.data : [];
  const employees = Array.isArray(employeesData?.data) ? employeesData.data : [];
  const projects = Array.isArray(projectsData?.data) ? projectsData.data : [];
  const meta = data
    ? { current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to, total: data.total }
    : null;

  const handleSubmit = async (payload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success(t('createSuccess'));
      setShowForm(false);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        toast.error(t('duplicateError'));
      } else {
        toast.error(getApiErrorMessage(err));
      }
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
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <UserPlus size={16} />
            <span>{t('addAssignment')}</span>
          </button>
        </div>
      </div>

      <AssignmentsFilters
        t={t}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        projectId={projectId}
        setProjectId={setProjectId}
        employees={employees}
        projects={projects}
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
          <p>{t('noAssignments')}</p>
        </div>
      )}

      {items.length > 0 && (
        <AssignmentsTable t={t} items={items} onDelete={setDeleteTarget} />
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <AssignmentFormDialog
        t={t}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        employees={employees}
        projects={projects}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending}
      />

      <DeleteAssignmentDialog
        t={t}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
