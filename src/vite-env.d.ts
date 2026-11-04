/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LUME_ENV?: string;
  readonly VITE_ENTRA_TENANT_ID?: string;
  readonly VITE_ENTRA_CLIENT_ID?: string;
  readonly VITE_ENTRA_API_SCOPE?: string;
  readonly VITE_LUME_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
