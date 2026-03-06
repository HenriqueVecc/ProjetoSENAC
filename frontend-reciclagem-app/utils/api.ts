const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface ApiError {
  message: string;
  detail?: string | Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao processar requisição';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object') {
          errorMessage = JSON.stringify(errorData);
        }
      } catch {
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async login(username: string, password: string) {
    const data = await this.request<{ access: string; refresh: string }>('/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    }
    return data;
  }

  async register(
    name: string, 
    email: string, 
    password: string, 
    type: 'USER' | 'CENTER',
    centerData?: { name: string; address: string; phone: string; description?: string }
  ) {
    const body: Record<string, string> = { name, email, password, type };
    
    if (type === 'CENTER' && centerData) {
      body.center_name = centerData.name;
      body.center_address = centerData.address;
      body.center_phone = centerData.phone;
      if (centerData.description) {
        body.center_description = centerData.description;
      }
    }
    
    return this.request<{ id: number; email: string; name: string; type: string }>('/register/', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async refreshToken() {
    const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    if (!refresh) throw new Error('No refresh token');
    
    const data = await this.request<{ access: string }>('/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
    }
    return data;
  }

  async getMe() {
    return this.request<{
      id: number;
      email: string;
      name: string;
      type: 'USER' | 'CENTER';
    }>('/me/');
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getCenters() {
    return this.request<Array<{
      id: number;
      name: string;
      address: string;
      phone: string;
      description?: string;
    }>>('/centers/');
  }

  async getCenter(id: number) {
    return this.request<{
      id: number;
      name: string;
      address: string;
      phone: string;
      description?: string;
    }>(`/centers/${id}/`);
  }

  async createCenter(data: { name: string; address: string; phone: string; description?: string }) {
    return this.request<{
      id: number;
      name: string;
      address: string;
      phone: string;
      description?: string;
    }>('/centers/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMaterialTypes() {
    return this.request<Array<{ id: number; name: string }>>('/material-types/');
  }

  async createRequest(data: {
    center: number;
    material_type: number;
    estimated_quantity: number;
    quantity_unit: string;
    address: string;
    pickup_date: string;
  }) {
    return this.request<{
      id: number;
      center: number;
      material_type: number;
      estimated_quantity: number;
      quantity_unit: string;
      address: string;
      pickup_date: string;
      status: string;
    }>('/requests/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyRequests() {
    return this.request<Array<{
      id: number;
      center: number;
      center_name: string;
      material_type: number;
      material_name: string;
      estimated_quantity: number;
      quantity_unit: string;
      address: string;
      pickup_date: string;
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
      created_at: string;
    }>>('/requests/my/');
  }

  async getCenterRequests() {
    return this.request<Array<{
      id: number;
      center: number;
      center_name: string;
      material_type: number;
      material_name: string;
      estimated_quantity: number;
      quantity_unit: string;
      address: string;
      pickup_date: string;
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
      created_at: string;
      user_email: string;
      user_name: string;
    }>>('/requests/center/');
  }

  async updateRequestStatus(id: number, status: 'ACCEPTED' | 'REJECTED') {
    return this.request<{
      id: number;
      status: string;
    }>(`/requests/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

