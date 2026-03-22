# Setup Supabase (Tabelas + Email)

Este painel usa Supabase para:
- autenticacao do admin
- banco de dados (tabelas de leads/contratos etc.)
- envio de email via Edge Function `send-email` (Brevo)

## 1) Variaveis no `.env.local`

```env
VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="SEU_ANON_KEY"
VITE_SALES_NOTIFICATION_EMAIL="seu-email@dominio.com"
VITE_SEND_LEAD_CONFIRMATION="false"
```

## 2) Criar as tabelas (migrations)

No projeto `gsm-portfolio-frontend`, execute:

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

Isso aplica os SQLs de `supabase/migrations` e cria as tabelas.

## 3) Configurar envio de email (Brevo)

Defina os secrets da Edge Function:

```bash
supabase secrets set BREVO_API_KEY="SUA_BREVO_API_KEY"
supabase secrets set BREVO_SENDER_EMAIL="seu-remetente@dominio.com"
supabase secrets set BREVO_SENDER_NAME="GSM"
```

Deploy da funcao:

```bash
supabase functions deploy send-email
```

## 4) Email de criacao de login (Auth)

O email de confirmacao de cadastro nao sai pela Edge Function.
Ele e enviado pelo Supabase Auth.

Para funcionar, configure no painel Supabase:
- Authentication > Email > SMTP (use Brevo)
- e habilite Confirm email se quiser obrigar validacao por email.

Sem SMTP configurado no Supabase Auth, nao chega email de criacao de conta.
