import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getPlants } from '../api/plants';
import { getToken } from '../api/client';
import { fetchImageAsDataUrl } from '../hooks/useAuthImage';
import type { Plant } from '../types/plant';

const CACHE_KEY = 'cached_plants';
const IMAGE_CACHE_KEY = 'cached_plant_images';

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

function loadImageCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function saveImageCache(cache: Record<string, string>): void {
  try {
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or disabled — silently ignore
  }
}

interface PlantState {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  imageCache: Record<string, string>;
}

interface PlantContextValue extends PlantState {
  refresh: () => Promise<void>;
  getCachedImage: (plantId: string) => string | null;
}

const PlantContext = createContext<PlantContextValue | null>(null);

export function PlantProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlantState>(() => {
    const cached = loadCache();
    return {
      plants: cached ?? [],
      loading: cached === null,
      error: null,
      imageCache: loadImageCache(),
    };
  });

  const fetchPlants = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }
    try {
      const plants = await getPlants();
      saveCache(plants);

      const token = getToken();
      const imageCache: Record<string, string> = loadImageCache();

      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        await Promise.allSettled(
          plants.map(async (plant) => {
            if (imageCache[plant.id]) return;
            try {
              const dataUrl = await fetchImageAsDataUrl(
                `https://api.planco.ch/api/plants/${plant.id}/image`,
                headers,
              );
              imageCache[plant.id] = dataUrl;
            } catch {
              // image not available — leave uncached
            }
          }),
        );
        saveImageCache(imageCache);
      }

      setState({ plants, loading: false, error: null, imageCache });
    } catch {
      setState((prev) => ({
        plants: prev.plants,
        loading: false,
        error: 'Failed to load plants.',
        imageCache: prev.imageCache,
      }));
    }
  }, []);

  useEffect(() => {
    fetchPlants(true);
  }, [fetchPlants]);

  const refresh = useCallback(async () => {
    await fetchPlants(false);
  }, [fetchPlants]);

  const getCachedImage = useCallback(
    (plantId: string): string | null => state.imageCache[plantId] ?? null,
    [state.imageCache],
  );

  return (
    <PlantContext.Provider value={{ ...state, refresh, getCachedImage }}>
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
