// Replaced missing vite/client reference with manual declaration to fix "Cannot find type definition file" error.
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: any;
  }
};
