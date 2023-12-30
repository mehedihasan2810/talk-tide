import Navbar from "@/components/Home/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signOut, useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn().mockReturnValue({
    status: "unauthenticated",
    data: null,
  }),
  signOut: jest.fn(),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn(),
  }),
}));

describe("Navbar Component", () => {
  test("Should render properly & links with text content 'Home', 'My Inbox', 'Features', 'Help Center', 'Login' should be visible", () => {
    // ARRANGE
    const { asFragment } = render(<Navbar />);

    // ASSERT
    ["Home", "My Inbox", "Features", "Help Center", "Login"].forEach((name) => {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    });
    expect(screen.getByText("Talk Tide")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  test("Should show the 'Log out' button when user is logged in", () => {
    // MOCK
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "1",
          email: "test@example.com",
        },
      },
    });

    // ARRANGE
    render(<Navbar />);

    // ASSERT
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  test("User should be logged out after clicking on the 'Log out' button", async () => {
    // MOCK
    const { toast } = useToast();

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Navbar />);

    // ACT
    await user.click(screen.getByRole("button", { name: "Log out" }));

    // ASSERT
    expect(signOut).toHaveBeenCalled();
    expect(toast).toHaveBeenCalled();
  });
});
