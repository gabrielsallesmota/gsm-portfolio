import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateLead, useUpdateLead, useDeleteLead, useContactHistory, useAddContactHistory } from '@/hooks/useLeads';
import { LEAD_STATUS_CONFIG, type LeadStatus } from '@/lib/constants';
import type { Lead } from '@/types/crm';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
}

const SEGMENTS = ['Restaurante', 'E-commerce', 'Clínica', 'Imobiliária', 'SaaS', 'Agência', 'Varejo', 'Serviços', 'Outro'];

export function LeadFormDialog({ open, onOpenChange, lead }: Props) {
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const { data: history = [] } = useContactHistory(lead?.id ?? null);
  const addHistory = useAddContactHistory();
  const [historyNote, setHistoryNote] = useState('');

  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    instagram: '',
    website: '',
    segment: '',
    status: 'leads_novos' as LeadStatus,
    notes: '',
    deal_value: '',
  });

  useEffect(() => {
    if (lead) {
      setForm({
        company_name: lead.company_name,
        contact_name: lead.contact_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        instagram: lead.instagram || '',
        website: lead.website || '',
        segment: lead.segment || '',
        status: lead.status as LeadStatus,
        notes: lead.notes || '',
        deal_value: lead.deal_value ? String(lead.deal_value) : '',
      });
    } else {
      setForm({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        instagram: '',
        website: '',
        segment: '',
        status: 'leads_novos',
        notes: '',
        deal_value: '',
      });
    }
  }, [lead, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      deal_value: form.deal_value ? Number(form.deal_value) : null,
    };
    try {
      if (lead) {
        await updateLead.mutateAsync({ id: lead.id, ...payload });
        toast.success('Lead atualizado!');
      } else {
        await createLead.mutateAsync(payload);
        toast.success('Lead criado!');
      }
      onOpenChange(false);
    } catch {
      toast.error('Erro ao salvar lead');
    }
  };

  const handleDelete = async () => {
    if (!lead) return;
    try {
      await deleteLead.mutateAsync(lead.id);
      toast.success('Lead excluído!');
      onOpenChange(false);
    } catch {
      toast.error('Erro ao excluir lead');
    }
  };

  const handleAddHistory = async () => {
    if (!historyNote.trim() || !lead) return;
    await addHistory.mutateAsync({ lead_id: lead.id, note: historyNote });
    setHistoryNote('');
    toast.success('Registro adicionado');
  };

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-display">{lead ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
          {lead && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O lead "{lead.company_name}" será excluído permanentemente junto com todo o histórico de contatos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DialogHeader>

        <Tabs defaultValue="info" className="flex-1 min-h-0">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">Informações</TabsTrigger>
            {lead && <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>}
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <ScrollArea className="h-[50vh] pr-4">
              <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Empresa *</Label>
                    <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Contato</Label>
                    <Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="@usuario" />
                  </div>
                  <div className="space-y-2">
                    <Label>Site</Label>
                    <Input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
                  </div>
                  <div className="space-y-2">
                    <Label>Segmento</Label>
                    <Select value={form.segment} onValueChange={(v) => set('segment', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => set('status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(LEAD_STATUS_CONFIG).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor do Contrato</Label>
                    <Input type="number" value={form.deal_value} onChange={(e) => set('deal_value', e.target.value)} placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} />
                </div>
              </form>
            </ScrollArea>
            <div className="pt-4 flex justify-end">
              <Button type="submit" form="lead-form">
                {lead ? 'Salvar' : 'Criar Lead'}
              </Button>
            </div>
          </TabsContent>

          {lead && (
            <TabsContent value="history" className="mt-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={historyNote}
                    onChange={(e) => setHistoryNote(e.target.value)}
                    placeholder="Adicionar registro de contato..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddHistory()}
                  />
                  <Button onClick={handleAddHistory} size="sm">Adicionar</Button>
                </div>
                <ScrollArea className="h-[45vh]">
                  <div className="space-y-3 pr-4">
                    {history.map((h) => (
                      <div key={h.id} className="rounded-lg bg-muted p-3 space-y-1">
                        <p className="text-sm">{h.note}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(h.created_at), { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">Nenhum registro ainda</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
