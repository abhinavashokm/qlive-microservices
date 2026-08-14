export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || data?.error || data?.username || 'An error occurred';
    throw new ApiError(errorMessage, response.status);
  }

  return data;
};
