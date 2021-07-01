import logger from './utils/logger';
import { _config } from './config';
import app from './app';
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

if (cluster.isMaster && 'production' === process.env.NODE_ENV) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker: any) => {
    logger.info('worker is online : ', worker.id);

  });
  cluster.on('exit', (worker: any) => {
    logger.info(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app
    .listen(_config.server.connections.port, () => {
      logger.info(`server initialize`);
      logger.info(`server running on port : ${_config.server.connections.port}`);
    })
    .on('error', (e: any) => logger.error(e));
}


