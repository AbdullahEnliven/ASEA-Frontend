import { create } from 'zustand';

const useIntegrationsStore = create((set) => ({
  supabase: { connected: false, url: null },
  github: { connected: false, username: null },

  setSupabaseConnection: (data) =>
    set((state) => ({
      supabase: { ...state.supabase, ...data },
    })),

  clearSupabaseConnection: () =>
    set({ supabase: { connected: false, url: null } }),

  setGithubConnection: (data) =>
    set((state) => ({
      github: { ...state.github, ...data },
    })),

  clearGithubConnection: () =>
    set({ github: { connected: false, username: null } }),
}));

export default useIntegrationsStore;
