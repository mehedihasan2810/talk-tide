import { type Socket } from "socket.io";
import { ChatEventEnum } from "../constants";

const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

export { mountParticipantTypingEvent };
