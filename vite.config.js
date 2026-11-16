import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  input: {
    home: resolve(rootDir, 'index.html'),
    about: resolve(rootDir, 'about.html'),
    academics: resolve(rootDir, 'academics.html'),
    campus: resolve(rootDir, 'campus.html'),
    studentLife: resolve(rootDir, 'student-life.html'),
    events: resolve(rootDir, 'events.html'),
    resources: resolve(rootDir, 'resources.html'),
    admissions: resolve(rootDir, 'admissions.html'),
    contact: resolve(rootDir, 'contact.html'),
    notFound: resolve(rootDir, '404.html')
  }
});