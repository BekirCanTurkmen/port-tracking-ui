// src/services/visit.service.js
import api from "./apiClient";

// .NET bazen koleksiyonları {"$values": [...]} ile döndürür.
// Bu helper, ikisini de tek tipe (dizi) indirger.
const toList = (data) => (Array.isArray(data) ? data : (data?.$values ?? []));

export const getVisits = async () => {
  const res = await api.get("/api/shipvisits");
  return toList(res.data);
};

export const getVisit = async (id) => {
  const res = await api.get(`/api/shipvisits/${id}`);
  return res.data;
};

export const createVisit = async (payload) => {
  const res = await api.post("/api/shipvisits", payload);
  return res.data;
};

export const updateVisit = async (id, payload) => {
  const res = await api.put(`/api/shipvisits/${id}`, payload);
  return res.data;
};

export const deleteVisit = async (id) => {
  const res = await api.delete(`/api/shipvisits/${id}`);
  return res.data;
};

// Form dropdown’ları için yardımcılar:
export const getShips = async () => {
  const res = await api.get("/api/ships");
  return toList(res.data);
};

export const getPorts = async () => {
  const res = await api.get("/api/ports");
  return toList(res.data);
};
