import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        academics: resolve(__dirname, 'academics.html'),
        campus: resolve(__dirname, 'campus.html'),
        admissions: resolve(__dirname, 'admissions.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});