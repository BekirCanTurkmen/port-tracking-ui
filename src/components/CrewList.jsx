// src/components/CrewList.jsx
import { useEffect, useState } from "react";
 import api from "../services/apiClient";// konumuna göre yol: components'tan bir üst klasöre

function toArray(d) {
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.value)) return d.value;
  if (Array.isArray(d?.$values)) return d.$values; // .NET serializer
  return d ? [d] : [];
}

export default function CrewList() {
  const [crew, setCrew] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/crewmembers")
      .then((res) => {
        console.log("Crew API raw response:", res.data, typeof res.data);
        setCrew(toArray(res.data));
      })
      .catch((err) => {
        console.error("Crew API error:", err);
        setError(err?.response?.data?.message || err.message || "Bilinmeyen hata");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>Hata: {error}</p>;
  if (!Array.isArray(crew) || crew.length === 0) return <p>Mürettebat bulunamadı</p>;

  return (
    <ul>
      {crew.map((c) => (
        <li key={c.crewId ?? c.id}>
          {c.firstName} {c.lastName} — {c.role}
        </li>
      ))}
    </ul>
  );
}
