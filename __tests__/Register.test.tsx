import Register from "@/app/(login-register)/auth/components/Register";
import { useToast } from "@/components/ui/use-toast";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn().mockReturnValue({
    status: "unauthenticated",
    data: null,
  }),
  signIn: jest.fn(),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe("Register Component", () => {
  test("Should render perfectly", () => {
    // ARRANGE
    const { asFragment } = render(<Register updateIsLogin={() => {}} />);

    // ASSERT
    expect(
      screen.getByRole("heading", { level: 2, name: "Register" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your email..."),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username..."),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password..."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-link")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
    expect(asFragment()).toMatchSnapshot();
  });

  test("Password input should have type password", () => {
    // ARRANGE
    render(<Register updateIsLogin={() => {}} />);

    // ASSERT
    const password = screen.getByPlaceholderText("Enter your password...");
    expect(password).toHaveAttribute("type", "password");
  });

  test("Input fields should work", async () => {
    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Register updateIsLogin={() => {}} />);

    // ACT
    const email = screen.getByTestId("register-email");
    const username = screen.getByTestId("register-username");
    const password = screen.getByTestId("register-password");
    await user.type(email, "test@example.com");
    await user.type(username, "testuser");
    await user.type(password, "testpassword");

    // ASSERT
    expect(email).toHaveValue("test@example.com");
    expect(username).toHaveValue("testuser");
    expect(password).toHaveValue("testpassword");
  });

  test("Validation: email, username & password validation should work properly", async () => {
    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Register updateIsLogin={() => {}} />);

    // ACT
    const email = screen.getByTestId("register-email");
    const username = screen.getByTestId("register-username");
    const password = screen.getByTestId("register-password");
    const submitBtn = screen.getByRole("button", { name: "Register" });
    await user.type(email, "email");
    await user.type(username, "m");
    await user.type(password, "12345");
    await user.click(submitBtn);

    // ASSERT
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(
      screen.getByText("Username must be at least 2 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 6 characters."),
    ).toBeInTheDocument();
  });

  test("Submits the form successfully", async () => {
    //  MOCK
    const { toast } = useToast();
    const { refresh, replace } = useRouter();
    (signIn as jest.Mock).mockResolvedValue({
      ok: true,
    });

    // EVENT
    const user = userEvent.setup();

    render(<Register updateIsLogin={() => {}} />);

    // ACT
    const email = screen.getByTestId("register-email");
    const username = screen.getByTestId("register-username");
    const password = screen.getByTestId("register-password");
    const submitBtn = screen.getByRole("button", { name: "Register" });
    await user.type(email, "test@example.com");
    await user.type(username, "testuser");
    await user.type(password, "testpassword");
    await user.click(submitBtn);

    // ASSERT
    expect(toast).toHaveBeenCalled();
    expect(refresh).toHaveBeenCalled();
    expect(replace).toHaveBeenCalled();
  });

  test("Displays error message on unsuccessful registration", async () => {
    //  MOCK
    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: "Error message",
    });

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Register updateIsLogin={() => {}} />);

    // ACT
    const email = screen.getByTestId("register-email");
    const username = screen.getByTestId("register-username");
    const password = screen.getByTestId("register-password");
    const submitBtn = screen.getByRole("button", { name: "Register" });
    await user.type(email, "test@example.com");
    await user.type(username, "testuser");
    await user.type(password, "testpassword");
    await user.click(submitBtn);

    // ASSERT
    expect(screen.getByText("Error!")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  test("Displays error/warning message if user is already logged in", async () => {
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

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Register updateIsLogin={() => {}} />);

    // ACT
    const email = screen.getByTestId("register-email");
    const username = screen.getByTestId("register-username");
    const password = screen.getByTestId("register-password");
    const submitBtn = screen.getByRole("button", { name: "Register" });
    await user.type(email, "test@example.com");
    await user.type(username, "testuser");
    await user.type(password, "testpassword");
    await user.click(submitBtn);

    // ASSERT
    expect(screen.getByText("Error!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You are already logged in! If you want to create new account then logout first",
      ),
    ).toBeInTheDocument();
  });
});
