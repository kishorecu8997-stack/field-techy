import { defineConfig } from '@hey-api/openapi-ts';
import { loadEnv } from 'vite';
 
const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd());
 
// This is for debugging purposes
console.log(`Running OpenAPI generation in '${mode}' mode`);
console.log(`Input API URL: ${env.VITE_API_OPENAPI_URL}`);
 
export default defineConfig({
  input: env.VITE_API_OPENAPI_URL,
  output: 'src/api',
  plugins: [
    '@hey-api/client-fetch',
    {
      name: '@tanstack/react-query',
    },
  ],
});