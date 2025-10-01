import { API_URL } from '../utils/apiConfig';
import logger from '../utils/logger';

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  role: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface UserResponse {
  user: User;
}

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
    logger.info('API Service initialized', { baseURL: this.baseURL });
  }

  // Helper method to get auth headers
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('nhd_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      logger.error('API request failed', error as Error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: { name: string; email: string; password: string; company: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/me');
  }

  async verifyToken(): Promise<{ valid: boolean; user: any }> {
    return this.request<{ valid: boolean; user: any }>('/auth/verify');
  }

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('nhd_auth_token');
    localStorage.removeItem('nhd_user_data');
    return Promise.resolve();
  }

  // Health check
  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }
}

export default new ApiService();
