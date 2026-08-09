import 'dotenv/config';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './app';

const port = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use((await import('express')).default.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Faragh Agency server running on http://0.0.0.0:${port}`);
});
