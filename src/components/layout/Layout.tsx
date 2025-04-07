import NavBar from './NavBar';
import Sidebar from './SideBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen dark:bg-gray-600 dark:text-white transition-colors">
      <aside>
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1">
        <header className="fixed top-0 left-0 right-0 z-10">
          <NavBar />
        </header>
        <main
          className="flex-1 pt-32 px-44"
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
