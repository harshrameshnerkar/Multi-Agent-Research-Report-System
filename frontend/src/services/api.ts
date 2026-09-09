import axios from 'axios';
import { ResearchProject, ResearchOptions, Report, AnalyticsData, SystemSettings, Source } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  loginDemo: async () => {
    const res = await apiClient.post('/auth/demo-login');
    if (res.data.access_token) {
      localStorage.setItem('nexus_auth_token', res.data.access_token);
    }
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.access_token) {
      localStorage.setItem('nexus_auth_token', res.data.access_token);
    }
    return res.data;
  },
  register: async (email: string, password: string, fullName?: string) => {
    const res = await apiClient.post('/auth/register', { email, password, full_name: fullName });
    if (res.data.access_token) {
      localStorage.setItem('nexus_auth_token', res.data.access_token);
    }
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('nexus_auth_token');
  },
};

export const researchApi = {
  start: async (topic: string, options?: Partial<ResearchOptions>): Promise<ResearchProject> => {
    const res = await apiClient.post('/research/start', { topic, options });
    return res.data;
  },
  getProject: async (id: string): Promise<ResearchProject> => {
    const res = await apiClient.get(`/research/${id}`);
    return res.data;
  },
  approve: async (id: string, feedback?: string) => {
    const res = await apiClient.post(`/research/${id}/approve`, { action: 'approve', feedback });
    return res.data;
  },
  requestRewrite: async (id: string, feedback: string) => {
    const res = await apiClient.post(`/research/${id}/approve`, { action: 'rewrite', feedback });
    return res.data;
  },
  reject: async (id: string) => {
    const res = await apiClient.post(`/research/${id}/approve`, { action: 'reject' });
    return res.data;
  },
  getGraphDefinition: async () => {
    const res = await apiClient.get('/research/graph/definition');
    return res.data;
  },
  subscribeEvents: (projectId: string, onEvent: (event: any) => void, onError?: (err: any) => void) => {
    const eventSource = new EventSource(`${API_BASE}/api/research/stream/${projectId}`);
    
    eventSource.addEventListener('status', (e) => onEvent(JSON.parse(e.data)));
    eventSource.addEventListener('node_complete', (e) => onEvent(JSON.parse(e.data)));
    eventSource.addEventListener('human_approval_required', (e) => onEvent(JSON.parse(e.data)));
    eventSource.addEventListener('workflow_complete', (e) => {
      onEvent(JSON.parse(e.data));
      eventSource.close();
    });
    eventSource.addEventListener('error', (e) => {
      if (onError) onError(e);
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }
};

export const reportsApi = {
  list: async (search?: string): Promise<Report[]> => {
    const res = await apiClient.get('/reports', { params: { search } });
    return res.data;
  },
  get: async (id: string): Promise<Report> => {
    const res = await apiClient.get(`/reports/${id}`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/reports/${id}`);
    return res.data;
  },
  share: async (id: string) => {
    const res = await apiClient.post(`/reports/${id}/share`);
    return res.data;
  },
  getPublic: async (token: string): Promise<Report> => {
    const res = await apiClient.get(`/reports/public/${token}`);
    return res.data;
  },
  getExportUrl: (id: string, format: string) => {
    return `${API_BASE}/api/reports/${id}/export/${format}`;
  }
};

export const sourcesApi = {
  list: async (): Promise<Source[]> => {
    const res = await apiClient.get('/sources');
    return res.data;
  },
  getCredibilityMatrix: async () => {
    const res = await apiClient.get('/sources/domains/credibility');
    return res.data;
  }
};

export const filesApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  list: async () => {
    const res = await apiClient.get('/files');
    return res.data;
  }
};

export const analyticsApi = {
  get: async (): Promise<AnalyticsData> => {
    const res = await apiClient.get('/analytics');
    return res.data;
  }
};

export const adminApi = {
  getHealth: async () => {
    const res = await apiClient.get('/admin/health');
    return res.data;
  },
  getMetrics: async () => {
    const res = await apiClient.get('/admin/metrics');
    return res.data;
  }
};

export const settingsApi = {
  get: async (): Promise<SystemSettings> => {
    const res = await apiClient.get('/settings');
    return res.data;
  },
  update: async (settingsData: any) => {
    const res = await apiClient.post('/settings', settingsData);
    return res.data;
  }
};
