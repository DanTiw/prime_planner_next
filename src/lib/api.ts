import axios, { AxiosError } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// TypeScript Types
export interface Authority {
  authority: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  authorities: Authority[];
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: number;
  complete: boolean;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface TodoRequest {
  title: string;
  description: string;
  priority: number;
}

export interface PasswordUpdateRequest {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}

export interface ApiError {
  status: number;
  message: string;
  timeStamp: number;
}

// Authentication API
export const authApi = {
  login: async (credentials: AuthenticationRequest): Promise<AuthenticationResponse> => {
    const response = await api.post<AuthenticationResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', userData);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/info');
    return response.data;
  },
};

// Todo API
export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  create: async (todo: TodoRequest): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', todo);
    return response.data;
  },

  toggleComplete: async (id: number): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

// User API
export const userApi = {
  getUserInfo: async (): Promise<User> => {
    const response = await api.get<User>('/users/info');
    return response.data;
  },

  updatePassword: async (passwordData: PasswordUpdateRequest): Promise<void> => {
    await api.put('/users/password', passwordData);
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete('/users');
  },
};

// Admin API
export const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin');
    return response.data;
  },

  promoteToAdmin: async (userId: number): Promise<User> => {
    const response = await api.put<User>(`/admin/${userId}/role`);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/${userId}`);
  },
};

// Helper function to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;
