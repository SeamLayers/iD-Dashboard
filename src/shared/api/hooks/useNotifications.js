import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: () => notificationsService.list(),
    refetchInterval: 60_000,
    enabled: isAuthenticated,
  });
};

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
};

export const useUpdateDeviceToken = () =>
  useMutation({
    mutationFn: (token) => notificationsService.updateDeviceToken(token),
  });
