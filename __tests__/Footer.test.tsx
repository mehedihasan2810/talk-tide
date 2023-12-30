import Footer from "@/components/Home/Footer";
import { render, screen } from "@testing-library/react";

describe("Footer Component", () => {
  test("Should render properly", () => {
    // ARRANGE
    const { asFragment } = render(<Footer />);

    // ACT
    // Iterate through the expected link names and ensure they are present in the rendered component
    ["Privacy Policy", "Terms", "Cookies Policy", "© Talk Tide 2023"].forEach(
      (name) => {
        expect(screen.getByRole("link", { name })).toBeInTheDocument();
      },
    );

    // ASSERT
    // Take a snapshot to compare against future changes
    expect(asFragment()).toMatchSnapshot();
  });
});
