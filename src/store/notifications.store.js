import { create } from 'zustand';

let nextId = 1;

const useNotificationsStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => {
      const n = {
        id: nextId++,
        read: false,
        timestamp: Date.now(),
        ...notification,
      };
      return {
        notifications: [n, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

export default useNotificationsStore;
