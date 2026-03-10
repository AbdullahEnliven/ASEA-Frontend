import { create } from 'zustand';

const useProjectsStore = create((set) => ({
  projects: [],
  activeProject: null,

  setProjects: (projects) => set({ projects }),

  setActiveProject: (project) => set({ activeProject: project }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      activeProject:
        state.activeProject?.id === projectId ? null : state.activeProject,
    })),

  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
      activeProject:
        state.activeProject?.id === projectId
          ? { ...state.activeProject, ...updates }
          : state.activeProject,
    })),

  updateProjectFile: (fileId, content) =>
    set((state) => {
      if (!state.activeProject) return state;
      const files = state.activeProject.files?.map((f) =>
        f.id === fileId ? { ...f, content } : f
      );
      return {
        activeProject: { ...state.activeProject, files },
      };
    }),
}));

export default useProjectsStore;
