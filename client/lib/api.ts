const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred', data);
  }
  
  return data.data || data;
};

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });
      
      const result = await handleResponse<{ user: any; token: string }>(response);
      
      // Store token
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      
      return result;
    },

    register: async (userData: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      communityName?: string;
      address?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      const result = await handleResponse<{ user: any; token: string }>(response);
      
      // Store token
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      
      return result;
    },

    me: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse<{ user: any }>(response);
    },

    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      localStorage.removeItem('authToken');
      return handleResponse(response);
    },

    updateProfile: async (userData: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      return handleResponse<{ user: any }>(response);
    },
  },

  // Issues endpoints
  issues: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        headers: getAuthHeaders(),
      });

      const result = await handleResponse<{ issues: any[] }>(response);
      return result.issues || [];
    },

    create: async (issueData: {
      type: string;
      title: string;
      description: string;
      location: { address: string };
      priority?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(issueData),
      });

      const result = await handleResponse<{ issue: any }>(response);
      return result.issue;
    },

    update: async (id: string, issueData: any) => {
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(issueData),
      });
      
      return handleResponse<any>(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    },
  },

  // Notifications endpoints
  notifications: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse<any[]>(response);
    },

    markAsRead: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    },
  },

  // Analytics endpoints
  analytics: {
    getDashboard: async () => {
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse<any>(response);
    },

    getWasteStats: async (period?: string) => {
      const url = period 
        ? `${API_BASE_URL}/analytics/waste-stats?period=${period}`
        : `${API_BASE_URL}/analytics/waste-stats`;
        
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse<any>(response);
    },
  },

  // Communities endpoints
  communities: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/communities`, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse<any[]>(response);
    },

    create: async (communityData: any) => {
      const response = await fetch(`${API_BASE_URL}/communities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(communityData),
      });
      
      return handleResponse<any>(response);
    },

    update: async (id: string, communityData: any) => {
      const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(communityData),
      });
      
      return handleResponse<any>(response);
    },
  },

  // Pickups endpoints
  pickups: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/pickups`, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse<any[]>(response);
    },

    schedule: async (pickupData: any) => {
      const response = await fetch(`${API_BASE_URL}/pickups`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pickupData),
      });
      
      return handleResponse<any>(response);
    },

    update: async (id: string, pickupData: any) => {
      const response = await fetch(`${API_BASE_URL}/pickups/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(pickupData),
      });
      
      return handleResponse<any>(response);
    },
  },

  // Users endpoints (admin only)
  users: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse<any[]>(response);
    },

    update: async (id: string, userData: any) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      return handleResponse<any>(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    },
  },

  // Health check
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<any>(response);
  },
};

export { ApiError };
export type { ApiResponse };
