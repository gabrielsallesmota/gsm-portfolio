import { useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { useImportLeads, type LeadInsert } from '@/hooks/useLeads';
import { parseCsvText, normalizeCsvHeader, type ParsedCsv } from '@/lib/csv';
import { LEAD_STATUS_CONFIG, type LeadStatus } from '@/lib/constants';
import type { Lead } from '@/types/crm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadCsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leads: Lead[];
}

type MappableLeadField =
  | 'company_name'
  | 'contact_name'
  | 'email'
  | 'phone'
  | 'instagram'
  | 'website'
  | 'segment'
  | 'deal_value'
  | 'notes'
  | 'last_contact_date';

const NONE = '__none__';

const FIELD_OPTIONS: Array<{ key: MappableLeadField; label: string; required?: boolean }> = [
  { key: 'company_name', label: 'Empresa', required: true },
  { key: 'contact_name', label: 'Contato' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telefone' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'website', label: 'Site' },
  { key: 'segment', label: 'Segmento' },
  { key: 'deal_value', label: 'Valor do contrato' },
  { key: 'notes', label: 'Observações' },
  { key: 'last_contact_date', label: 'Último contato' },
];

const FIELD_ALIASES: Record<MappableLeadField, string[]> = {
  company_name: ['empresa', 'company', 'company_name', 'nome_empresa', 'razao_social', 'cliente'],
  contact_name: ['contato', 'contact', 'contact_name', 'nome', 'responsavel'],
  email: ['email', 'e_mail', 'mail'],
  phone: ['telefone', 'phone', 'celular', 'whatsapp', 'fone'],
  instagram: ['instagram', 'insta', 'arroba', 'perfil_instagram'],
  website: ['site', 'website', 'url', 'dominio'],
  segment: ['segmento', 'segment', 'nicho', 'mercado'],
  deal_value: ['valor', 'deal_value', 'valor_contrato', 'ticket', 'ticket_medio'],
  notes: ['observacoes', 'observacao', 'obs', 'notas', 'notes'],
  last_contact_date: ['ultimo_contato', 'last_contact_date', 'data_contato', 'data_ultimo_contato'],
};

function emptyMapping(): Record<MappableLeadField, string> {
  return {
    company_name: NONE,
    contact_name: NONE,
    email: NONE,
    phone: NONE,
    instagram: NONE,
    website: NONE,
    segment: NONE,
    deal_value: NONE,
    notes: NONE,
    last_contact_date: NONE,
  };
}

function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const normalized = value.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoCandidate = new Date(trimmed);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate.toISOString();
  }

  const match = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (!match) return null;

  const [, dayRaw, monthRaw, yearRaw] = match;
  const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
  const candidate = new Date(`${year}-${monthRaw.padStart(2, '0')}-${dayRaw.padStart(2, '0')}T00:00:00`);

  return Number.isNaN(candidate.getTime()) ? null : candidate.toISOString();
}

