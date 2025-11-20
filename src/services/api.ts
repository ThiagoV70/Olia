const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log para debug (remover em produção)
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_URL);
}

// Armazenar token no localStorage
export const setToken = (token: string) => {
  localStorage.setItem('olia_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('olia_token');
};

export const removeToken = () => {
  localStorage.removeItem('olia_token');
};

// Função auxiliar para fazer requisições
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
      throw new Error(error.message || `Erro ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    // Melhor tratamento de erro de conexão
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:5000');
    }
    throw error;
  }
};

// ==================== AUTENTICAÇÃO ====================
export const authApi = {
  registerUser: async (data: {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
    address?: string;
    neighborhood?: string;
    city?: string;
    bolsaFamilia?: string;
    hasBolsaFamilia?: boolean;
  }) => {
    const response = await request<{ user: any; token: string; message: string }>(
      '/api/auth/register/user',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  registerSchool: async (data: {
    schoolName: string;
    cnpj: string;
    email: string;
    password: string;
    address: string;
    neighborhood: string;
    city: string;
    responsibleName: string;
    responsiblePhone: string;
    responsibleEmail: string;
    storageCapacity: string;
  }) => {
    const response = await request<{ school: any; token: string; message: string }>(
      '/api/auth/register/school',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  login: async (email: string, password: string, userType: 'user' | 'school' | 'government') => {
    const response = await request<{ user: any; token: string; type: string; message: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, userType }),
      }
    );
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  getMe: async () => {
    return request<{ user: any; type: string }>('/api/auth/me');
  },

  logout: () => {
    removeToken();
  },
};

// ==================== USUÁRIOS ====================
export const userApi = {
  getProfile: async () => {
    return request<any>('/api/users/profile');
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    address?: string;
    neighborhood?: string;
    city?: string;
    bolsaFamilia?: string;
    hasBolsaFamilia?: boolean;
  }) => {
    return request<{ user: any; message: string }>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return request<any>('/api/users/stats');
  },
};

// ==================== ESCOLAS ====================
export const schoolApi = {
  getAll: async (filters?: { city?: string; neighborhood?: string }) => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.neighborhood) params.append('neighborhood', filters.neighborhood);
    const query = params.toString();
    return request<any[]>(`/api/schools/public${query ? `?${query}` : ''}`);
  },

  getProfile: async () => {
    return request<any>('/api/schools/profile');
  },

  updateProfile: async (data: {
    name?: string;
    address?: string;
    neighborhood?: string;
    city?: string;
    responsibleName?: string;
    responsiblePhone?: string;
    responsibleEmail?: string;
    storageCapacity?: string;
    lat?: number;
    lng?: number;
  }) => {
    return request<{ school: any; message: string }>('/api/schools/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return request<any>('/api/schools/stats');
  },

  getRanking: async () => {
    return request<{ ranking: any[]; currentRank: number | null }>('/api/schools/ranking');
  },
};

// ==================== DOAÇÕES ====================
export const donationApi = {
  create: async (schoolId: string, liters: number) => {
    return request<{ donation: any; message: string }>('/api/donations', {
      method: 'POST',
      body: JSON.stringify({ schoolId, liters }),
    });
  },

  getUserDonations: async () => {
    return request<any[]>('/api/donations/user');
  },

  getSchoolDonations: async () => {
    return request<any[]>('/api/donations/school');
  },

  confirm: async (donationId: string) => {
    return request<{ donation: any; message: string }>(`/api/donations/${donationId}/confirm`, {
      method: 'PATCH',
    });
  },
};

// ==================== COLETAS ====================
export const collectionApi = {
  request: async (requestedLiters: number, preferredDate: string) => {
    return request<{ collection: any; message: string }>('/api/collections', {
      method: 'POST',
      body: JSON.stringify({ requestedLiters, preferredDate }),
    });
  },

  getSchoolCollections: async () => {
    return request<any[]>('/api/collections/school');
  },

  getAll: async (filters?: { status?: string; city?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.city) params.append('city', filters.city);
    const query = params.toString();
    return request<any[]>(`/api/collections/all${query ? `?${query}` : ''}`);
  },

  schedule: async (collectionId: string, scheduledDate: string) => {
    return request<{ collection: any; message: string }>(
      `/api/collections/${collectionId}/schedule`,
      {
        method: 'PATCH',
        body: JSON.stringify({ scheduledDate }),
      }
    );
  },

  complete: async (collectionId: string, collectedLiters: number) => {
    return request<{ collection: any; message: string }>(
      `/api/collections/${collectionId}/complete`,
      {
        method: 'PATCH',
        body: JSON.stringify({ collectedLiters }),
      }
    );
  },
};

// ==================== RECOMPENSAS ====================
export const rewardApi = {
  getAll: async () => {
    return request<any[]>('/api/rewards');
  },

  request: async (rewardId: string) => {
    return request<{ request: any; message: string }>('/api/rewards/request', {
      method: 'POST',
      body: JSON.stringify({ rewardId }),
    });
  },

  getSchoolRequests: async () => {
    return request<any[]>('/api/rewards/school/requests');
  },

  getAllRequests: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return request<any[]>(`/api/rewards/requests${params}`);
  },

  approve: async (requestId: string) => {
    return request<{ request: any; message: string }>(`/api/rewards/requests/${requestId}/approve`, {
      method: 'PATCH',
    });
  },

  deny: async (requestId: string) => {
    return request<{ request: any; message: string }>(`/api/rewards/requests/${requestId}/deny`, {
      method: 'PATCH',
    });
  },
};

// ==================== RETIRADAS ====================
export const pickupApi = {
  getLocations: async () => {
    return request<any[]>('/api/pickups/locations');
  },

  request: async (pickupLocationId: string) => {
    return request<{ pickup: any; message: string }>('/api/pickups/request', {
      method: 'POST',
      body: JSON.stringify({ pickupLocationId }),
    });
  },

  getUserPickups: async () => {
    return request<any[]>('/api/pickups/user');
  },

  getAll: async () => {
    return request<any[]>('/api/pickups/all');
  },
};

// ==================== NOTIFICAÇÕES ====================
export const notificationApi = {
  getAll: async (isRead?: boolean) => {
    const params = isRead !== undefined ? `?isRead=${isRead}` : '';
    return request<any[]>(`/api/notifications${params}`);
  },

  markAsRead: async (notificationId: string) => {
    return request<{ notification: any; message: string }>(
      `/api/notifications/${notificationId}/read`,
      {
        method: 'PATCH',
      }
    );
  },

  create: async (data: {
    type: string;
    title?: string;
    message: string;
    userId?: string;
    schoolId?: string;
  }) => {
    return request<{ notification: any; message: string; count?: number }>('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== GOVERNO ====================
export const governmentApi = {
  getStats: async () => {
    return request<{
      totalOilRecycled: number;
      soapProduced: number;
      participatingSchools: number;
      beneficiaries: number;
    }>('/api/government/stats');
  },

  getTopSchools: async (limit: number = 10) => {
    return request<any[]>(`/api/government/schools/top?limit=${limit}`);
  },

  getAllSchools: async (filters?: { city?: string; isActive?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    const query = params.toString();
    return request<any[]>(`/api/government/schools${query ? `?${query}` : ''}`);
  },
};

