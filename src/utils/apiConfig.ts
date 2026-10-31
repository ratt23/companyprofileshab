const PRODUCTION_API = 'https://graphicat.site/api';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const apiParam = params.get('api');
    if (apiParam) {
      let clean = apiParam.trim();
      if (!clean.includes('dashdev')) {
        return clean.replace(/\/+$/, '');
      }
    }
    // Local development hostname check
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const envUrl = import.meta.env?.VITE_API_BASE_URL;
      if (envUrl && !envUrl.includes('dashdev')) {
        return envUrl.trim().replace(/\/+$/, '');
      }
      return 'http://localhost:3001/api';
    }
  }

  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  if (envUrl) {
    let clean = envUrl.trim();
    if (!clean.includes('dashdev')) {
      return clean.replace(/\/+$/, '');
    }
  }

  return PRODUCTION_API;
}

export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  let cleanPath = (path || '').trim().replace(/^\/+/, '');

  // If base ends with /api and path starts with api/, avoid /api/api/
  if (base.endsWith('/api') && cleanPath.startsWith('api/')) {
    cleanPath = cleanPath.substring(4);
  }

  return `${base}/${cleanPath}`;
}

