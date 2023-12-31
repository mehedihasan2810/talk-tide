import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatItem from "@/app/chat/components/ChatItem";
import { useDeleteChat } from "@/app/chat/hooks/mutations/useDeleteChat";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/stores/useStore";

// Mocking dependencies
jest.mock("@/lib/stores/useStore", () => ({
  useStore: jest.fn().mockReturnValue({
    toggleGroupDetailsModal: jest.fn(),
  }),
}));

jest.mock("@/app/chat/hooks/mutations/useDeleteChat", () => ({
  useDeleteChat: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock("@/app/chat/hooks/useCreateQueryString", () => ({
  useCreateQueryString: jest.fn(() => jest.fn()),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn(),
  }),
}));

// Mocking moment.js to keep the same time for testing
jest.mock("moment", () => {
  const momentMock = jest.requireActual("moment");
  return (date: string) => momentMock(date).utcOffset(0); // Mocking with UTC offset 0
});

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn().mockReturnValue({
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

// Dummy data for testing
const dummyUser = {
  id: "user1",
  avatar: {
    url: "avatar1.jpg",
    localPath: "local/avatar1.jpg",
  },
  username: "testuser",
  email: "test@example.com",
  isEmailVerified: true,
  loginType: "email",
  role: "user",
  createdAt: "2022-01-01T12:00:00Z",
  updatedAt: "2022-01-01T12:00:00Z",
};

const dummyChat = {
  id: "chat1",
  adminId: "admin1",
  isGroupChat: false,
  chatMessages: [
    {
      id: "message1",
      sender: dummyUser,
      senderId: dummyUser.id,
      content: "Hello!",
      chatId: "chat1",
      attachments: [],
      createdAt: "2022-01-01T12:30:00Z",
      updatedAt: "2022-01-01T12:30:00Z",
    },
  ],
  name: "Chat 1",
  participantIds: [dummyUser.id],
  participants: [dummyUser],
  createdAt: "2022-01-01T12:00:00Z",
  updatedAt: "2022-01-01T12:30:00Z",
};

const dummySessionUser = {
  id: "user1",
  email: "test@example.com",
  username: "testuser",
  role: "USER",
};

describe("ChatItem Component", () => {
  test("should render properly & match snapshot", () => {
    // ARRANGE
    const { asFragment } = render(
      <ChatItem
        chat={dummyChat}
        onClick={() => {}}
        user={dummySessionUser}
        onChatDelete={() => {}}
      />,
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  // --------------------------------------------------------------

  test("should handle click event", async () => {
    // MOCK
    const onClickMock = jest.fn();

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(
      <ChatItem
        chat={dummyChat}
        onClick={onClickMock}
        user={dummySessionUser}
        onChatDelete={() => {}}
      />,
    );

    // ACT
    await user.click(screen.getByTestId("chatItem-container"));

    // ASSERT
    expect(onClickMock).toHaveBeenCalledWith(dummyChat);
  });

  // --------------------------------------------------------------

  test("should render group chat avatars properly", async () => {
    // MOCK
    const groupChat = {
      ...dummyChat,
      isGroupChat: true,
      participantIds: ["user1", "user2", "user3"],
      participants: [
        { ...dummyUser, id: "user1" },
        { ...dummyUser, id: "user2" },
        { ...dummyUser, id: "user3" },
      ],
    };

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(
      <ChatItem
        chat={groupChat}
        onClick={() => {}}
        user={dummySessionUser}
        onChatDelete={() => {}}
      />,
    );

    // ACT
    await user.click(screen.getByTestId("pop-trigger"));
    await user.click(screen.getByRole("button", { name: "About group" }));

    // ASSERT
    expect(useRouter().replace).toHaveBeenCalled();
    expect(useStore().toggleGroupDetailsModal).toHaveBeenCalledWith(true);
    expect(screen.getAllByTestId("grp-part-avatar")).toHaveLength(3);
  });

  // ---------------------------------------------------------------

  test("should display the unread count badge", () => {
    const unreadCount = 5;
    render(
      <ChatItem
        chat={dummyChat}
        onClick={() => {}}
        user={dummySessionUser}
        onChatDelete={() => {}}
        unreadCount={unreadCount}
      />,
    );
    expect(screen.getByText(`${unreadCount}`)).toBeInTheDocument();
  });

  // --------------------------------------------------------

  test("should display '9+' for unread count greater than 9", () => {
    // MOCK
    const unreadCount = 15;

    // ARRANGE
    render(
      <ChatItem
        chat={dummyChat}
        onClick={() => {}}
        user={dummySessionUser}
        onChatDelete={() => {}}
        unreadCount={unreadCount}
      />,
    );

    // ASSERT
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  // --------------------------------------------------------

  test("should open the confirmation dialog on delete button click", async () => {
    // MOCK
    const onChatDeleteMock = jest.fn();

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(
      <ChatItem
        chat={dummyChat}
        onClick={() => {}}
        user={dummySessionUser}
        onChatDelete={onChatDeleteMock}
      />,
    );

    // ACT
    await user.click(screen.getByTestId("pop-trigger"));
    await user.click(screen.getByRole("button", { name: "Delete chat" }));

    // ASSERT
    expect(
      screen.getByText("Are you sure you want to delete this chat?"),
    ).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------

  test("should close confirmation dialog on cancel button click", async () => {
    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(
      <ChatItem
        chat={dummyChat}
        onClick={() => {}}
        user={dummySessionUser}
        onChatDelete={() => {}}
      />,
    );

    // ACT
    await user.click(screen.getByTestId("pop-trigger"));
    await user.click(screen.getByRole("button", { name: "Delete chat" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    // ASSERT
    expect(
      screen.queryByText("Are you sure you want to delete this chat?"),
    ).toBeNull();
  });

  // ------------------------------------------------------------------------------------

  test("should delete the chat on confirmation dialog delete button click", async () => {
    // MOCK
    const onChatDeleteMock = jest.fn();
    const deleteChatMutationMock = jest.fn();
    (useDeleteChat as jest.Mock).mockReturnValueOnce({
      mutate: deleteChatMutationMock,
    });
    const { toast } = useToast();

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(
      <ChatItem
        chat={dummyChat}
        onClick={() => {}}
        user={dummySessionUser}
        onChatDelete={onChatDeleteMock}
      />,
    );

    // ACT
    await user.click(screen.getByTestId("pop-trigger"));
    await user.click(screen.getByRole("button", { name: "Delete chat" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    // ASSERT
    expect(deleteChatMutationMock).toHaveBeenCalledWith(dummyChat.id, {
      onError: expect.any(Function),
    });
    expect(onChatDeleteMock).toHaveBeenCalledWith(dummyChat.id);
    expect(toast).toHaveBeenCalledWith({
      description: "Chat deleted successfully",
      variant: "success",
    });
  });
});
