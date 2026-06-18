import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { fetchImageAsDataUrl } from '../hooks/useAuthImage';
import type { ImageResourceType } from '../types/image';

const STORAGE_KEY = 'image_cache';

function loadCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or disabled — silently ignore
  }
}

function cacheKey(type: ImageResourceType, id: number | string): string {
  return `${type}:${id}`;
}

interface ImageCacheContextValue {
  getImageUrl: (type: ImageResourceType, id: number | string) => string | null;
  prefetchImages: (
    type: ImageResourceType,
    items: Array<{ id: number | string; url: string }>,
    headers: HeadersInit,
  ) => Promise<void>;
}

const ImageCacheContext = createContext<ImageCacheContextValue | null>(null);

export function ImageCacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<Record<string, string>>(loadCache);

  const getImageUrl = useCallback(
    (type: ImageResourceType, id: number | string): string | null => {
      return cache[cacheKey(type, id)] ?? null;
    },
    [cache],
  );

  const prefetchImages = useCallback(
    async (
      type: ImageResourceType,
      items: Array<{ id: number | string; url: string }>,
      headers: HeadersInit,
    ) => {
      const freshCache = { ...loadCache() };
      let changed = false;

      await Promise.allSettled(
        items.map(async ({ id, url }) => {
          const key = cacheKey(type, id);
          if (freshCache[key]) return;
          try {
            const dataUrl = await fetchImageAsDataUrl(url, headers);
            freshCache[key] = dataUrl;
            changed = true;
          } catch {
            // image not available — leave uncached
          }
        }),
      );

      if (changed) {
        saveCache(freshCache);
        setCache(freshCache);
      }
    },
    [],
  );

  return (
    <ImageCacheContext.Provider value={{ getImageUrl, prefetchImages }}>
      {children}
    </ImageCacheContext.Provider>
  );
}

export function useImageCache(): ImageCacheContextValue {
  const ctx = useContext(ImageCacheContext);
  if (!ctx) throw new Error('useImageCache must be used within ImageCacheProvider');
  return ctx;
}
