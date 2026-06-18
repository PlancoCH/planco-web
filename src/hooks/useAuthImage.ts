import { useState, useEffect, useRef } from 'react';

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function useAuthImage(url: string, fetchHeaders?: HeadersInit): { dataUrl: string | null; loading: boolean } {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!fetchHeaders);
  const prevHeadersRef = useRef<string | undefined>();

  const headersKey = fetchHeaders ? JSON.stringify(fetchHeaders) : undefined;

  useEffect(() => {
    if (!fetchHeaders) {
      setDataUrl(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    if (headersKey !== prevHeadersRef.current) {
      setDataUrl(null);
      setLoading(true);
    }
    prevHeadersRef.current = headersKey;

    fetch(url, { headers: fetchHeaders, signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => blobToDataUrl(blob))
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDataUrl(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, headersKey, fetchHeaders]);

  return { dataUrl, loading };
}
