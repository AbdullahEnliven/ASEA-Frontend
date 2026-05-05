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

  // Legacy: kept for backward-compat but no longer the primary preview method
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

  deploy: (id, config = {}) =>
    api.post(`/projects/${encodeURIComponent(id)}/integrations/deploy`, {
      target: config.target || 'production',
      subdomain: config.subdomain,
    }),

  deployPreview: (id, config = {}) =>
    api.post(`/projects/${encodeURIComponent(id)}/integrations/deploy`, {
      target: 'preview',
      subdomain: config.subdomain,
    }),

  // ── Vercel-based live preview (Railway-compatible — no local ports) ──────────
  // 1. Poll this to get current state: { status, url, message }
  getPreviewStatus: (id) =>
    api.get(`/projects/${encodeURIComponent(id)}/preview-status`),

  // 2. Call this to kick off a deploy (non-blocking); then poll getPreviewStatus
  triggerPreview: (id) =>
    api.post(`/projects/${encodeURIComponent(id)}/preview/trigger`),

  // 3. Backend proxy URL — iframe loads this instead of Vercel directly.
  //    The proxy strips X-Frame-Options so the site embeds without "refused to connect".
  getPreviewProxyUrl: (id) => {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');
    return `${base}/projects/${encodeURIComponent(id)}/preview-proxy`;
  },
};
