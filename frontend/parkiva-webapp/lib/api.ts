import { ApiResponse, ParkingDto } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7173';

// Generic API function with error handling
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data;
  } catch (error) {
    console.error('API request failed:', {
      endpoint,
      error: error instanceof Error ? error.message : error,
      url: `${API_BASE_URL}${endpoint}`
    });
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please ensure the backend is running.');
    }
    
    throw error;
  }
}

// Parking API functions
export const parkingApi = {
  // Get all parking spaces with optional district filter
  getAll: async (district?: string): Promise<ParkingDto[]> => {
    const queryParam = district ? `?district=${encodeURIComponent(district)}` : '';
    return apiRequest<ParkingDto[]>(`/api/parking${queryParam}`);
  },

  // Get parking space by ID
  getById: async (id: number): Promise<ParkingDto> => {
    return apiRequest<ParkingDto>(`/api/parking/${id}`);
  },

  // Get nearby parking spaces
  getNearby: async (lat: number, lng: number, radiusKm: number = 2): Promise<ParkingDto[]> => {
    const queryParams = `?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`;
    return apiRequest<ParkingDto[]>(`/api/parking/nearby${queryParams}`);
  },

  // Create new parking space
  create: async (parking: Partial<ParkingDto>): Promise<ParkingDto> => {
    return apiRequest<ParkingDto>('/api/parking', {
      method: 'POST',
      body: JSON.stringify(parking),
    });
  },

  // Update parking space
  update: async (id: number, parking: Partial<ParkingDto>): Promise<ParkingDto> => {
    return apiRequest<ParkingDto>(`/api/parking/${id}`, {
      method: 'PUT',
      body: JSON.stringify(parking),
    });
  },

  // Delete parking space
  delete: async (id: number): Promise<void> => {
    return apiRequest<void>(`/api/parking/${id}`, {
      method: 'DELETE',
    });
  },
};

// Sync API functions
export const syncApi = {
  // Sync ISpark data
  syncIspark: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/api/syncdata/sync-ispark', {
      method: 'POST',
    });
  },
};

// Statistics API (you might want to add this to your backend)
export const statsApi = {
  // Get dashboard statistics
  getStats: async (): Promise<{
    totalParkingSpaces: number;
    districtsCovered: number;
    activeUsers: number;
  }> => {
    // This would require a new endpoint in your backend
    // For now, we'll return mock data
    return Promise.resolve({
      totalParkingSpaces: 1247,
      districtsCovered: 39,
      activeUsers: 2500,
    });
  },
};
