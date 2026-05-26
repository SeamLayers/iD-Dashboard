import { useMemo } from 'react';
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

/**
 * Returns the set of companies the *current user* is allowed to scope work to.
 *
 *  - superadmin → full paginated `/dashboard/companies` list.
 *  - owner      → their single `/dashboard/owner/company` shaped as a list-of-one
 *                 so callers can treat both cases identically.
 *  - others     → empty list (no scoping needed).
 *
 * Without this, owners hit the companies index endpoint (superadmin-only) and
 * get back an empty payload — every dependent form select then renders with no
 * options, and the user gets a "please select an item in the list" toast on
 * submit because the `<select required>` has no valid value.
 */
export const useCompaniesForCurrentUser = (params = {}) => {
  const { hasRole, isAuthenticated, isReady } = useAuth();
  const isSuperadmin = hasRole('superadmin');
  const isOwner = !isSuperadmin && hasRole('owner');

  const fullList = useQuery({
    queryKey: queryKeys.companies.list(params),
    queryFn: () => companiesService.list(params),
    enabled: isAuthenticated && isReady && isSuperadmin,
  });

  const mine = useQuery({
    queryKey: queryKeys.companies.mine,
    queryFn: () => companiesService.getMine(),
    enabled: isAuthenticated && isReady && isOwner,
  });

  return useMemo(() => {
    if (isSuperadmin) return fullList;
    if (isOwner) {
      // Reshape `{ ...company }` → `{ data: [company], current_page: 1, ... }`
      // so consumer code can keep using `companiesData?.data` uniformly.
      const company = mine.data || null;
      return {
        ...mine,
        data: company
          ? {
              data: [company],
              current_page: 1,
              last_page: 1,
              from: 1,
              to: 1,
              total: 1,
            }
          : undefined,
      };
    }
    return { data: undefined, isLoading: false, isError: false, error: null, refetch: () => {} };
  }, [isSuperadmin, isOwner, fullList, mine]);
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
