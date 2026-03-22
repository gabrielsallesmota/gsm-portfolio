import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import type { Company } from '@/types/crm';

export function useCompanyBySlug(slug: string) {
  return useQuery({
    queryKey: ['company', slug],
    queryFn: () => apiRequest<Company>(`/companies/${slug}`),
  });
}

export function useCompanyAutomations(slug: string | undefined) {
  return useQuery({
    queryKey: ['automations', slug],
    enabled: !!slug,
    queryFn: async () => {
      const company = await apiRequest<Company>(`/companies/${slug}`);
      return company.automations;
    },
  });
}

export function useCompanyMetrics(slug: string | undefined) {
  return useQuery({
    queryKey: ['metrics', slug],
    enabled: !!slug,
    queryFn: async () => {
      const company = await apiRequest<Company>(`/companies/${slug}`);
      return company.metrics;
    },
  });
}
