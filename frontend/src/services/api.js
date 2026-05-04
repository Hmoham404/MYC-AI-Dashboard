import axios from 'axios';

// For Vercel multi-service deployment: /_/backend
// For local development: http://localhost:8000
// For separate deployment: https://api.example.com
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     import.meta.env.VITE_API_BASE_URL || 
                     (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                       ? 'http://localhost:8000' 
                       : '/_/backend');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export async function uploadFile(file, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return data;
}

export async function analyzeFile(fileId, language = 'fr') {
  const { data } = await api.post('/analyze', { file_id: fileId }, { params: { language } });
  return data;
}

export async function getCharts(fileId, params = {}) {
  const query = {
    ...(params.language ? { language: params.language } : {}),
    ...(params.column ? { column: params.column } : {}),
    ...(params.chartTypes?.length ? { chart_types: params.chartTypes } : {}),
  };

  const { data } = await api.get(`/charts/${fileId}`, { params: query });
  return data;
}

export function exportDashboard(fileId, format = 'png', language = 'fr') {
  const url = `${API_BASE_URL}/export/${fileId}?format=${format}&language=${language}`;
  window.open(url, '_blank');
}

export default api;
