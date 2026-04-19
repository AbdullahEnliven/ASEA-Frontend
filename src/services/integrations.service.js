import api from './api';

export const integrationsService = {
  // Supabase
  getSupabaseStatus: (projectId) =>
    api.get(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/status`),

  testSupabaseConnection: (projectId, credentials) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/test`, credentials),

  runMigrations: (projectId, credentials) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/migrate`, credentials),

  getSupabaseInitScript: (projectId) =>
    api.get(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/init-script`),

  seedData: (projectId) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/supabase/seed`),

  // GitHub
  getGithubStatus: (projectId) =>
    api.get(`/projects/${encodeURIComponent(projectId)}/integrations/github/status`),

  getGithubOauthUrl: (projectId) =>
    api.get(`/projects/${encodeURIComponent(projectId)}/integrations/github/oauth-url`),

  connectGithub: (projectId, payload) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/github/connect`, payload),

  pushToGithub: (projectId, config) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/github/push`, config),

  getGithubOrgs: (projectId) =>
    api.get(`/projects/${encodeURIComponent(projectId)}/integrations/github/orgs`),

  // Cloud Deploy
  deployToCloud: (projectId, config) => 
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/deploy`, config),

  // Vercel
  getVercelStatus: (projectId) =>
    api.get(`/projects/${encodeURIComponent(projectId)}/integrations/vercel/status`),

  deployPreviewToVercel: (projectId, config = {}) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/vercel/preview`, config),

  deployProductionToVercel: (projectId, config = {}) =>
    api.post(`/projects/${encodeURIComponent(projectId)}/integrations/vercel/deploy`, config),
};
