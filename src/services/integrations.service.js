import api from './api';

export const integrationsService = {
  // Supabase
  getSupabaseStatus: (projectId) =>
    api.get(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/status`),

  testSupabaseConnection: (projectId, credentials) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/test`, credentials),

  runMigrations: (projectId, credentials) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/migrate`, credentials),

  seedData: (projectId) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/seed`),

  // GitHub
  getGithubStatus: () => api.get('/integrations/github/status'),

  connectGithub: (code) => api.post('/integrations/github/connect', { code }),

  pushToGithub: (projectId, config) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/github/push`, config),

  getGithubOrgs: () => api.get('/integrations/github/orgs'),

  // Cloud Deploy
  deployToCloud: (projectId, config) => 
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/deploy`, config),
};
