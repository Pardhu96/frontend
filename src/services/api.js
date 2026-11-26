import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

export const EMOTION_COLORS = {
  angry: '#EF4444',
  happy: '#10B981',
  sad: '#3B82F6',
  neutral: '#64748B',
  calm: '#8B5CF6',
  fearful: '#F59E0B',
  disgust: '#EC4899',
  surprised: '#14B8A6',
};

export const EMOTION_EMOJIS = {
  angry: '😠',
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  calm: '😌',
  fearful: '😨',
  disgust: '🤢',
  surprised: '😲',
};

export async function checkHealth() {
  const res = await apiClient.get('/api/health');
  return res.data;
}

export async function fetchModelsInfo() {
  const res = await apiClient.get('/api/models');
  return res.data;
}

export async function fetchSpeakerEval() {
  const res = await apiClient.get('/api/speaker-eval');
  return res.data;
}

export async function fetchSamples() {
  const res = await apiClient.get('/api/samples');
  return res.data.samples || [];
}

export function getSampleAudioUrl(filename) {
  return `${API_BASE}/api/samples/${encodeURIComponent(filename)}`;
}

export async function predictAudio({ file, sampleName }) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  } else if (sampleName) {
    formData.append('sample_name', sampleName);
  }
  const res = await apiClient.post('/api/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function extractFeatures({ file, sampleName }) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  } else if (sampleName) {
    formData.append('sample_name', sampleName);
  }
  const res = await apiClient.post('/api/features', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
