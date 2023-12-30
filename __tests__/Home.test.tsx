import Home from "@/app/(Home)/page";
import { render, screen } from "@testing-library/react";

describe("Home Component", () => {
  test("Should render properly & have heading and button link", async () => {
    // ARRANGE
    const { asFragment } = render(<Home />);

    // ACT
    // Find heading, button, and title elements
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Connect With Your Favorite Ones",
    });
    const btn = screen.getByRole("link", { name: "Connect Now" });
    const title = screen.getByText("Talk Tide");

    // ASSERT
    // Ensure that heading, button, and title elements are present
    expect(heading).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(title).toBeInTheDocument();

    // Take a snapshot of the rendered component
    expect(asFragment()).toMatchSnapshot();
  });
});
