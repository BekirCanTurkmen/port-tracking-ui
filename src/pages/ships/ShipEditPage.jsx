import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/apiClient";

const currentYear = new Date().getFullYear();
const initial = { name: "", imo: "", type: "", flag: "", yearBuilt: "" };

export default function ShipEditPage() {
  const { id } = useParams();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/api/ships/${id}`)           // gerekirse /api/Ships/${id}
      .then((res) => {
        const s = res.data || {};
        setForm({
          name: s.name ?? "",
          imo: s.imo ?? "",
          type: s.type ?? "",
          flag: s.flag ?? "",
          yearBuilt: s.yearBuilt ?? "",
        });
      })
      .catch((e) => setError(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = [];
    if (!form.name.trim()) errs.push("Name zorunlu.");
    if (!/^IMO\d{7}$/.test(form.imo.trim())) errs.push("IMO formatı 'IMO' + 7 rakam olmalı.");
    if (!form.type.trim()) errs.push("Type zorunlu.");
    if (!form.flag.trim()) errs.push("Flag zorunlu.");
    const y = Number(form.yearBuilt);
    if (!Number.isInteger(y) || y < 1800 || y > currentYear) errs.push(`YearBuilt 1800–${currentYear} aralığında olmalı.`);
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (errs.length) return setError(errs.join(" "));

    try {
      setSaving(true);
      await api.put(`/api/ships/${id}`, {   // gerekirse /api/Ships/${id}
        name: form.name.trim(),
        imo: form.imo.trim(),
        type: form.type.trim(),
        flag: form.flag.trim(),
        yearBuilt: Number(form.yearBuilt),
      });
      nav("/ships");
    } catch (e2) {
      setError(
        e2?.response?.data?.message ||
        e2?.response?.data ||
        e2.message ||
        "Kaydetme sırasında bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Yükleniyor…</p>;

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/ships">← Ships listesine dön</Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">Gemi Düzenle</h1>

      {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Name *</label>
          <input name="name" value={form.name} onChange={onChange} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">IMO *</label>
          <input name="imo" value={form.imo} onChange={onChange} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Type *</label>
          <input name="type" value={form.type} onChange={onChange} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Flag *</label>
          <input name="flag" value={form.flag} onChange={onChange} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Year Built *</label>
          <input
            name="yearBuilt"
            type="number"
            value={form.yearBuilt}
            onChange={onChange}
            className="border rounded px-3 py-2 w-full"
            min="1800"
            max={currentYear}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 8, padding: "8px 14px", borderRadius: 8,
            background: saving ? "#93c5fd" : "#3b82f6", color: "white",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
