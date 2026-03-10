import { create } from 'zustand';

const useBuilderStore = create((set) => ({
  activePage: 'home',
  deviceMode: 'desktop',
  editMode: false,
  viewMode: 'preview',
  selectedElement: null,
  undoStack: [],
  redoStack: [],

  setActivePage: (page) => set({ activePage: page }),

  setDeviceMode: (mode) => set({ deviceMode: mode }),

  setEditMode: (editMode) => set({ editMode }),

  setViewMode: (viewMode) => set({ viewMode }),

  selectElement: (element) => set({ selectedElement: element }),

  clearSelection: () => set({ selectedElement: null }),

  pushUndo: (snapshot) =>
    set((state) => ({
      undoStack: [...state.undoStack, snapshot],
      redoStack: [],
    })),

  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return state;
      const previous = state.undoStack[state.undoStack.length - 1];
      return {
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, previous],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      return {
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, next],
      };
    }),

  reset: () =>
    set({
      activePage: 'home',
      deviceMode: 'desktop',
      editMode: false,
      viewMode: 'preview',
      selectedElement: null,
      undoStack: [],
      redoStack: [],
    }),
}));

export default useBuilderStore;
