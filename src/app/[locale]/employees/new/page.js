"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import EmployeeForm from '@/components/features/employees/EmployeeForm';
import {
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  useCompaniesForCurrentUser,
  useBranches,
  useDepartments,
} from '@/shared/api/hooks';
import { useRole } from '@/shared/auth/useRole';
import { useRouter } from '@/i18n/routing';
import { getApiErrorMessage } from '@/shared/api/axios.instance';

function EmployeeFormScreen() {
  const t = useTranslations('Employees');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = Boolean(editId);
  const { isSuperadmin } = useRole();

  const { data: employee, isLoading: loadingEmployee } = useEmployee(editId);
  const { data: companiesData } = useCompaniesForCurrentUser({ per_page: 100 });
  const { data: branchesData } = useBranches({ per_page: 200 });
  const { data: departmentsData } = useDepartments({ per_page: 200 });

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const companies = Array.isArray(companiesData?.data) ? companiesData.data : [];
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];
  const departments = Array.isArray(departmentsData?.data) ? departmentsData.data : [];

  const goBack = () => router.push('/employees');

  const handleSubmit = async (payload) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: editId, payload });
        toast.success(t('updateSuccess'));
      } else {
        const created = await createMutation.mutateAsync(payload);
        // The backend returns a one-time temp password when it provisions the
        // login account itself — surface it so the admin can hand it over
        // (email delivery isn't guaranteed on every environment).
        if (created?.temp_password) {
          toast.success(t('createSuccessTemp', { password: created.temp_password }), { duration: 12000 });
        } else {
          toast.success(t('createSuccess'));
        }
      }
      goBack();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isEdit && loadingEmployee) {
    return <div className="entity-loading glass-panel">{tCommon('loading')}</div>;
  }

  return (
    <EmployeeForm
      mode={isEdit ? 'edit' : 'create'}
      initial={isEdit ? employee : null}
      companies={companies}
      branches={branches}
      departments={departments}
      isSuperadmin={isSuperadmin}
      onSubmit={handleSubmit}
      onCancel={goBack}
      isPending={createMutation.isPending || updateMutation.isPending}
    />
  );
}

export default function NewEmployeePage() {
  return (
    <Suspense fallback={<div className="entity-loading glass-panel">…</div>}>
      <EmployeeFormScreen />
    </Suspense>
  );
}
