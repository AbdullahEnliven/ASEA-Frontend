import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    name: user.name || user.full_name || '',
  };
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user: normalizeUser(user), token }),

      login: (user, token) => set({ user: normalizeUser(user), token }),

      logout: () => set({ user: null, token: null }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? normalizeUser({ ...state.user, ...updates }) : null,
        })),

      setToken: (token) => set({ token }),
    }),
    {
      name: 'asea-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
