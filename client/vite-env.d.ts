// vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Add your custom VITE_ variables here for IntelliSense
    readonly VITE_API_URL: string;
    readonly VITE_APP_TITLE: string;
    // ... more variables
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}