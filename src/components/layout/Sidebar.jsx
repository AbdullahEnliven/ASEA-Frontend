import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  Layers3,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', glyph: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/projects/new', glyph: <FolderOpen size={18} />, label: 'New Project' },
  { to: '/account', glyph: <User size={18} />, label: 'Account' },
  { to: '/account/billing', glyph: <CreditCard size={18} />, label: 'Billing' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 hidden h-screen flex-col border-r border-[#d8d0c0] bg-[#fffaf0] shadow-[12px_0_40px_rgba(22,24,31,0.04)] transition-all duration-200 md:flex
        ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex h-16 items-center border-b border-[#d8d0c0] px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10131b] text-white">
              <Layers3 className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="block text-xl font-black tracking-tight text-[#10131b]">ASEA</span>
              <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">
                build room
              </span>
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`rounded-lg border border-[#d8d0c0] bg-white p-1.5 text-[#6f766f] transition hover:border-[#10131b] hover:text-[#10131b] ${collapsed ? 'mx-auto' : 'ml-auto'}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map(({ to, glyph, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-black transition-colors
              ${isActive
                ? 'bg-[#10131b] text-white'
                : 'text-[#5c6270] hover:bg-[#f6f1e8] hover:text-[#10131b]'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            {glyph}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#d8d0c0] p-2">
        <a
          href="#"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-black text-[#5c6270] transition-colors hover:bg-[#f6f1e8] hover:text-[#10131b]
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
