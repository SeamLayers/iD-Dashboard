import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useDepartments = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.departments.list(params),
    queryFn: () => departmentsService.list(params),
    enabled: isAuthenticated,
  });
};

export const useDepartment = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.departments.detail(id),
    queryFn: () => departmentsService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => departmentsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.departments.all }),
  });
};

export const useUpdateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => departmentsService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.departments.all });
      qc.invalidateQueries({ queryKey: queryKeys.departments.detail(vars.id) });
    },
  });
};

export const useDeleteDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => departmentsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.departments.all }),
  });
};
