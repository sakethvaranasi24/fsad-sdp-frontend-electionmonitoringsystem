const TOKEN_KEY = 'emsAuthToken';
const REFRESH_TOKEN_KEY = 'emsRefreshToken';

export function setToken(token, { remember = false } = {}) {
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    console.error('Failed to store token', e);
  }
}

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
  } catch (e) {
    return null;
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}

export function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    try {
      // fallback without decodeURIComponent
      const parts = token.split('.');
      const payload = parts[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      return null;
    }
  }
}

export function isTokenValid(token) {
  const payload = decodeJwt(token);
  if (!payload) return false;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && typeof payload.exp === 'number') {
    return payload.exp > now + 5; // 5s clock skew
  }
  // If no exp claim, treat as valid (best-effort)
  return true;
}

export function getUserFromToken(token) {
  const payload = decodeJwt(token || getToken());
  if (!payload) return null;
  return payload;
}

export function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers ? {...options.headers} : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, {...options, headers});
}

export function attachTokenToAxios(instance) {
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default {
  setToken,
  getToken,
  clearToken,
  decodeJwt,
  isTokenValid,
  getUserFromToken,
  authFetch,
  attachTokenToAxios
};
