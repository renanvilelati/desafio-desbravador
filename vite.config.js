import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function rewritePrettyRoute(req) {
  if (!req.url) return;
  const pathname = req.url.split('?')[0];

  if (/^\/users\/[^/]+\/?$/.test(pathname)) {
    req.url = '/user.html';
  } else if (/^\/repositories\/[^/]+\/[^/]+\/?$/.test(pathname)) {
    req.url = '/repository.html';
  }
}

function prettyRoutes() {
  return {
    name: 'pretty-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewritePrettyRoute(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewritePrettyRoute(req);
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [prettyRoutes()],
  server: { port: 5173 },
  preview: { port: 4173 },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        user: resolve(__dirname, 'user.html'),
        repository: resolve(__dirname, 'repository.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});
