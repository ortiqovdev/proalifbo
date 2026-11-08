import { createApiServer } from './server.js';

const server = createApiServer();
const port = Number(process.env.API_PORT ?? 3001);
const host = process.env.API_HOST ?? '127.0.0.1';
server.on('error', error => { console.error(`API: ${error.message}`); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Pro Alifbo API: http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { server.close(); server.closeIdleConnections(); });
