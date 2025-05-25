// Utilidad para gestionar el token JWT

export function getToken() {
  return localStorage.getItem('jwt');
}

export function setToken(token) {
  localStorage.setItem('jwt', token);
}

export function removeToken() {
  localStorage.removeItem('jwt');
}

// Decodifica el JWT y devuelve el payload como objeto
export function decodeToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (e) {
    return null;
  }
}

// Sobrescribe el campo username del JWT en localStorage (solo para frontend, no cambia el backend)
export function setUserNameInToken(newName) {
  const token = getToken();
  if (!token) return;
  const parts = token.split('.');
  if (parts.length !== 3) return;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    payload.username = newName;
    const newPayload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const newToken = [parts[0], newPayload, parts[2]].join('.');
    setToken(newToken);
  } catch (e) {}
}

// Devuelve el nombre de usuario o email del JWT
export function getUserName() {
  const payload = decodeToken();
  if (!payload) return null;
  return payload.username || payload.email || payload.sub || null;
}

