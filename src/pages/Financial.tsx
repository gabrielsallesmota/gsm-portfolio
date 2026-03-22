import { useState, useMemo } from 'react';
import { useContracts, useCreateContract, useDeleteContract, type Contract } from '@/hooks/useContracts';
import { useLeads } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, DollarSign, CalendarDays, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

export default function Financial() {
  const { data: contracts = [] } = useContracts();
  const { data: leads = [] } = useLeads();
  const createContract = useCreateContract();
  const deleteContract = useDeleteContract();
  const [dialogOpen, setDialogOpen] = useState(false);

  const closedLeads = useMemo(() => leads.filter((l) => l.status === 'fechado'), [leads]);

  const [form, setForm] = useState({
    client_name: '',
    lead_id: '',
    monthly_value: '',
    contract_months: '12',
    start_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const metrics = useMemo(() => {
    const active = contracts.filter((c) => c.status === 'ativo');
    const mrr = active.reduce((sum, c) => sum + Number(c.monthly_value), 0);
    const totalValue = active.reduce((sum, c) => sum + Number(c.monthly_value) * c.contract_months, 0);
    return {
      totalContracts: contracts.length,
      activeContracts: active.length,
      mrr,
      totalValue,
    };
  }, [contracts]);

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.monthly_value) {
      toast.error('Preencha o nome do cliente e valor mensal');
      return;
    }
    const months = Number(form.contract_months);
    const startDate = new Date(form.start_date);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    try {
      await createContract.mutateAsync({
        client_name: form.client_name,
        lead_id: form.lead_id || null,
        monthly_value: Number(form.monthly_value),
        contract_months: months,
        start_date: form.start_date,
        end_date: endDate.toISOString().split('T')[0],
        status: 'ativo',
        notes: form.notes || null,
      });
      toast.success('Contrato adicionado!');
      setDialogOpen(false);
      setForm({ client_name: '', lead_id: '', monthly_value: '', contract_months: '12', start_date: new Date().toISOString().split('T')[0], notes: '' });
    } catch {
      toast.error('Erro ao criar contrato');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContract.mutateAsync(id);
      toast.success('Contrato excluído');
    } catch {
      toast.error('Erro ao excluir contrato');
    }
  };

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Controle de contratos e receita</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Novo Contrato
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contratos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeContracts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(metrics.mrr)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total Contratos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(metrics.totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Contratos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalContracts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Meses</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum contrato cadastrado
                  </TableCell>
                </TableRow>
              )}
              {contracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.client_name}</TableCell>
                  <TableCell>{fmt(Number(c.monthly_value))}</TableCell>
                  <TableCell>{c.contract_months}</TableCell>
                  <TableCell>{format(new Date(c.start_date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell>{c.end_date ? format(new Date(c.end_date), 'dd/MM/yyyy', { locale: ptBR }) : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === 'ativo' ? 'default' : 'secondary'}>
                      {c.status === 'ativo' ? 'Ativo' : 'Encerrado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir contrato?</AlertDialogTitle>
                          <AlertDialogDescription>
                            O contrato de {c.client_name} será excluído permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Novo Contrato</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Input value={form.client_name} onChange={(e) => set('client_name', e.target.value)} required />
            </div>
            {closedLeads.length > 0 && (
              <div className="space-y-2">
                <Label>Vincular a Lead</Label>
                <Select value={form.lead_id} onValueChange={(v) => {
                  set('lead_id', v);
                  const lead = closedLeads.find((l) => l.id === v);
                  if (lead) set('client_name', lead.company_name);
                }}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    {closedLeads.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.company_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Mensal (R$) *</Label>
                <Input type="number" step="0.01" value={form.monthly_value} onChange={(e) => set('monthly_value', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Duração (meses)</Label>
                <Input type="number" value={form.contract_months} onChange={(e) => set('contract_months', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} />
            </div>
            <Button type="submit" className="w-full">Criar Contrato</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
