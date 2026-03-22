import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useLeads, useUpdateLeadStatus } from '@/hooks/useLeads';
import { LeadCard } from '@/components/LeadCard';
import { LeadFormDialog } from '@/components/LeadFormDialog';
import { LeadCsvImportDialog } from '@/components/LeadCsvImportDialog';
import { KANBAN_COLUMNS, LEAD_STATUS_CONFIG, type LeadStatus } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Upload } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Lead } from '@/types/crm';

const SEGMENTS = ['Restaurante', 'E-commerce', 'Clínica', 'Imobiliária', 'SaaS', 'Agência', 'Varejo', 'Serviços', 'Outro'];

export default function Pipeline() {
  const { data: leads = [] } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch = !search || l.company_name.toLowerCase().includes(search.toLowerCase());
      const matchSegment = segmentFilter === 'all' || l.segment === segmentFilter;
      return matchSearch && matchSegment;
    });
  }, [leads, search, segmentFilter]);

  const columns = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    KANBAN_COLUMNS.forEach((col) => {
      map[col] = filtered.filter((l) => l.status === col).sort((a, b) => a.position - b.position);
    });
    return map;
  }, [filtered]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    updateStatus.mutate({
      id: draggableId,
      status: destination.droppableId as LeadStatus,
      position: destination.index,
    });
  };

  const openNew = () => {
    setSelectedLead(null);
    setDialogOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground text-sm">{leads.length} leads no total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-48"
            />
          </div>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-1" /> Importar CSV
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-1" /> Novo Lead
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <ScrollArea className="flex-1">
          <div className="flex gap-3 pb-4" style={{ minWidth: `${KANBAN_COLUMNS.length * 260}px` }}>
            {KANBAN_COLUMNS.map((col) => (
              <div key={col} className="w-[250px] shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LEAD_STATUS_CONFIG[col].color }} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {LEAD_STATUS_CONFIG[col].label}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {columns[col]?.length || 0}
                  </span>
                </div>
                <Droppable droppableId={col}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] rounded-xl p-2 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-accent' : 'bg-muted/50'
                      }`}
                    >
                      {columns[col]?.map((lead, i) => (
                        <LeadCard key={lead.id} lead={lead} index={i} onClick={openEdit} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DragDropContext>

      <LeadFormDialog open={dialogOpen} onOpenChange={setDialogOpen} lead={selectedLead} />
      <LeadCsvImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} leads={leads} />
    </div>
  );
}
