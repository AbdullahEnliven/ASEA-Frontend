import { describe, it, expect, beforeEach } from 'vitest';
import useNotificationsStore from '@/store/notifications.store';

// Reset store between tests by accessing internal state
function resetStore() {
  useNotificationsStore.setState({ notifications: [], unreadCount: 0 });
}

describe('notifications store', () => {
  beforeEach(resetStore);

  it('starts with empty state', () => {
    const { notifications, unreadCount } = useNotificationsStore.getState();
    expect(notifications).toHaveLength(0);
    expect(unreadCount).toBe(0);
  });

  it('addNotification increments unreadCount', () => {
    useNotificationsStore.getState().addNotification({ title: 'Test' });
    const { unreadCount, notifications } = useNotificationsStore.getState();
    expect(unreadCount).toBe(1);
    expect(notifications[0].title).toBe('Test');
    expect(notifications[0].read).toBe(false);
  });

  it('addNotification prepends — newest first', () => {
    useNotificationsStore.getState().addNotification({ title: 'First' });
    useNotificationsStore.getState().addNotification({ title: 'Second' });
    const { notifications } = useNotificationsStore.getState();
    expect(notifications[0].title).toBe('Second');
  });

  it('markAllRead sets unreadCount to 0', () => {
    useNotificationsStore.getState().addNotification({ title: 'A' });
    useNotificationsStore.getState().addNotification({ title: 'B' });
    useNotificationsStore.getState().markAllRead();
    const { unreadCount, notifications } = useNotificationsStore.getState();
    expect(unreadCount).toBe(0);
    expect(notifications.every((n) => n.read)).toBe(true);
  });

  it('markRead only marks the specified notification', () => {
    useNotificationsStore.getState().addNotification({ title: 'X' });
    const id = useNotificationsStore.getState().notifications[0].id;
    useNotificationsStore.getState().addNotification({ title: 'Y' });
    useNotificationsStore.getState().markRead(id);
    const { notifications, unreadCount } = useNotificationsStore.getState();
    const marked = notifications.find((n) => n.id === id);
    expect(marked.read).toBe(true);
    expect(unreadCount).toBe(1); // Y still unread
  });

  it('clearAll empties notifications', () => {
    useNotificationsStore.getState().addNotification({ title: 'Z' });
    useNotificationsStore.getState().clearAll();
    const { notifications, unreadCount } = useNotificationsStore.getState();
    expect(notifications).toHaveLength(0);
    expect(unreadCount).toBe(0);
  });

  it('caps notifications at 50', () => {
    for (let i = 0; i < 55; i++) {
      useNotificationsStore.getState().addNotification({ title: `n${i}` });
    }
    expect(useNotificationsStore.getState().notifications).toHaveLength(50);
  });
});
