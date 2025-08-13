// src/services/crew.service.js
import { api } from './apiClient.js';

export const CrewService = {
  list: async () => {
    const res = await api.get('/api/crewmembers');
    // Eğer array doğrudan dönüyorsa onu al, yoksa result içindeki array'i al
    return Array.isArray(res.data) ? res.data : res.data.result;
  },
  get: async (id) => (await api.get(`/api/crewmembers/${id}`)).data,
};
