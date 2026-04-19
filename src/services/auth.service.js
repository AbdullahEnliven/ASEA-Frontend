import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login/json', credentials),

  register: (data) => api.post('/auth/register', { 
    email: data.email, 
    password: data.password, 
    full_name: data.name 
  }),

  getMe: () => api.get('/auth/me'),

  refreshToken: () => api.post('/auth/refresh'),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),

  loginWithGoogle: (code) => api.post('/auth/oauth/google', { code }),

  getGithubOAuthUrl: (source = 'login') =>
    api.get(`/auth/oauth/github/url?source=${encodeURIComponent(source)}`),

  loginWithGithub: (code) => api.post('/auth/oauth/github', { code }),

  exchangeGithubOAuthCode: (code, state) =>
    api.post('/auth/oauth/github', { code, state }),

  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  deleteAccount: () => api.delete('/auth/account'),
};
