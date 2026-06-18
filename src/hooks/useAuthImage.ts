import { useState, useEffect } from 'react';

const BASE64_MAGIC: [string, string][] = [
  ['/9j/', 'image/jpeg'],
  ['iVBORw0KGgo', 'image/png'],
  ['R0lGOD', 'image/gif'],
  ['UklGR', 'image/webp'],
  ['Qk', 'image/bmp'],
  ['PHN2Zy', 'image/svg+xml'],
];

function detectImageMime(base64: string): string | null {
  const trimmed = base64.trimStart();
  for (const [magic, mime] of BASE64_MAGIC) {
    if (trimmed.startsWith(magic)) return mime;
  }
  return null;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function fetchImageAsDataUrl(url: string, fetchHeaders: HeadersInit): Promise<string> {
  const response = await fetch(url, { headers: fetchHeaders });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.startsWith('image/')) {
    const blob = await response.blob();
    return blobToDataUrl(blob);
  }

  const text = await response.text();

  if (text.startsWith('data:image/')) return text;

  const mime = detectImageMime(text);
  if (mime) return `data:${mime};base64,${text.trimStart()}`;

  throw new Error(`Unrecognised image format (Content-Type: ${contentType})`);
}

export function useAuthImage(url: string, fetchHeaders?: HeadersInit): { dataUrl: string | null; loading: boolean } {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const headersKey = fetchHeaders ? JSON.stringify(fetchHeaders) : '';

  useEffect(() => {
    if (!fetchHeaders) {
      setDataUrl(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setDataUrl(null);
    setLoading(true);

    fetch(url, { headers: fetchHeaders, signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get('Content-Type') || '';

        if (contentType.startsWith('image/')) {
          const blob = await res.blob();
          if (cancelled) return;
          return blobToDataUrl(blob);
        }

        const text = await res.text();
        if (cancelled) return;

        if (text.startsWith('data:image/')) return text;

        const mime = detectImageMime(text);
        if (mime) return `data:${mime};base64,${text.trimStart()}`;

        throw new Error(`Unrecognised image format (Content-Type: ${contentType})`);
      })
      .then((result) => {
        if (!cancelled && result) {
          setDataUrl(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn(`useAuthImage: failed to load ${url}`, err);
          setDataUrl(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, headersKey]);

  return { dataUrl, loading };
}
