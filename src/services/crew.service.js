import { api } from './apiClient';

export const CrewService = {
  list: async () => (await api.get('/api/crewmembers')).data,
  get: async (id) => (await api.get(`/api/crewmembers/${id}`)).data,
  create: async (body) => (await api.post('/api/crewmembers', body)).data,
  update: async (id, body) => (await api.put(`/api/crewmembers/${id}`, body)).data,
  remove: async (id) => (await api.delete(`/api/crewmembers/${id}`)).data,
};
