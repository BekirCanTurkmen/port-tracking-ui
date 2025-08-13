import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/apiClient";

// Basit alan doğrulayıcılar
const currentYear = new Date().getFullYear();
const initial = { name: "", imo: "", type: "", flag: "", yearBuilt: "" };

export default function ShipCreatePage() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = [];
    if (!form.name.trim()) errs.push("Name zorunlu.");
    if (!/^IMO\d{7}$/.test(form.imo.trim())) errs.push("IMO formatı 'IMO' + 7 rakam olmalı (örn: IMO1234567).");
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
    if (errs.length) {
      setError(errs.join(" "));
      return;
    }

    try {
      setSubmitting(true);
      // Backend gereksinimleri: Name, IMO (unique), Type, Flag, YearBuilt zorunlu. 
      await api.post("/api/ships", {
        name: form.name.trim(),
        imo: form.imo.trim(),
        type: form.type.trim(),
        flag: form.flag.trim(),
        yearBuilt: Number(form.yearBuilt),
      });
      alert("Gemi başarıyla eklendi.");
        nav("/ships");
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data ||
        e2.message ||
        "Kaydetme sırasında bir hata oluştu.";
      // Benzersiz IMO ihlallerinde backend genelde 400/409 döndürür; mesajı aynen gösteriyoruz.
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/ships">← Ships listesine dön</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Yeni Gemi Ekle</h1>

      {error && (
        <div style={{ color: "#b91c1c", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="border rounded px-3 py-2 w-full"
            placeholder="Evergreen Star"
          />
        </div>

        <div>
          <label className="block mb-1">IMO *</label>
          <input
            name="imo"
            value={form.imo}
            onChange={onChange}
            className="border rounded px-3 py-2 w-full"
            placeholder="IMO1234567"
          />
          <small className="text-gray-500">IMO benzersiz olmalı.</small>
        </div>

        <div>
          <label className="block mb-1">Type *</label>
          <input
            name="type"
            value={form.type}
            onChange={onChange}
            className="border rounded px-3 py-2 w-full"
            placeholder="Container / Tanker / Cargo ..."
          />
        </div>

        <div>
          <label className="block mb-1">Flag *</label>
          <input
            name="flag"
            value={form.flag}
            onChange={onChange}
            className="border rounded px-3 py-2 w-full"
            placeholder="Panama / Liberia / Malta ..."
          />
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
            placeholder="2015"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2"
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: submitting ? "#93c5fd" : "#3b82f6",
            color: "white",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
