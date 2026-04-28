import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppShell() {
  const location = useLocation();
  const lightWorkspace = ['/dashboard', '/projects/new', '/account', '/account/billing'].includes(location.pathname);

  return (
    <div className={`flex min-h-screen ${lightWorkspace ? 'bg-[#f6f1e8] text-[#10131b]' : 'bg-[#0a0a0a] text-white'}`}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
