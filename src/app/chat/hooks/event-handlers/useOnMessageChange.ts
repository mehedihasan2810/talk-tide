import {
  ChangeEvent,
  ChangeEventHandler,
  MutableRefObject,
  useRef,
} from "react";
// import { Socket } from "socket.io-client";
// import { STOP_TYPING_EVENT, TYPING_EVENT } from "../../constants";

type UserOnMessageChange = (
  _currentChatIdRef: MutableRefObject<string | null>,
  // _socketClient: Socket | null,
  // _isConnected: boolean,
  _isSelfTyping: boolean,
  _setMessage: (_message: string) => void,
  _setIsSelfTyping: (_isSelfTyping: boolean) => void,
) => ChangeEventHandler<HTMLInputElement>;

export const useOnMessageChange: UserOnMessageChange = (
  // currentChatIdRef,
  // socketClient,
  // isConnected,
  // isSelfTyping,
  // setMessage,
  // setIsSelfTyping,
) => {
  // To keep track of the setTimeout function
  // eslint-disable-next-line no-undef
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // eslint-disable-next-line no-unused-vars
  const handleOnMessageChange = (_e: ChangeEvent<HTMLInputElement>) => {
    // Update the message state with the current input value
    // setMessage(e.target.value);

    // If socket doesn't exist or isn't connected, exit the function
    // if (!socketClient || !isConnected) return;

    // socketClient.emit(JOIN_CHAT_EVENT, currentChatIdRef.current);
    // console.log("foo")

    // Check if the user isn't already set as typing
    // if (!isSelfTyping) {
    //   // Set the user as typing
    //   setIsSelfTyping(true);

    //   // Emit a typing event to the server for the current chat
    //   socketClient.emit(TYPING_EVENT, currentChatIdRef.current);
    // }

    // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 3000;

    // Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      // Emit a stop typing event to the server for the current chat
      // socketClient.emit(STOP_TYPING_EVENT, currentChatIdRef.current);

      // Reset the user's typing state
      // setIsSelfTyping(false);
    }, timerLength);
  };

  return handleOnMessageChange;
};
