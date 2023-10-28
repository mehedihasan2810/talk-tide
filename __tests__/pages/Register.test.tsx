import { render } from "@testing-library/react";
import Register from "@/app/(login-register)/register/page";

describe("<Register />", () => {
  it("should render and match snapshot", () => {
    const { asFragment } = render(<Register />);

    expect(asFragment()).toMatchSnapshot();
  });
});
