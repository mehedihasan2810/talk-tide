import Sidebar from "@/app/chat/components/Sidebar";
import { useStore } from "@/lib/stores/useStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<MobileSidebar/>", () => {
  it("should render successfully and match snapshot", async () => {
    const { asFragment } = render(<Sidebar />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sidebar should toggle perfectly", async () => {
    // UTILS
    const user = userEvent.setup();

    const toggleSidebar = jest.spyOn(
      useStore.getState(),
      "toggleIsMobileSidebarOpen",
    );
    // ---------------------------

    render(<Sidebar />); //ARRANGE

    // ASSERT
    expect(screen.queryByTestId("sidebar-dialog")).not.toBeInTheDocument();
    expect(toggleSidebar).not.toHaveBeenCalled();

    // ACT
    const closeBtn = screen.getByTestId("close-mobile-sidebar-btn");
    await user.click(closeBtn);

    // ASSERT
    expect(toggleSidebar).toHaveBeenCalled();
    expect(screen.getByTestId("sidebar-dialog")).toHaveAttribute(
      "data-state",
      "open",
    );
    expect(closeBtn).toBeInTheDocument();
  });
});
