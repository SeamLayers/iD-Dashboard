import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useRoles = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => rolesService.list(params),
    enabled: isAuthenticated,
  });
};

export const useRole = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => rolesService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => rolesService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.roles.all }),
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => rolesService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.roles.all });
      qc.invalidateQueries({ queryKey: queryKeys.roles.detail(vars.id) });
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => rolesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.roles.all }),
  });
};

export const useAssignUsersToRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, userIds }) => rolesService.assignUsers(roleId, userIds),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.roles.all });
      qc.invalidateQueries({ queryKey: queryKeys.roles.detail(vars.roleId) });
    },
  });
};
