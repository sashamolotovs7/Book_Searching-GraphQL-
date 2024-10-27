/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PROD: string;
    readonly VITE_REACT_APP_GRAPHQL_URI_PRODUCTION: string;
    readonly VITE_REACT_APP_GRAPHQL_URI_LOCAL: string;
    // Add any other environment variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  