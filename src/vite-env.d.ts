/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_SUPABASE_URL: string;
	readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
	readonly VITE_SALES_NOTIFICATION_EMAIL?: string;
	readonly VITE_SEND_LEAD_CONFIRMATION?: 'true' | 'false';
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
