import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import type { Contract } from '@/types/crm';

type ContractInsert = Omit<Contract, 'id' | 'created_at'>;

export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: () => apiRequest<Contract[]>('/contracts', { auth: true }),
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contract: ContractInsert) =>
      apiRequest<Contract>('/contracts', { method: 'POST', body: contract, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  });
}

export function useUpdateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }: Partial<Contract> & { id: string }) =>
      apiRequest<Contract>(`/contracts/${id}`, { method: 'PATCH', body: updates, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  });
}

export function useDeleteContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/contracts/${id}`, { method: 'DELETE', auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  });
}
