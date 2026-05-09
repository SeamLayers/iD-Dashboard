import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useProjects = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => projectsService.list(params),
    enabled: isAuthenticated,
  });
};

export const useProject = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectsService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => projectsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => projectsService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.projects.detail(vars.id) });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
};
