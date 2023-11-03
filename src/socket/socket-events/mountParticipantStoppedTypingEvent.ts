import { Socket } from "socket.io";
import { ChatEventEnum } from "../constants";

const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

export { mountParticipantStoppedTypingEvent };
