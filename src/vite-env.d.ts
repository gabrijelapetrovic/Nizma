/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTFOLIO_URL?: string;
  readonly VITE_FORMSPREE_ENDPOINT?: string;
  readonly VITE_ADMIN_PIN?: string;
  readonly VITE_ADMIN_PIN_HASH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
