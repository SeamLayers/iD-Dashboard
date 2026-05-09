import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useBranches = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.branches.list(params),
    queryFn: () => branchesService.list(params),
    enabled: isAuthenticated,
  });
};

export const useBranch = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.branches.detail(id),
    queryFn: () => branchesService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => branchesService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.branches.all }),
  });
};

export const useUpdateBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => branchesService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.branches.all });
      qc.invalidateQueries({ queryKey: queryKeys.branches.detail(vars.id) });
    },
  });
};

export const useDeleteBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => branchesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.branches.all }),
  });
};
