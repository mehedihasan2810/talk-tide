import Home from "@/app/(Home)/page";
import { render, screen } from "@testing-library/react";

describe("Home Component", () => {
  test("Should render properly", async () => {
    const { asFragment } = render(<Home />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Connect With Your Favorite Ones",
    });
    const btn = screen.getByRole("link", { name: "Connect Now" });
    const title = screen.getByText("Talk Tide");

    expect(heading).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
