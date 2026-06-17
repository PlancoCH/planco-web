import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getDevices } from '../api/devices';
import type { Device } from '../types/device';

const CACHE_KEY = 'cached_devices';

function loadCache(): Device[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Device[];
    return null;
  } catch {
    return null;
  }
}

function saveCache(devices: Device[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(devices));
  } catch {
    // storage full or disabled — silently ignore
  }
}

interface DeviceState {
  devices: Device[];
  loading: boolean;
  error: string | null;
}

interface DeviceContextValue extends DeviceState {
  refresh: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DeviceState>(() => {
    const cached = loadCache();
    return {
      devices: cached ?? [],
      loading: cached === null,
      error: null,
    };
  });

  const fetchDevices = useCallback(async () => {
    try {
      const devices = await getDevices();
      saveCache(devices);
      setState({ devices, loading: false, error: null });
    } catch {
      setState((prev) => ({
        devices: prev.devices,
        loading: false,
        error: 'Failed to load devices.',
      }));
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    await fetchDevices();
  }, [fetchDevices]);

  return (
    <DeviceContext.Provider value={{ ...state, refresh }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices(): DeviceContextValue {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}
