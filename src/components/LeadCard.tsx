import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Phone, Mail } from 'lucide-react';
import type { Lead } from '@/types/crm';

interface LeadCardProps {
  lead: Lead;
  index: number;
  onClick: (lead: Lead) => void;
}

export function LeadCard({ lead, index, onClick }: LeadCardProps) {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
        >
          <Card
            className={`cursor-pointer border-0 shadow-sm hover:shadow-md transition-all ${
              snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''
            }`}
            onClick={() => onClick(lead)}
          >
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm truncate">{lead.company_name}</span>
              </div>
              {lead.contact_name && (
                <p className="text-xs text-muted-foreground truncate">{lead.contact_name}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                  </span>
                )}
                {lead.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                  </span>
                )}
                {lead.segment && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
                    {lead.segment}
                  </span>
                )}
              </div>
              {lead.deal_value && Number(lead.deal_value) > 0 && (
                <p className="text-xs font-semibold text-success">
                  R$ {Number(lead.deal_value).toLocaleString('pt-BR')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
