import type { Server } from "socket.io";

const emitSocketEvent = (
  io: Server,
  roomId: string,
  event: string,
  payload: any
) => {
  io.in(roomId).emit(event, payload);
};

export { emitSocketEvent };
