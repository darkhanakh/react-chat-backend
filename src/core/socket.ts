import { Server, Socket } from 'socket.io';
import http from 'http';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createSockets = (http: number | http.Server | undefined) => {
  const io = new Server(http, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    // TODO: Доработать сокеты
  });

  return io;
};

export default createSockets;
