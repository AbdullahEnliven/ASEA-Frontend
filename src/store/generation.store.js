import { create } from 'zustand';

const useGenerationStore = create((set) => ({
  status: 'idle',
  progress: 0,
  logs: [],
  currentStep: null,

  setStatus: (status) => set({ status }),

  setProgress: (progress) => set({ progress }),

  setStep: (step) => set({ currentStep: step }),

  appendLog: (log) =>
    set((state) => ({
      logs: [...state.logs, { ...log, timestamp: Date.now() }],
    })),

  reset: () =>
    set({
      status: 'idle',
      progress: 0,
      logs: [],
      currentStep: null,
    }),
}));

export default useGenerationStore;
