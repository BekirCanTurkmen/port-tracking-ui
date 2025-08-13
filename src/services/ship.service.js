// src/app/services/ship.service.js
import api from "../services/apiClient";

// .NET farklı sarmallar döndürebildiği için güvenli dizi dönüştürücü
const toArray = (d) => {
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.value)) return d.value;
  if (Array.isArray(d?.$values)) return d.$values;
  return d ? [d] : [];
};

export const shipService = {
  getAll: async () => {
    const res = await api.get("/api/ships"); // gerekirse /api/Ships yap
    return toArray(res.data);
  },
  remove: async (id) => {
    await api.delete(`/api/ships/${id}`);     // gerekirse /api/Ships/${id}
  },
  // (sonraki adımda ekleyeceğiz)
  // getById: (id) => api.get(`/api/ships/${id}`).then(r => r.data),
  // create: (dto) => api.post("/api/ships", dto).then(r => r.data),
  // update: (id, dto) => api.put(`/api/ships/${id}`, dto).then(r => r.data),
};
