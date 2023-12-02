export type OnHandleClickCreateChatType = (
  _isGroupChat: boolean,
  _groupName: string,
  _groupParticipants: string[],
  _participant: string | null,
  _setGroupName: () => void,
  _setGroupParticipants: () => void,
  _setParticipant: () => void,
) => void;
