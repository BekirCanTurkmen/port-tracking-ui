// src/app/pages/ports/PortsPage.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/apiClient";

export default function PortsPage() {
  const [ports, setPorts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // ✅ Silme sırasında butonu kilitlemek için

  useEffect(() => {
    api
      .get("/api/ports") // Gerekirse /api/Ports
      .then((res) =>
        setPorts(Array.isArray(res.data) ? res.data : res.data?.$values ?? [])
      )
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bu portu silmek istiyor musun?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/ports/${id}`); // Gerekirse /api/Ports/${id}
      setPorts((prev) => prev.filter((p) => (p.portId ?? p.id) !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Silme işlemi başarısız.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "crimson" }}>Hata: {err}</p>;

  return (
    <>
      <h1>Ports</h1>

      {/* Başlık altı: Yeni oluşturma linki */}
      <div style={{ marginBottom: 12 }}>
        <Link to="/ports/new" className="text-blue-500 hover:underline">
          + Yeni Port
        </Link>
      </div>

      {ports.length === 0 ? (
        <p>Port bulunamadı</p>
      ) : (
        <ul>
          {ports.map((p) => {
            const id = p.portId ?? p.id;
            return (
              <li key={id}>
                {p.name} — {p.city}, {p.country}{" "}
                <Link to={`/ports/${id}/edit`} style={{ marginLeft: 6 }}>
                  Düzenle
                </Link>{" "}
                <button
                  onClick={() => handleDelete(id)}
                  disabled={deletingId === id}
                  style={{
                    marginLeft: 6,
                    padding: "2px 8px",
                    border: "1px solid #dc2626",
                    color: "#dc2626",
                    borderRadius: 6,
                    background: "transparent",
                    cursor: deletingId === id ? "not-allowed" : "pointer",
                    opacity: deletingId === id ? 0.6 : 1,
                  }}
                >
                  {deletingId === id ? "Siliniyor…" : "Sil"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
