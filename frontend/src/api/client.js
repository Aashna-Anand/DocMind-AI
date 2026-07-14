const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === 'string'
      ? detail
      : Array.isArray(detail)
        ? detail.map((item) => item.msg).join(', ')
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  health: () => request('/health'),

  listDocuments: () => request('/documents'),

  uploadDocument: (file, onProgress) =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/documents/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.detail || 'Upload failed'));
          }
        } catch {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    }),

  deleteDocument: (id) =>
    request(`/documents/${id}`, { method: 'DELETE' }),

  listSessions: () => request('/sessions'),

  createSession: () =>
    request('/sessions', { method: 'POST' }),

  getSession: (id) => request(`/sessions/${id}`),

  deleteSession: (id) =>
    request(`/sessions/${id}`, { method: 'DELETE' }),

  sendMessage: (payload) =>
    request('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
};
