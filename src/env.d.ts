declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.md" {
  const content: string;
  export default content;
}

declare module "*?raw" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
