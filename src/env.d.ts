/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FACEBOOK_SDK_URL: string;
  readonly VITE_GOOGLE_SDK_URL: string;
  readonly VITE_APPLE_SDK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}