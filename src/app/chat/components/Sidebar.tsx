import LargeSidebar from "./LargeSidebar";
import MobileSidebar from "./MobileSidebar";

const Sidebar = () => {
  return (
    <>
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
