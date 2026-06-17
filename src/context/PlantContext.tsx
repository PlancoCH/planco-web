import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getPlants } from '../api/plants';
import type { Plant } from '../types/plant';

const CACHE_KEY = 'cached_plants';

function loadCache(): Plant[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Plant[];
    return null;
  } catch {
    return null;
  }
}

function saveCache(plants: Plant[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(plants));
  } catch {
    // storage full or disabled — silently ignore
  }
}

interface PlantState {
  plants: Plant[];
  loading: boolean;
  error: string | null;
}

interface PlantContextValue extends PlantState {
  refresh: () => Promise<void>;
}

const PlantContext = createContext<PlantContextValue | null>(null);

export function PlantProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlantState>(() => {
    const cached = loadCache();
    return {
      plants: cached ?? [],
      loading: cached === null,
      error: null,
    };
  });

  const fetchPlants = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }
    try {
      const plants = await getPlants();
      saveCache(plants);
      setState({ plants, loading: false, error: null });
    } catch {
      setState((prev) => ({
        plants: prev.plants,
        loading: false,
        error: 'Failed to load plants.',
      }));
    }
  }, []);

  useEffect(() => {
    fetchPlants(true);
  }, [fetchPlants]);

  const refresh = useCallback(async () => {
    await fetchPlants(false);
  }, [fetchPlants]);

  return (
    <PlantContext.Provider value={{ ...state, refresh }}>
      {children}
    </PlantContext.Provider>
  );
}

export function usePlants(): PlantContextValue {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
}
