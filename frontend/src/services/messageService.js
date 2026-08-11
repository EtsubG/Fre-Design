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
  // Backend returns { message, id, date } — wrap in { data }
  const { data } = await apiClient.post('/messages', payload);
  return {
    data: {
      id:   data.id,
      date: data.date,
    },
  };
}

export async function getMessages() {
  if (USE_MOCK) {
    await delay(400);
    return { data: MOCK_MESSAGES };
  }
  // Backend returns { count, messages: [...] } — normalise to { data: [...] }
  const { data } = await apiClient.get('/messages');
  return { data: data.messages || [] };
}
