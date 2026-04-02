import api from './api';

const normalizeFileId = (fileId) => encodeURIComponent(String(fileId || '').replace(/^\/+/, ''));

export const projectsService = {
  list: (params) => api.get('/projects', { params }),

  get: (id) => api.get(`/projects/${encodeURIComponent(id)}`),

  create: (data) => api.post('/projects', data),

  update: (id, data) => api.patch(`/projects/${encodeURIComponent(id)}`, data),

  delete: (id) => api.delete(`/projects/${encodeURIComponent(id)}`),

  getSpec: (id) => api.get(`/projects/${encodeURIComponent(id)}/spec`),

  generateSpec: (id, requirements) =>
    api.post(`/projects/${encodeURIComponent(id)}/spec`, { requirements }),

  regenerateSpec: (id) =>
    api.post(`/projects/${encodeURIComponent(id)}/spec/regenerate`),

  startGeneration: (id) =>
    api.post(`/projects/${encodeURIComponent(id)}/generate`),

  getPreview: (id, page) =>
    api.get(`/projects/${encodeURIComponent(id)}/preview/${encodeURIComponent(page)}`),

  getFiles: (id) => api.get(`/projects/${encodeURIComponent(id)}/files`),

  getFile: (id, fileId) =>
    api.get(`/projects/${encodeURIComponent(id)}/files/${normalizeFileId(fileId)}`),

  updateFile: (id, fileId, content) =>
    api.patch(`/projects/${encodeURIComponent(id)}/files/${normalizeFileId(fileId)}`, { content }),

  enhanceRequirements: (text) =>
    api.post('/projects/enhance-requirements', { text }),

  getChatHistory: (id) =>
    api.get(`/projects/${encodeURIComponent(id)}/chat-history`),

  listCheckpoints: (id) =>
    api.get(`/projects/${encodeURIComponent(id)}/checkpoints`),

  createCheckpoint: (id, message) =>
    api.post(`/projects/${encodeURIComponent(id)}/checkpoints`, { message }),

  restoreCheckpoint: (id, checkpointId) =>
    api.post(`/projects/${encodeURIComponent(id)}/checkpoints/${encodeURIComponent(checkpointId)}/restore`),

  download: (id) =>
    api.get(`/projects/${encodeURIComponent(id)}/download`, { responseType: 'blob' }),

  supabaseTest: (id, credentials) =>
    api.post(`/projects/${encodeURIComponent(id)}/integrations/supabase/test`, credentials),
  
  deploy: (id) =>
    api.post(`/projects/${encodeURIComponent(id)}/integrations/deploy`),
};
