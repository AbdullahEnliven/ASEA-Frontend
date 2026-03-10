import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  User,
  CreditCard,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects/new', icon: FolderOpen, label: 'New Project' },
  { to: '/account', icon: User, label: 'Account' },
  { to: '/account/billing', icon: CreditCard, label: 'Billing' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col border-r border-white/10 bg-[#0a0a0a] transition-all duration-200
        ${collapsed ? 'w-16' : 'w-60'}`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/10">
        {!collapsed && (
          <span className="text-xl font-bold tracking-tighter">ASEA</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 text-gray-400 hover:text-white transition-colors ${collapsed ? 'mx-auto' : 'ml-auto'}`}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
              ${isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Docs link */}
      <div className="p-2 border-t border-white/10">
        <a
          href="#"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Docs' : undefined}
        >
          <BookOpen size={18} />
          {!collapsed && <span>Docs</span>}
        </a>
      </div>
    </aside>
  );
}
