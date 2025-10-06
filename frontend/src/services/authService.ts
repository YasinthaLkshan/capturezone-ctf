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

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    progress: {
      totalFlags: number;
      completedModules: Array<{
        moduleId: number;
        completedAt: string;
        flag: string;
      }>;
    };
  };
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    progress: {
      totalFlags: number;
      completedModules: Array<{
        moduleId: number;
        completedAt: string;
        flag: string;
      }>;
    };
  };
}

export interface UserResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    progress: {
      totalFlags: number;
      completedModules: Array<{
        moduleId: number;
        completedAt: string;
        flag: string;
      }>;
    };
  };
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Login API URL:', API_BASE_URL);
      console.log('Calling:', `${API_BASE_URL}/auth/login`);
      
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async getCurrentUser(token: string): Promise<UserResponse> {
    try {
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },
};