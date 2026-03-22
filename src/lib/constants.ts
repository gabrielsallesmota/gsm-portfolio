export const LEAD_STATUS_CONFIG = {
  leads_novos: { label: 'Leads Novos', color: 'hsl(220, 15%, 50%)' },
  contato_dia_01: { label: 'Contato Dia 01', color: 'hsl(200, 70%, 50%)' },
  followup_dia_04: { label: 'Follow-up Dia 04', color: 'hsl(38, 92%, 50%)' },
  followup_dia_10: { label: 'Follow-up Dia 10', color: 'hsl(25, 85%, 55%)' },
  followup_dia_15: { label: 'Follow-up Dia 15', color: 'hsl(10, 80%, 55%)' },
  reuniao_agendada: { label: 'Reunião Agendada', color: 'hsl(245, 58%, 51%)' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'hsl(280, 60%, 55%)' },
  fechado: { label: 'Fechado', color: 'hsl(152, 60%, 40%)' },
  perdido: { label: 'Perdido', color: 'hsl(0, 72%, 51%)' },
} as const;

export type LeadStatus = keyof typeof LEAD_STATUS_CONFIG;

export const KANBAN_COLUMNS: LeadStatus[] = [
  'leads_novos',
  'contato_dia_01',
  'followup_dia_04',
  'followup_dia_10',
  'followup_dia_15',
  'reuniao_agendada',
  'proposta_enviada',
  'fechado',
  'perdido',
];
