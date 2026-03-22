
-- Create enum for lead status
CREATE TYPE public.lead_status AS ENUM (
  'leads_novos',
  'contato_dia_01',
  'followup_dia_04',
  'followup_dia_10',
  'followup_dia_15',
  'reuniao_agendada',
  'proposta_enviada',
  'fechado',
  'perdido'
);

-- Create enum for automation status
CREATE TYPE public.automation_status AS ENUM ('ativo', 'pausado');

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  website TEXT,
  segment TEXT,
  status lead_status NOT NULL DEFAULT 'leads_novos',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_contact_date TIMESTAMP WITH TIME ZONE,
  deal_value NUMERIC(12,2),
  position INTEGER NOT NULL DEFAULT 0
);

-- Create companies table (for closed deals / client dashboards)
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automations table
CREATE TABLE public.automations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status automation_status NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metrics table
CREATE TABLE public.metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  automated_conversations INTEGER NOT NULL DEFAULT 0,
  leads_generated INTEGER NOT NULL DEFAULT 0,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  time_saved_hours NUMERIC(8,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Create contact_history table
CREATE TABLE public.contact_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_history ENABLE ROW LEVEL SECURITY;

-- RLS policies: Admin has full access (authenticated users)
CREATE POLICY "Authenticated users can manage leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage companies" ON public.companies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage automations" ON public.automations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage metrics" ON public.metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage contact_history" ON public.contact_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read access for companies, automations, metrics (client dashboard)
CREATE POLICY "Public can view companies" ON public.companies FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view automations" ON public.automations FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view metrics" ON public.metrics FOR SELECT TO anon USING (true);

-- Indexes
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_segment ON public.leads(segment);
CREATE INDEX idx_companies_slug ON public.companies(slug);
CREATE INDEX idx_automations_company ON public.automations(company_id);
CREATE INDEX idx_metrics_company ON public.metrics(company_id);
CREATE INDEX idx_contact_history_lead ON public.contact_history(lead_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_metrics_updated_at
  BEFORE UPDATE ON public.metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
