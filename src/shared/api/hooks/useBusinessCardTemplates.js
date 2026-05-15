import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessCardTemplatesService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useBusinessCardTemplates = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.businessCardTemplates.list(params),
    queryFn: () => businessCardTemplatesService.list(params),
    enabled: isAuthenticated,
  });
};

export const useBusinessCardTemplate = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.businessCardTemplates.detail(id),
    queryFn: () => businessCardTemplatesService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateBusinessCardTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => businessCardTemplatesService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businessCardTemplates.all }),
  });
};

export const useUpdateBusinessCardTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => businessCardTemplatesService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.businessCardTemplates.all });
      qc.invalidateQueries({ queryKey: queryKeys.businessCardTemplates.detail(vars.id) });
    },
  });
};

export const useDeleteBusinessCardTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => businessCardTemplatesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businessCardTemplates.all }),
  });
};
