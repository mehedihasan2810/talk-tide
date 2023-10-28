import { render, screen } from "@testing-library/react";
import Register, { formSchema } from "@/app/(login-register)/register/page";
import userEvent from "@testing-library/user-event";
describe("<Register />", () => {
  it("should render, have Register title and match snapshot", () => {
    const { asFragment } = render(<Register />); // ARRANGE

    // ACT
    const registerTextEl = screen.getByRole("heading", {
      level: 2,
      name: "Register",
    });

    // ASSERT
    expect(registerTextEl).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  // -----------------------------------------------------------------

  it("Email, username, password input field should work", async () => {
    render(<Register />); //ARRANGE

    // ACT
    const user = userEvent.setup();
    const emailInput = screen.getByPlaceholderText(
      "Enter your email..."
    ) as HTMLInputElement;
    const usernameInput = screen.getByPlaceholderText(
      "Enter your username..."
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Enter your password..."
    ) as HTMLInputElement;

    // EVENT
    await user.type(emailInput, "foo");
    await user.type(usernameInput, "foo");
    await user.type(passwordInput, "foo");

    // ASSERT
    expect(emailInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(emailInput.value).toEqual("foo");
    expect(usernameInput.value).toEqual("foo");
    expect(passwordInput.value).toEqual("foo");
  });

  // -----------------------------------------------------------

  it("form data validation should work", async () => {
    render(<Register />); //ARRANGE

    // ACT
    const user = userEvent.setup();
    const formNode = screen.getByTestId("register-form") as HTMLFormElement;
    const submitBtn = screen.getByRole("button", { name: "Register" });
    const emailInput = screen.getByPlaceholderText(
      "Enter your email..."
    ) as HTMLInputElement;
    const usernameInput = screen.getByPlaceholderText(
      "Enter your username..."
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Enter your password..."
    ) as HTMLInputElement;

    // EVENT
    await user.type(emailInput, "foo@gmail.com");
    await user.type(usernameInput, "Mehedi Hasan");
    await user.type(passwordInput, "123456");

    await user.click(submitBtn);

    const formData = Object.fromEntries(new FormData(formNode));

    // ASSERT
    expect(formSchema.parse(formData)).toStrictEqual(formData);
    expect(formNode).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute("type", "submit");
  });
});
