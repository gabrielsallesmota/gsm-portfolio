export interface AuthUser {
  id: string;
  email: string;
}

export interface Lead {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  segment: string | null;
  status: string;
  deal_value: number | null;
  position: number;
  notes: string | null;
  last_contact_date: string | null;
  created_at: string;
}

export interface ContactHistory {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
}

export interface Contract {
  id: string;
  lead_id: string | null;
  client_name: string;
  monthly_value: number;
  contract_months: number;
  start_date: string;
  end_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Automation {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

export interface Metric {
  id: string;
  company_id: string;
  leads_generated: number;
  messages_sent: number;
  automated_conversations: number;
  time_saved_hours: number;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  lead_id: string | null;
  created_at: string;
  automations: Automation[];
  metrics: Metric | null;
}
