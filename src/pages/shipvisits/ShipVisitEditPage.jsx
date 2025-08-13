// src/pages/shipvisits/ShipVisitEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getVisit, updateVisit, getShips, getPorts } from "../../services/visit.service";

const toInputValue = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const iso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  return iso;
};

export default function ShipVisitEditPage() {
  const nav = useNavigate();
  const { id } = useParams();

  const [ships, setShips] = useState([]);
  const [ports, setPorts] = useState([]);
  const [form, setForm] = useState({
    shipId: "",
    portId: "",
    arrivalDate: "",
    departureDate: "",
    purpose: "",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([getShips(), getPorts(), getVisit(id)])
      .then(([ships, ports, v]) => {
        setShips(ships);
        setPorts(ports);
        setForm({
          shipId: v.shipId?.toString() ?? v.ship?.shipId?.toString() ?? "",
          portId: v.portId?.toString() ?? v.port?.portId?.toString() ?? "",
          arrivalDate: toInputValue(v.arrivalDate),
          departureDate: toInputValue(v.departureDate),
          purpose: v.purpose ?? "",
        });
      })
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.shipId || !form.portId || !form.arrivalDate || !form.departureDate || !form.purpose) {
      return "Tüm alanlar zorunludur.";
    }
    const a = new Date(form.arrivalDate);
    const d = new Date(form.departureDate);
    if (a >= d) return "ArrivalDate, DepartureDate’den küçük olmalı.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);

    try {
      await updateVisit(id, {
        shipId: Number(form.shipId),
        portId: Number(form.portId),
        arrivalDate: form.arrivalDate,
        departureDate: form.departureDate,
        purpose: form.purpose.trim(),
      });
      nav("/shipvisits");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Ziyaret Düzenle #{id}</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block mb-1">Ship</label>
          <select
            name="shipId"
            value={form.shipId}
            onChange={onChange}
            className="border p-2 w-full"
          >
            <option value="">Seçiniz…</option>
            {ships.map((s) => (
              <option key={s.shipId} value={s.shipId}>
                {s.name} (#{s.shipId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Port</label>
          <select
            name="portId"
            value={form.portId}
            onChange={onChange}
            className="border p-2 w-full"
          >
            <option value="">Seçiniz…</option>
            {ports.map((p) => (
              <option key={p.portId} value={p.portId}>
                {p.name} - {p.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Arrival Date</label>
          <input
            type="datetime-local"
            name="arrivalDate"
            value={form.arrivalDate}
            onChange={onChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Departure Date</label>
          <input
            type="datetime-local"
            name="departureDate"
            value={form.departureDate}
            onChange={onChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Purpose</label>
          <input
            type="text"
            name="purpose"
            value={form.purpose}
            onChange={onChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 rounded bg-green-600 text-white">
            Kaydet
          </button>
          <Link to="/shipvisits" className="px-3 py-2 rounded bg-gray-200">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
