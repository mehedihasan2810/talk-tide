import Login from "@/app/(login-register)/auth/components/Login";
import { useToast } from "@/components/ui/use-toast";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"), // Use the actual module for other exports
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

describe("Login Component", () => {
  test("Should render perfectly", () => {
    // MOCK
    // (useSession as jest.Mock).mockReturnValueOnce({
    //   status: "unauthenticated",
    //   data: null,
    // });

    // ARRANGE
    const { asFragment } = render(<Login updateIsLogin={() => {}} />);

    // ASSERT
    expect(
      screen.getByRole("heading", { level: 2, name: "Login" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username..."),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password..."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("register-link")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
    expect(asFragment()).toMatchSnapshot();
  });

  test("Password input should have type password ", () => {
    // ARRANGE
    render(<Login updateIsLogin={() => {}} />);

    // ASSERT
    const password = screen.getByPlaceholderText("Enter your password...");
    expect(password).toHaveAttribute("type", "password");
  });

  test("Input fields should work", async () => {
    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Login updateIsLogin={() => {}} />);

    // ACT
    const username = screen.getByTestId("login-username");
    const password = screen.getByTestId("login-password");
    await user.type(username, "mehedi");
    await user.type(password, "123456");

    // ASSERT
    expect(username).toHaveValue("mehedi");
    expect(password).toHaveValue("123456");
  });

  test("Validation: username should be at least 2 chars & password 6 chars", async () => {
    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Login updateIsLogin={() => {}} />);

    // ACT
    const username = screen.getByTestId("login-username");
    const password = screen.getByTestId("login-password");
    const submitBtn = screen.getByRole("button", { name: "Login" });
    await user.type(username, "m");
    await user.type(password, "12345");
    await user.click(submitBtn);

    // ASSERT
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

    render(<Login updateIsLogin={() => {}} />);

    // ACT
    const username = screen.getByTestId("login-username");
    const password = screen.getByTestId("login-password");
    const submitBtn = screen.getByRole("button", { name: "Login" });
    await user.type(username, "testuser");
    await user.type(password, "testpassword");
    await user.click(submitBtn);

    // ASSERT
    expect(toast).toHaveBeenCalled();
    expect(refresh).toHaveBeenCalled();
    expect(replace).toHaveBeenCalled();
  });

  test("Displays error message on unsuccessful login", async () => {
    //  MOCK
    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: "Error message",
    });

    // EVENT
    const user = userEvent.setup();

    // ARRANGE
    render(<Login updateIsLogin={() => {}} />);

    // ACT
    const username = screen.getByTestId("login-username");
    const password = screen.getByTestId("login-password");
    const submitBtn = screen.getByRole("button", { name: "Login" });
    await user.type(username, "testuser");
    await user.type(password, "testpassword");
    await user.click(submitBtn);

    // ASSERT
    expect(screen.getByText("Error!")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });
});
