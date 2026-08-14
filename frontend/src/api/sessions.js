export const SESSION_API_BASE = 'http://localhost:8001/api/sessions';

export const createSession = async (title, token) => {
  const res = await fetch(`${SESSION_API_BASE}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
};

export const getSessionByInviteCode = async (code) => {
  const res = await fetch(`${SESSION_API_BASE}/join/${code}/`);
  if (!res.ok) throw new Error('Invalid or expired invite link');
  return res.json();
};

export const joinSession = async (code, token) => {
  const res = await fetch(`${SESSION_API_BASE}/${code}/join/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to join session');
  return res.json();
};

export const getMySessions = async (token) => {
  const res = await fetch(`${SESSION_API_BASE}/my/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
};
