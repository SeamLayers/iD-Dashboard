import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useEmployees = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.employees.list(params),
    queryFn: () => employeesService.list(params),
    enabled: isAuthenticated,
  });
};

export const useEmployee = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn: () => employeesService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => employeesService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.employees.all }),
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => employeesService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.employees.all });
      qc.invalidateQueries({ queryKey: queryKeys.employees.detail(vars.id) });
    },
  });
};

export const useDeleteEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => employeesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.employees.all }),
  });
};
