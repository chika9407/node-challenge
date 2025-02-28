import config from 'config';
import context from './middleware/context';
import express from 'express';
import gracefulShutdown from './packages/utils/graceful-shutdown';
import helmet from 'helmet';
import Logger from './packages/utils/logging';
import security from './middleware/security';
import { router as userRoutes } from './packages/domains/user';
import { createServer as createHTTPServer, Server } from 'http';
import { createServer as createHTTPSServer, Server as SecureServer } from 'https';

const logger = Logger('server');
const app = express();
const server: Server | SecureServer = (config.https.enabled === true) ? createHTTPSServer(config.https, app as any) : createHTTPServer(app as any);
server.ready = false;

gracefulShutdown(server);

app.use(helmet());
app.get('/readycheck', function readinessEndpoint(req, res) {
  const status = (server.ready) ? 200 : 503;
  res.status(status).send(status === 200 ? 'OK' : 'NOT OK');
});

app.get('/healthcheck', function healthcheckEndpoint(req, res) {
  res.status(200).send('OK');
});

app.use(context);
app.use(security);

app.use('/user', userRoutes);

// app.use(function(err, req, res) {
//   res.status(500).json(err);
// });

app.use(function(req, res){
  res.status(404).send('Page not found')
})

server.listen(config.port, () => {
  server.ready = true;
  console.log(`Server started on port ${config.port}`);
});

export default server;
