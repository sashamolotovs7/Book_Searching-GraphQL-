// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REACT_APP_GRAPHQL_URI_PRODUCTION: string;
    readonly VITE_REACT_APP_GRAPHQL_URI_LOCAL: string;
    readonly VITE_PROD: string; // Change to VITE_PROD to match Vite's naming convention
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  