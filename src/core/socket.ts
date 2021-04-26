import { Server, Socket } from 'socket.io';
import http from 'http';

const createSockets = (http: number | http.Server | undefined): Server => {
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
