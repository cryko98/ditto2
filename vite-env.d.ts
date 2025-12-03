// We augment the NodeJS namespace to typed process.env.API_KEY instead of redeclaring the global process variable.
// This avoids conflicts with @types/node and ensures the API key is typed correctly.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: any;
  }
}
