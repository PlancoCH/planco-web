import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getStats } from '../api/stats';
import type { StatsResponse } from '../types/stats';

const CACHE_KEY = 'cached_stats';

function loadCache(): StatsResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'devices' in parsed && 'plants' in parsed) {
      return parsed as StatsResponse;
    }
    return null;
  } catch {
    return null;
  }
}

function saveCache(stats: StatsResponse): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
  } catch {
    // storage full or disabled — silently ignore
  }
}

interface StatsState {
  stats: StatsResponse | null;
  loading: boolean;
  error: string | null;
}

interface StatsContextValue extends StatsState {
  refresh: () => Promise<void>;
}

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StatsState>(() => {
    const cached = loadCache();
    return {
      stats: cached,
      loading: cached === null,
      error: null,
    };
  });

  const fetchStats = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }
    try {
      const stats = await getStats();
      saveCache(stats);
      setState({ stats, loading: false, error: null });
    } catch {
      setState((prev) => ({
        stats: prev.stats,
        loading: false,
        error: 'Failed to load stats.',
      }));
    }
  }, []);

  useEffect(() => {
    fetchStats(true);
  }, [fetchStats]);

  const refresh = useCallback(async () => {
    await fetchStats(false);
  }, [fetchStats]);

  return (
    <StatsContext.Provider value={{ ...state, refresh }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats(): StatsContextValue {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
