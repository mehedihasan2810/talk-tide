/* eslint-disable no-unused-vars */
export enum ChatEvents {
  CONNECTED_EVENT = "connected",
  DISCONNECT_EVENT = "disconnect",
  JOIN_CHAT_EVENT = "joinChat",
  NEW_CHAT_EVENT = "newChat",
  TYPING_EVENT = "typing",
  STOP_TYPING_EVENT = "stopTyping",
  MESSAGE_RECEIVED_EVENT = "messageReceived",
  LEAVE_CHAT_EVENT = "leaveChat",
  UPDATE_GROUP_NAME_EVENT = "updateGroupName",
}

export const {
  CONNECTED_EVENT,
  DISCONNECT_EVENT,
  JOIN_CHAT_EVENT,
  NEW_CHAT_EVENT,
  TYPING_EVENT,
  STOP_TYPING_EVENT,
  MESSAGE_RECEIVED_EVENT,
  LEAVE_CHAT_EVENT,
  UPDATE_GROUP_NAME_EVENT,
} = ChatEvents;
