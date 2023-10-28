import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "@/app/(login-register)/login/page";
import { formSchema } from "@/app/(login-register)/login/page";
describe("<Login />", () => {
  it("should render, have Login title and match snapshot", () => {
    const { asFragment } = render(<Login />); // ARRANGE

    // ACT
    const loginTextEl = screen.getByRole("heading", {
      level: 2,
      name: "Login",
    });

    // ASSERT
    expect(loginTextEl).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  // -----------------------------------------------------------------

  it("Email, username, password input field should work", async () => {
    render(<Login />); //ARRANGE

    // ACT
    const user = userEvent.setup();
    const usernameInput = screen.getByPlaceholderText(
      "Enter your username..."
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Enter your password..."
    ) as HTMLInputElement;

    // EVENT
    await user.type(usernameInput, "foo");
    await user.type(passwordInput, "foo");

    // ASSERT
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(usernameInput.value).toEqual("foo");
    expect(passwordInput.value).toEqual("foo");
  });

  // -----------------------------------------------------------

  it("form data validation should work", async () => {
    render(<Login />); //ARRANGE

    // ACT
    const user = userEvent.setup();
    const formNode = screen.getByTestId("login-form") as HTMLFormElement;
    const submitBtn = screen.getByRole("button", { name: "Login" });
    const usernameInput = screen.getByTestId(
      "login-username"
    ) as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;

    // EVENT
    await user.type(usernameInput, "Mehedi Hasan");
    await user.type(passwordInput, "123456");

    const formData = Object.fromEntries(new FormData(formNode));
    // ASSERT
    expect(formSchema.parse(formData)).toStrictEqual(formData);
    expect(formNode).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute("type", "submit");
  });
});
