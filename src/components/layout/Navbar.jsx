import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, ChevronDown, LogOut, Settings, X } from 'lucide-react';
import useAuthStore from '@/store/auth.store';
import useNotificationsStore from '@/store/notifications.store';

function NotificationDropdown({ onClose }) {
  const { notifications, unreadCount, markAllRead, markRead } = useNotificationsStore();

  return (
    <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#d8d0c0] px-4 py-3">
        <span className="text-sm font-black text-[#10131b]">Notifications</span>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-black text-[#0f766e] hover:text-[#0a514c]"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-[#8b8174] hover:text-[#10131b]">
            <X size={14} />
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm font-bold text-[#8b8174]">
          No notifications yet
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f6f1e8]
                ${!n.read ? 'bg-[#dff7f1]/45' : ''}`}
            >
              <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!n.read ? 'bg-[#0f766e]' : 'bg-transparent'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-[#10131b]">{n.title}</p>
                {n.message && <p className="mt-0.5 text-xs text-[#5c6270]">{n.message}</p>}
                <p className="mt-1 text-xs text-[#8b8174]">
                  {new Date(n.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {n.read && <Check size={12} className="mt-1 flex-shrink-0 text-[#8b8174]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { unreadCount } = useNotificationsStore();
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userRef = useRef(null);
  const notifRef = useRef(null);
  const displayName = user?.name || user?.full_name || 'User';

  useEffect(() => {
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-[#d8d0c0] bg-[#fffaf0]/88 px-5 backdrop-blur-md sm:px-6">
      <div className="md:hidden">
        <span className="text-xl font-black tracking-tight text-[#10131b]">ASEA</span>
      </div>
      <div className="hidden md:block">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Workspace</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative rounded-lg border border-[#d8d0c0] bg-white p-2 text-[#5c6270] transition hover:border-[#10131b] hover:text-[#10131b]"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0f766e] text-[10px] font-black text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <NotificationDropdown onClose={() => setNotifOpen(false)} />
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-lg border border-[#d8d0c0] bg-white px-3 py-2 text-sm font-black text-[#343945] transition hover:border-[#10131b]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10131b] text-xs font-black text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline">{displayName}</span>
            <ChevronDown size={14} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#d8d0c0] bg-[#fffaf0] py-1 shadow-2xl">
              <button
                onClick={() => { navigate('/account'); setUserOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#343945] hover:bg-[#f6f1e8]"
              >
                <Settings size={15} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#ba4d41] hover:bg-[#ffe6df]"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
