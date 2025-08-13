import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/apiClient";

const initial = { name: "", country: "", city: "" };

export default function PortEditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/api/ports/${id}`)
      .then(res => {
        const p = res.data || {};
        setForm({
          name: p.name ?? "",
          country: p.country ?? "",
          city: p.city ?? "",
        });
      })
      .catch(e => setError(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = [];
    if (!form.name.trim()) errs.push("Name zorunlu.");
    if (!form.country.trim()) errs.push("Country zorunlu.");
    if (!form.city.trim()) errs.push("City zorunlu.");
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (errs.length) return setError(errs.join(" "));

    try {
      setSaving(true);
      await api.put(`/api/ports/${id}`, {
        name: form.name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
      });
      nav("/ports");
    } catch (er) {
      setError(er?.response?.data?.message || er.message || "Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Yükleniyor…</p>;

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 12 }}><Link to="/ports">← Ports listesine dön</Link></div>
      <h1 className="text-3xl font-bold mb-4">Port Düzenle</h1>
      {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block mb-1">Name *</label>
          <input id="name" name="name" value={form.name} onChange={onChange}
                 className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="country" className="block mb-1">Country *</label>
          <input id="country" name="country" value={form.country} onChange={onChange}
                 className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="city" className="block mb-1">City *</label>
          <input id="city" name="city" value={form.city} onChange={onChange}
                 className="border rounded px-3 py-2 w-full" />
        </div>

        <button type="submit" disabled={saving}
                style={{ marginTop: 8, padding:"8px 14px", borderRadius: 8,
                         background: saving ? "#93c5fd" : "#3b82f6", color:"#fff",
                         cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
