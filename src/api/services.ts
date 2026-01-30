import api from './client';

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  invite: (data: any) => api.post('/auth/invite', data),
  registerViaInvite: (data: any) => api.post('/auth/register-via-invite', data),
  validateInvite: (token: string) => api.get(`/auth/validate-invite/${token}`),
};

export const userApi = {
  getUsers: (page: number, keyword: string = '') =>
    api.get(`/users?pageNumber=${page}&keyword=${keyword}`),
  updateRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
  updateStatus: (id: string, status: string) => api.patch(`/users/${id}/status`, { status }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

export const projectApi = {
  getProjects: (page: number = 1, keyword: string = '') =>
    api.get(`/projects?pageNumber=${page}&keyword=${keyword}`),
  createProject: (data: any) => api.post('/projects', data),
  updateProject: (id: string, data: any) => api.patch(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};
