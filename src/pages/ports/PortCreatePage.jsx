import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/apiClient";

const initial = { name: "", country: "", city: "" };

export default function PortCreatePage() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = [];
    if (!form.name.trim()) errs.push("Name zorunlu.");
    if (!form.country.trim()) errs.push("Country zorunlu.");
    if (!form.city.trim()) errs.push("City zorunlu.");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (errs.length) return setError(errs.join(" "));

    try {
      setSaving(true);
      await api.post("/api/ports", {
        name: form.name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
      });
      alert("Port başarıyla eklendi.");
      nav("/ports");
    } catch (er) {
      setError(er?.response?.data?.message || er.message || "Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 12 }}><Link to="/ports">← Ports listesine dön</Link></div>
      <h1 className="text-3xl font-bold mb-4">Yeni Port Ekle</h1>

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
