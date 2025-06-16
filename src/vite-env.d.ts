/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add any other env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
