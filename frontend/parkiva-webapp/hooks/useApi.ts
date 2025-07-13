'use client';

import { useState, useEffect, useCallback } from 'react';
import { ParkingDto } from '@/types/api';
import { parkingApi, syncApi, statsApi } from '@/lib/api';

// Hook for fetching parking data
export function useParkingData(district?: string) {
  const [data, setData] = useState<ParkingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const parkingData = await parkingApi.getAll(district);
      setData(parkingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch parking data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [district]);

  useEffect(() => {
    refetch();
  }, [district]);

  return { data, loading, error, refetch };
}

// Hook for nearby parking
export function useNearbyParking(lat?: number, lng?: number, radiusKm: number = 2) {
  const [data, setData] = useState<ParkingDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearby = useCallback(async () => {
    if (!lat || !lng) return;
    
    try {
      setLoading(true);
      setError(null);
      const nearbyData = await parkingApi.getNearby(lat, lng, radiusKm);
      setData(nearbyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nearby parking');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, radiusKm]);

  useEffect(() => {
    if (lat && lng) {
      fetchNearby();
    }
  }, [lat, lng, radiusKm, fetchNearby]);

  return { data, loading, error, refetch: fetchNearby };
}

// Hook for sync operations
export function useSync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const syncIspark = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const result = await syncApi.syncIspark();
      setSuccess('ISpark data synchronized successfully!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return { syncIspark, loading, error, success, clearMessages };
}

// Hook for dashboard statistics
export function useStats() {
  const [stats, setStats] = useState({
    totalParkingSpaces: 0,
    districtsCovered: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const statsData = await statsApi.getStats();
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
