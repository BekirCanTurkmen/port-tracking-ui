// en üst importlarda (varsa aynen kalsın)
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/apiClient"; // şu an kullandığın yol buysa kalsın

export default function CrewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Arama state'i
  const [q, setQ] = useState("");

  // ✅ Silme sırasında butonu kilitlemek için
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api
      .get("/api/crewmembers")
      .then((res) =>
        setItems(Array.isArray(res.data) ? res.data : res.data?.$values ?? [])
      )
      .catch((err) => setError(err?.message ?? "Bilinmeyen hata"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bu mürettebatı silmek istiyor musun?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/crewmembers/${id}`);
      // listeden çıkar
      setItems((prev) => prev.filter((c) => (c.crewId ?? c.id) !== id));
    } catch (e) {
      alert(
        e?.response?.data?.message || e.message || "Silme işlemi başarısız."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p style={{ color: "crimson" }}>Hata: {error}</p>;

  // ✅ Filtrelenmiş liste (case-insensitive)
  const list = items.filter((c) => {
    const text = `${c.firstName} ${c.lastName} ${c.role}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Crews</h1>

      <div style={{ marginBottom: 12 }}>
        <Link to="/crews/new" className="text-blue-500 hover:underline">
          + Yeni Mürettebat
        </Link>
      </div>

      {/* ✅ Arama kutusu */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ara: isim, soyisim ya da rol…"
        className="border rounded px-3 py-2 mb-4 w-full max-w-md"
      />

      {list.length === 0 ? (
        <p>Kayıt bulunamadı.</p>
      ) : (
        <ul className="list-disc pl-6">
          {list.map((c) => {
            const id = c.crewId ?? c.id;
            return (
              <li key={id}>
                {c.firstName} {c.lastName} - {c.role}
                {/* Düzenle */}
                <Link to={`/crews/${id}/edit`} style={{ marginLeft: 6 }}>
                  Düzenle
                </Link>
                {/* Sil */}
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
    </div>
  );
}
