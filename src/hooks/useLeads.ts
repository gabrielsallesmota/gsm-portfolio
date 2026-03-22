import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import type { ContactHistory, Lead } from '@/types/crm';

export type LeadInsert = Omit<Lead, 'id' | 'created_at'>;
type LeadUpdate = Partial<Omit<Lead, 'id' | 'created_at'>>;
type LeadStatus = Lead['status'];

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => apiRequest<Lead[]>('/leads', { auth: true }),
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lead: LeadInsert) => apiRequest<Lead>('/leads', { method: 'POST', body: lead, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useImportLeads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (leads: LeadInsert[]) => {
      const created: Lead[] = [];

      for (const lead of leads) {
        created.push(await apiRequest<Lead>('/leads', { method: 'POST', body: lead, auth: true }));
      }

      return created;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }: LeadUpdate & { id: string }) =>
      apiRequest<Lead>(`/leads/${id}`, { method: 'PATCH', body: updates, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, position }: { id: string; status: LeadStatus; position: number }) =>
      apiRequest<Lead>(`/leads/${id}/status`, { method: 'PATCH', body: { status, position }, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useContactHistory(leadId: string | null) {
  return useQuery({
    queryKey: ['contact_history', leadId],
    enabled: !!leadId,
    queryFn: () => apiRequest<ContactHistory[]>(`/leads/${leadId}/history`, { auth: true }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/leads/${id}`, { method: 'DELETE', auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useAddContactHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lead_id, note }: { lead_id: string; note: string }) =>
      apiRequest<ContactHistory>(`/leads/${lead_id}/history`, { method: 'POST', body: { note }, auth: true }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['contact_history', vars.lead_id] });
    },
  });
}
