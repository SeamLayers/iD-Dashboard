import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useCompanies = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.companies.list(params),
    queryFn: () => companiesService.list(params),
    enabled: isAuthenticated,
  });
};

export const useMyCompany = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.companies.mine,
    queryFn: () => companiesService.getMine(),
    enabled: isAuthenticated,
  });
};

export const useCompany = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => companiesService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => companiesService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.companies.all }),
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => companiesService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.companies.all });
      qc.invalidateQueries({ queryKey: queryKeys.companies.detail(vars.id) });
    },
  });
};

export const useDeleteCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => companiesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.companies.all }),
  });
};
