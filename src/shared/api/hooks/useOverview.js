import { useQuery } from '@tanstack/react-query';
import { overviewService } from '../services';
import { queryKeys } from './queryKeys';
import { useAuth } from '@/shared/auth/AuthProvider';

/**
 * Everything the home screen shows: entity counts, card figures and interaction
 * analytics, all tenancy-scoped server-side.
 *
 * This is now the screen's ONLY data source — the six per_page=1 list calls it
 * used to fall back on reported page-1 row counts rather than real totals, and
 * returned nothing at all for a superadmin. Consequence: the dashboard build
 * must not be deployed ahead of a backend that returns `entities`, otherwise
 * `retry: false` sends the home screen straight to its error panel.
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
