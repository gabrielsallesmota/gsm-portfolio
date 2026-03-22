
-- Fix overly permissive RLS policies by scoping to authenticated users properly
DROP POLICY "Authenticated users can manage leads" ON public.leads;
DROP POLICY "Authenticated users can manage companies" ON public.companies;
DROP POLICY "Authenticated users can manage automations" ON public.automations;
DROP POLICY "Authenticated users can manage metrics" ON public.metrics;
DROP POLICY "Authenticated users can manage contact_history" ON public.contact_history;

-- Recreate with auth.uid() check
CREATE POLICY "Admin can manage leads" ON public.leads FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage companies" ON public.companies FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage automations" ON public.automations FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage metrics" ON public.metrics FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage contact_history" ON public.contact_history FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
