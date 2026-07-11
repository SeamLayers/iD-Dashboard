import { useQuery } from '@tanstack/react-query';
import { overviewService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

/**
 * Real dashboard analytics (cards + interactions), tenancy-scoped server-side.
 *
 * `retry: false` so that if the backend build serving this dashboard doesn't
 * expose /dashboard/overview yet, the home screen falls back to entity counts
 * and honest empty states instead of hanging — it never shows fake numbers.
 */
export const useOverview = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.overview.all,
    queryFn: () => overviewService.get(),
    enabled: isAuthenticated,
    retry: false,
    staleTime: 60_000,
  });
};
