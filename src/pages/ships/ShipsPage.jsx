// src/app/pages/ships/ShipsPage.jsx
import { useEffect, useState } from "react";
import api from "../../services/apiClient"; // <- not ettiğin yol
import { Link } from "react-router-dom";
 
// Gelen her türlü response'u güvenle diziye çevir
function toArray(d) {
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.value)) return d.value;
  if (Array.isArray(d?.$values)) return d.$values; // .NET JSON
  return d ? [d] : [];
}

export default function ShipsPage() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Listeyi yükle
  useEffect(() => {
    api
      .get("/api/ships") // Gerekirse /api/Ships olarak değiştir
      .then((res) => setShips(toArray(res.data)))
      .catch((e) =>
        setError(e?.response?.data?.message || e.message || "Bilinmeyen hata")
      )
      .finally(() => setLoading(false));
  }, []);

  // Silme
  const handleDelete = async (id) => {
    if (!confirm("Bu gemiyi silmek istiyor musun?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/ships/${id}`); // Gerekirse /api/Ships/${id}
      setShips((prev) => prev.filter((s) => (s.shipId ?? s.id) !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Silme işlemi başarısız.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p style={{ color: "crimson" }}>Hata: {error}</p>;
  if (!ships.length) return <p>Gemi bulunamadı.</p>;

  return (
    
    <div>
      <h1 className="text-4xl font-bold mb-6">Ships</h1>
      <Link to="/ships/new" className="text-blue-500 hover:underline">
        Yeni Gemi Ekle
      </Link>
      <ul className="list-disc pl-6">
        {ships.map((s) => {
          const id = s.shipId ?? s.id;
          return (
            <li key={id} className="mb-1">
                
              {s.name} — {s.type} — {s.flag} — {s.yearBuilt} (IMO: {s.imo})
              {" "}
              <button
                onClick={() => handleDelete(id)}
                disabled={deletingId === id}
                style={{
                  marginLeft: 8,
                  padding: "2px 8px",
                  border: "1px solid #dc2626",
                  color: "#dc2626",
                  borderRadius: 6,
                  cursor: deletingId === id ? "not-allowed" : "pointer",
                  opacity: deletingId === id ? 0.6 : 1,
                  background: "transparent",
                }}
              >
                {deletingId === id ? "Siliniyor…" : "Sil"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
