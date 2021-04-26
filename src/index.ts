import './core/db';

import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';

import createRoutes from './core/routes';
import createSockets from './core/socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = createSockets(httpServer);

createRoutes(app, io);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`);
});
