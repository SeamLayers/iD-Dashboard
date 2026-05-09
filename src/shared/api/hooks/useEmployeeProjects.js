import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeProjectsService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useEmployeeProjects = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.employeeProjects.list(params),
    queryFn: () => employeeProjectsService.list(params),
    enabled: isAuthenticated,
  });
};

export const useCreateEmployeeProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => employeeProjectsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.employeeProjects.all });
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.employees.all });
    },
  });
};

export const useDeleteEmployeeProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => employeeProjectsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.employeeProjects.all });
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.employees.all });
    },
  });
};
