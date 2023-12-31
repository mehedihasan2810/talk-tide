import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GroupChatDetailsModal from "@/app/chat/components/GroupChatDetailsModal";
import { useStore } from "@/lib/stores/useStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeleteQueryString } from "@/app/chat/hooks/useDeleteQueryString";
import { useGetGroupInfo } from "@/app/chat/hooks/queries/useGetGroupInfo";
import { useRenameGroup } from "@/app/chat/hooks/mutations/useRenameGroup";
import { useRemoveParticipant } from "@/app/chat/hooks/mutations/useRemoveParticipant";

// Mock dependencies for testing
// Mocking external dependencies to isolate the component and ensure predictable behavior
jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({
    status: "authenticated",
    data: {
      user: {
        id: "admin1",
        email: "test@example.com",
      },
    },
  }),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/chat"),
  useRouter: jest.fn().mockReturnValue({
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: jest.fn(() => ({ get: jest.fn().mockReturnValue("321") })),
}));

jest.mock("@/lib/stores/useStore", () => ({
  useStore: jest.fn().mockReturnValue({
    isGroupDetailsModalOpen: true,
    toggleGroupDetailsModal: jest.fn(),
  }),
}));

jest.mock("@/app/chat/hooks/queries/useGetGroupInfo", () => ({
  useGetGroupInfo: jest.fn().mockReturnValue({
    data: {
      data: {
        id: "chat1",
        adminId: "admin1",
        isGroupChat: true,
        chatMessages: [
          {
            id: "message1",
            sender: {
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
            },
            senderId: "message1",
            content: "Hello!",
            chatId: "chat1",
            attachments: [],
            createdAt: "2022-01-01T12:30:00Z",
            updatedAt: "2022-01-01T12:30:00Z",
          },
        ],
        name: "Chat 1",
        participantIds: ["user1", "user2", "user3"],
        participants: [
          {
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
          },
          {
            id: "user2",
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
          },
          {
            id: "user3",
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
          },
        ],
        createdAt: "2022-01-01T12:00:00Z",
        updatedAt: "2022-01-01T12:30:00Z",
      },
    },
    error: null,
  }),
}));

jest.mock("@/app/chat/hooks/mutations/useAddParticipant", () => ({
  useAddParticipant: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("@/app/chat/hooks/mutations/useRemoveParticipant", () => ({
  useRemoveParticipant: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("@/app/chat/hooks/mutations/useDeleteGroupChat", () => ({
  useDeleteGroupChat: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("@/app/chat/hooks/mutations/useRenameGroup", () => ({
  useRenameGroup: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock("@/app/chat/hooks/mutations/useLeaveGroupChat", () => ({
  useLeaveGroupChat: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("@/app/chat/hooks/useDeleteQueryString", () => ({
  useDeleteQueryString: jest
    .fn()
    .mockReturnValue(jest.fn().mockReturnValue("?cD=123")),
}));

// ---------------------------------------------------------------------

// Main test suite
describe("GroupChatDetailsModal Component", () => {
  // Snapshot test to ensure the component renders correctly
  test("Should render properly & match snapshot", async () => {
    // ARRANGE
    const { asFragment } = render(
      <GroupChatDetailsModal onGroupDelete={jest.fn()} />,
    );
    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  //   -----------------------------------------------------------------

  test("Should close the modal when the close button is clicked", async () => {
    // MOCK
    // const toggleGroupDetailsModal = jest.fn();
    // EVENT
    const user = userEvent.setup();
    // ARRANGE
    render(<GroupChatDetailsModal onGroupDelete={jest.fn()} />);
    // ACT
    await user.click(screen.getByLabelText("Close"));
    // ASSERT
    expect(useStore().toggleGroupDetailsModal).toHaveBeenCalledWith(false);
    expect(useRouter().replace).toHaveBeenCalledWith(
      usePathname() + useDeleteQueryString()(),
      { scroll: false },
    );
    expect(useDeleteQueryString()).toHaveBeenCalledWith("cD");
  });

  //   ------------------------------------------------------------------

  test("Should show a loading spinner while fetching group information", async () => {
    // MOCK
    (useSearchParams as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockReturnValue(null),
    });
    (useGetGroupInfo as jest.Mock).mockReturnValueOnce({
      data: null,
      error: null,
    });
    // ARRANGE
    render(<GroupChatDetailsModal onGroupDelete={jest.fn()} />);
    // ASSERT
    expect(screen.getByLabelText("Loading spinner")).toBeInTheDocument();
  });

  //   -------------------------------------------------------------------

  test("Should show error message if error is thrown while fetching group info", async () => {
    // MOCK
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    (useGetGroupInfo as jest.Mock).mockReturnValueOnce({
      data: null,
      error: "Error",
    });
    // ARRANGE
    render(<GroupChatDetailsModal onGroupDelete={jest.fn()} />);
    // ASSERT
    expect(
      screen.getByText(
        "Something went wrong! Try again by refreshing the page",
      ),
    ).toBeInTheDocument();
  });

  //   ---------------------------------------------------------------------

  test("handles group renaming correctly", async () => {
    // MOCK
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("groupId"),
    });
    const renameGroupMutation = jest.fn();
    (useRenameGroup as jest.Mock).mockReturnValue({
      mutate: renameGroupMutation,
      isPending: false,
    });
    // EVENT
    const user = userEvent.setup();
    // ARRANGE
    render(<GroupChatDetailsModal onGroupDelete={jest.fn()} />);
    // ACT
    await user.click(screen.getByLabelText("Rename group"));
    await user.type(
      screen.getByPlaceholderText("Enter new group name..."),
      "New Group Name",
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    // ASSERT
    expect(renameGroupMutation).toHaveBeenCalledWith(
      { newGroupName: "New Group Name", chatId: "groupId" },
      expect.anything(),
    );
  });

  // -------------------------------------------------------------

  test("handles participant removal correctly", async () => {
    // MOCK
    const removeParticipantMutation = jest.fn();
    (useRemoveParticipant as jest.Mock).mockReturnValue({
      mutate: removeParticipantMutation,
      isPending: false,
    });
    // EVENT
    const user = userEvent.setup();
    // ARRANGE
    render(<GroupChatDetailsModal onGroupDelete={jest.fn()} />);
    // ACT
    const partRemoveBtns = screen.getAllByText("Remove");
    await user.click(partRemoveBtns[0]);
    await user.click(screen.getByRole("button", { name: "Remove" }));
    // ASSERT
    expect(partRemoveBtns).toHaveLength(3);
    expect(
      screen.getByText("Are you sure you want to remove this participant?"),
    ).toBeInTheDocument();
    expect(removeParticipantMutation).toHaveBeenCalledWith(
      { chatId: "groupId", participantToBeRemoved: "user1" },
      expect.anything(),
    );
  });
});
