import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/apiClient";

const initial = { firstName: "", lastName: "", email: "", phoneNumber: "", role: "" };
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = v => /^\+?[0-9\s-]{7,20}$/.test(v);

export default function CrewEditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/api/crewmembers/${id}`)
      .then(res => {
        const c = res.data || {};
        setForm({
          firstName: c.firstName ?? "",
          lastName: c.lastName ?? "",
          email: c.email ?? "",
          phoneNumber: c.phoneNumber ?? "",
          role: c.role ?? "",
        });
      })
      .catch(e => setError(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = [];
    if (!form.firstName.trim()) errs.push("FirstName zorunlu.");
    if (!form.lastName.trim()) errs.push("LastName zorunlu.");
    if (!emailOk(form.email.trim())) errs.push("Geçerli bir e‑posta girin.");
    if (!phoneOk(form.phoneNumber.trim())) errs.push("Geçerli bir telefon girin.");
    if (!form.role.trim()) errs.push("Role zorunlu.");
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (errs.length) return setError(errs.join(" "));

    try {
      setSaving(true);
      await api.put(`/api/crewmembers/${id}`, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        role: form.role.trim(),
      });
      nav("/crews");
    } catch (er) {
      setError(er?.response?.data?.message || er.message || "Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Yükleniyor…</p>;

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 12 }}><Link to="/crews">← Crews listesine dön</Link></div>
      <h1 className="text-3xl font-bold mb-4">Mürettebat Düzenle</h1>
      {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="firstName" className="block mb-1">First Name *</label>
          <input id="firstName" name="firstName" value={form.firstName} onChange={onChange}
                 className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-1">Last Name *</label>
          <input id="lastName" name="lastName" value={form.lastName} onChange={onChange}
                 className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email *</label>
          <input id="email" name="email" value={form.email} onChange={onChange}
                 className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block mb-1">Phone Number *</label>
          <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={onChange}
                 className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1">Role *</label>
          <input id="role" name="role" value={form.role} onChange={onChange}
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
