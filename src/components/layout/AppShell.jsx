import { Outlet, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { CreditCard, FolderOpen, LayoutDashboard, User } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const mobileNavItems = [
  { to: '/dashboard', glyph: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/projects/new', glyph: <FolderOpen size={20} />, label: 'New' },
  { to: '/account', glyph: <User size={20} />, label: 'Account' },
  { to: '/account/billing', glyph: <CreditCard size={20} />, label: 'Billing' },
];

export default function AppShell() {
  const location = useLocation();
  const lightWorkspace = ['/dashboard', '/projects/new', '/account', '/account/billing'].includes(location.pathname);

  return (
    <div className={`flex min-h-screen ${lightWorkspace ? 'bg-[#f6f1e8] text-[#10131b]' : 'bg-[#0a0a0a] text-white'}`}>
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        {/* Extra bottom padding on mobile so content isn't hidden behind the bottom nav */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation — hidden on md+ where sidebar takes over */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-[#d8d0c0] bg-[#fffaf0]/95 backdrop-blur-md md:hidden"
        aria-label="Mobile navigation"
      >
        {mobileNavItems.map(({ to, glyph, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
                isActive ? 'text-[#0f766e]' : 'text-[#8b8174] hover:text-[#10131b]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    isActive ? 'bg-[#dff7f1]' : ''
                  }`}
                >
                  {glyph}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
