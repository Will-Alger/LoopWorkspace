import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The production build is emitted into the Spring Boot static resources
// directory so `mvn package` produces a single deployable JAR.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
