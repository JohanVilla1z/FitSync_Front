import NavBar from "./NavBar";
import Sidebar from "./SideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen dark:bg-muted-dark dark:text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <NavBar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
