import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ? 
  `${process.env.REACT_APP_API_URL}/api` : 
  'https://capturezone-ctf-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Module {
  _id: string;
  id: number;
  name: string;
  title: string;
  description: string;
  vulnerability: string;
  owaspCategory: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  flag: string;
  hints: string[];
  documentation: {
    overview: string;
    vulnerability_details: string;
    exploitation_steps: string[];
    prevention: string;
    references: string[];
  };
  isActive: boolean;
}

export interface Progress {
  user: {
    username: string;
    email: string;
    role: string;
  };
  progress: {
    totalModules: number;
    completedModules: number;
    completionPercentage: number;
    totalFlags: number;
    moduleStatus: Array<{
      moduleId: number;
      completed: boolean;
      completedAt: string | null;
    }>;
    lastActivity: string;
  };
}

export const apiService = {
  // Module endpoints
  async getModules(): Promise<Module[]> {
    try {
      const response = await api.get('/modules');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch modules');
    }
  },

  async getModule(id: number): Promise<Module> {
    try {
      const response = await api.get(`/modules/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch module');
    }
  },

  async initializeModules(): Promise<void> {
    try {
      await api.post('/modules/init');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to initialize modules');
    }
  },

  // Progress endpoints
  async getProgress(): Promise<Progress> {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch progress');
    }
  },

  async getLeaderboard(): Promise<any[]> {
    try {
      const response = await api.get('/progress/leaderboard');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch leaderboard');
    }
  },

  // Flag validation
  async validateFlag(flag: string, moduleId: number): Promise<any> {
    try {
      const response = await api.post('/flags/validate', { flag, moduleId });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Flag validation failed');
    }
  },

  // Vulnerable endpoints for CTF challenges
  async submitFeedback(feedbackData: any): Promise<any> {
    try {
      const response = await api.post('/vulnerable/feedback', feedbackData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to submit feedback');
    }
  },

  async fetchArchiveResource(url: string): Promise<any> {
    try {
      const response = await api.post('/vulnerable/archive/fetch', { url });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch resource');
    }
  },

  async authenticateSystem(username: string, password: string, sessionToken?: string): Promise<any> {
    try {
      const response = await api.post('/vulnerable/system-auth', { username, password, sessionToken });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Authentication failed');
    }
  },

  async adminLogin(username: any, password: any): Promise<any> {
    try {
      const response = await api.post('/vulnerable/admin/login', { username, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Admin login failed');
    }
  },

  async setupAdmin(): Promise<any> {
    try {
      const response = await api.post('/vulnerable/admin/setup');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Admin setup failed');
    }
  },
};