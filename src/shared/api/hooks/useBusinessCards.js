import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessCardsService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

export const useBusinessCards = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.businessCards.list(params),
    queryFn: () => businessCardsService.list(params),
    enabled: isAuthenticated,
  });
};

export const useBusinessCard = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.businessCards.detail(id),
    queryFn: () => businessCardsService.show(id),
    enabled: Boolean(id) && isAuthenticated,
  });
};

export const useCreateBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => businessCardsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businessCards.all }),
  });
};

export const useUpdateBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => businessCardsService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.all });
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.detail(vars.id) });
    },
  });
};

export const useDeleteBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => businessCardsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businessCards.all }),
  });
};

export const useSubmitBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => businessCardsService.submit(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.all });
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.detail(id) });
    },
  });
};

export const usePublishBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => businessCardsService.publish(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.all });
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.detail(id) });
    },
  });
};

export const useDeactivateBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => businessCardsService.deactivate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.all });
      qc.invalidateQueries({ queryKey: queryKeys.businessCards.detail(id) });
    },
  });
};

export const useBusinessCardAnalytics = (id, options = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.businessCards.analytics(id),
    // The backend endpoint is POST (treated as a refresh), but we read it
    // through a query so consumers can use it like any other data hook.
    queryFn: () => businessCardsService.analytics(id),
    enabled: Boolean(id) && isAuthenticated && options.enabled !== false,
  });
};
