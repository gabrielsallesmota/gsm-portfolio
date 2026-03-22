import { useLeads } from '@/hooks/useLeads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, PhoneCall, Calendar, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { LEAD_STATUS_CONFIG } from '@/lib/constants';

export default function AdminDashboard() {
  const { data: leads = [] } = useLeads();

  const total = leads.length;
  const followUps = leads.filter((l) =>
    ['contato_dia_01', 'followup_dia_04', 'followup_dia_10', 'followup_dia_15'].includes(l.status)
  ).length;
  const reunioes = leads.filter((l) => l.status === 'reuniao_agendada').length;
  const fechados = leads.filter((l) => l.status === 'fechado').length;
  const perdidos = leads.filter((l) => l.status === 'perdido').length;
  const taxa = total > 0 ? ((fechados / (fechados + perdidos || 1)) * 100).toFixed(1) : '0';
  const totalValor = leads
    .filter((l) => l.status === 'fechado')
    .reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0);

  const stats = [
    { label: 'Total de Leads', value: total, icon: Users, color: 'text-primary' },
    { label: 'Em Follow-up', value: followUps, icon: PhoneCall, color: 'text-warning' },
    { label: 'Reuniões Agendadas', value: reunioes, icon: Calendar, color: 'text-accent-foreground' },
    { label: 'Contratos Fechados', value: fechados, icon: CheckCircle, color: 'text-success' },
    { label: 'Taxa de Conversão', value: `${taxa}%`, icon: TrendingUp, color: 'text-primary' },
    { label: 'Valor Total Fechado', value: `R$ ${totalValor.toLocaleString('pt-BR')}`, icon: Clock, color: 'text-success' },
  ];

  const statusCounts = Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => ({
    status: key,
    label: config.label,
    color: config.color,
    count: leads.filter((l) => l.status === key).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da prospecção</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="font-display text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusCounts.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-sm flex-1">{s.label}</span>
                <span className="font-display font-semibold text-sm">{s.count}</span>
                <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${leads.length > 0 ? (s.count / leads.length) * 100 : 0}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
