import { useChatStore } from "@/lib/stores/chatStores";
import LargeSidebar from "./LargeSidebar";
import MobileSidebar from "./MobileSidebar";

const Sidebar = () => {
  const toggleIsMobileSidebarOpen = useChatStore(
    (state) => state.toggleIsMobileSidebarOpen
  );

  return (
    <>
      {/* ------------ */}
      <button
        onClick={toggleIsMobileSidebarOpen}
        className="hidden"
        data-testid="close-mobile-sidebar-btn"
      ></button>

      {/* ---------------- */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      <div className="hidden md:block">
        <LargeSidebar />
      </div>
    </>
  );
};

export default Sidebar;
