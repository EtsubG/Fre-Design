import apiClient from './apiClient';
import { MOCK_MESSAGES } from '../hooks/data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendMessage(payload) {
  if (USE_MOCK) {
    await delay(900);
    return {
      data: {
        ...payload,
        id: `m${Date.now()}`,
        date: new Date().toISOString(),
        read: false,
      },
    };
  }
  const { data } = await apiClient.post('/messages', payload);
  return data;
}

export async function getMessages() {
  if (USE_MOCK) {
    await delay(400);
    return { data: MOCK_MESSAGES };
  }
  const { data } = await apiClient.get('/messages');
  return data;
}