export function LeadCsvImportDialog({ open, onOpenChange, leads }: LeadCsvImportDialogProps) {
  const importLeads = useImportLeads();
  const [parsedCsv, setParsedCsv] = useState<ParsedCsv | null>(null);
  const [fileName, setFileName] = useState('');
  const [destinationStatus, setDestinationStatus] = useState<LeadStatus>('leads_novos');
  const [mapping, setMapping] = useState<Record<MappableLeadField, string>>(emptyMapping());

  useEffect(() => {
    if (!open) {
      setParsedCsv(null);
      setFileName('');
      setDestinationStatus('leads_novos');
      setMapping(emptyMapping());
    }
  }, [open]);

  const previewRows = useMemo(() => parsedCsv?.rows.slice(0, 3) ?? [], [parsedCsv]);
  const destinationCount = useMemo(
    () => leads.filter((lead) => lead.status === destinationStatus).length,
    [destinationStatus, leads],
  );

  const applyAutoMapping = (headers: string[]) => {
    const nextMapping = emptyMapping();
    const normalizedHeaders = headers.map((header) => normalizeCsvHeader(header));

    FIELD_OPTIONS.forEach((field) => {
      const index = normalizedHeaders.findIndex((header) => FIELD_ALIASES[field.key].includes(header));
      if (index >= 0) {
        nextMapping[field.key] = String(index);
      }
    });

    setMapping(nextMapping);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = parseCsvText(await file.text());
      if (parsed.headers.length === 0) {
        toast.error('O CSV está vazio ou sem cabeçalho.');
        return;
      }

      setParsedCsv(parsed);
      setFileName(file.name);
      applyAutoMapping(parsed.headers);
    } catch {
      toast.error('Não foi possível ler esse arquivo CSV.');
    }
  };

  const getMappedValue = (row: string[], field: MappableLeadField): string | null => {
    const selectedIndex = mapping[field];
    if (selectedIndex === NONE) return null;
    const value = row[Number(selectedIndex)]?.trim();
    return value ? value : null;
  };

  const importReady = parsedCsv && mapping.company_name !== NONE && parsedCsv.rows.length > 0;

  const handleImport = async () => {
    if (!parsedCsv) return;
    if (mapping.company_name === NONE) {
      toast.error('Mapeie o campo Empresa antes de importar.');
      return;
    }

    const payloads: LeadInsert[] = parsedCsv.rows
      .map((row, index) => {
        const companyName = getMappedValue(row, 'company_name');
        if (!companyName) return null;

        return {
          company_name: companyName,
          contact_name: getMappedValue(row, 'contact_name'),
          email: getMappedValue(row, 'email'),
          phone: getMappedValue(row, 'phone'),
          instagram: getMappedValue(row, 'instagram'),
          website: getMappedValue(row, 'website'),
          segment: getMappedValue(row, 'segment'),
          status: destinationStatus,
          deal_value: parseNumber(getMappedValue(row, 'deal_value')),
          position: destinationCount + index,
          notes: getMappedValue(row, 'notes'),
          last_contact_date: parseDate(getMappedValue(row, 'last_contact_date')),
        };
      })
      .filter((lead): lead is LeadInsert => lead !== null);

    if (payloads.length === 0) {
      toast.error('Nenhuma linha válida foi encontrada para importar.');
      return;
    }

    try {
      await importLeads.mutateAsync(payloads);
      toast.success(`${payloads.length} leads importados com sucesso.`);
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao importar CSV';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Leads via CSV
          </DialogTitle>
          <DialogDescription>
            Envie um CSV, faça o de/para entre as colunas e os campos do card e crie um lead por linha.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 flex-1 min-h-0 overflow-hidden">
          <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Arquivo CSV</Label>
              <Input id="csv-file" type="file" accept=".csv,text/csv" onChange={handleFileChange} />
            </div>
            {fileName && parsedCsv && (
              <p className="text-sm text-muted-foreground">
                {fileName} ({parsedCsv.rows.length} linhas)
              </p>
            )}
          </div>

          {parsedCsv && (
            <ScrollArea className="flex-1 min-h-0 pr-4">
              <div className="space-y-5">
                <div className="rounded-xl border bg-primary/10 p-4 space-y-3">
                  <Label>Raia de destino</Label>
                  <Select value={destinationStatus} onValueChange={(value) => setDestinationStatus(value as LeadStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LEAD_STATUS_CONFIG).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Mapeamento de colunas</h3>
                    <p className="text-sm text-muted-foreground">Cada linha do CSV vira um card no pipeline.</p>
                  </div>

                  <div className="grid gap-3">
                    {FIELD_OPTIONS.map((field) => (
                      <div key={field.key} className="grid grid-cols-[160px_minmax(0,1fr)] items-center gap-4">
                        <Label className="text-sm">
                          {field.label}
                          {field.required ? ' *' : ''}
                        </Label>
                        <Select
                          value={mapping[field.key]}
                          onValueChange={(value) => setMapping((prev) => ({ ...prev, [field.key]: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma coluna" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NONE}>-- Não mapear --</SelectItem>
                            {parsedCsv.headers.map((header, index) => (
                              <SelectItem key={`${header}-${index}`} value={String(index)}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                  <h3 className="font-semibold">Preview (primeiros 3)</h3>
                  <div className="space-y-3 text-sm">
                    {previewRows.map((row, index) => (
                      <div key={`preview-${index}`} className="rounded-lg bg-background p-3 border space-y-1">
                        <p><strong>Empresa:</strong> {getMappedValue(row, 'company_name') ?? '—'}</p>
                        <p><strong>Contato:</strong> {getMappedValue(row, 'contact_name') ?? '—'}</p>
                        <p><strong>Email:</strong> {getMappedValue(row, 'email') ?? '—'}</p>
                        <p><strong>Telefone:</strong> {getMappedValue(row, 'phone') ?? '—'}</p>
                      </div>
                    ))}
                    {previewRows.length === 0 && (
                      <p className="text-muted-foreground">Nenhuma linha disponível para preview.</p>
                    )}
                  </div>
                </div>

                <div className="h-2" />
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="shrink-0 border-t pt-4 bg-background">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!importReady || importLeads.isPending}>
            <Upload className="h-4 w-4" />
            {importLeads.isPending ? 'Importando...' : `Importar ${parsedCsv?.rows.length ?? 0} leads`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}