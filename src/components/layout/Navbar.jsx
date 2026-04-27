import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, ChevronDown, Bell, Check, X } from 'lucide-react';
import useAuthStore from '@/store/auth.store';
import useNotificationsStore from '@/store/notifications.store';

function NotificationDropdown({ onClose }) {
  const { notifications, unreadCount, markAllRead, markRead } = useNotificationsStore();

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm font-semibold">Notifications</span>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={14} />
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-500">
          No notifications yet
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors
                ${!n.read ? 'bg-blue-500/5' : ''}`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">{n.title}</p>
                {n.message && <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>}
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(n.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {n.read && <Check size={12} className="text-gray-600 mt-1 flex-shrink-0" />}
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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end gap-3 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md px-6">
      {/* Notification bell */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
          className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <NotificationDropdown onClose={() => setNotifOpen(false)} />
        )}
      </div>

      {/* User dropdown */}
      <div className="relative" ref={userRef}>
        <button
          onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
        >
          <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline">{displayName}</span>
          <ChevronDown size={14} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
        </button>

        {userOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#111] py-1 shadow-2xl">
            <button
              onClick={() => { navigate('/account'); setUserOpen(false); }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5"
            >
              <Settings size={15} />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
