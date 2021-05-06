import { Server } from 'socket.io';
import http from 'http';

const createSockets = (http: number | http.Server | undefined): Server => {
  const io = new Server(http, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: any) => {
    socket.on('DIALOGS:JOIN', (dialogId: string) => {
      socket.dialogId = dialogId;
      socket.join(dialogId);
    });
    socket.on('DIALOGS:TYPING', (obj: any) => {
      socket.broadcast.emit('DIALOGS:TYPING', obj);
    });
  });

  return io;
};

export default createSockets;
