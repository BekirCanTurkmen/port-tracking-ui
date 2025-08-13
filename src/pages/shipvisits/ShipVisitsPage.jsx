// src/pages/shipvisits/ShipVisitsPage.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getVisits, deleteVisit, getShips, getPorts } from "../../services/visit.service";

export default function ShipVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [ships, setShips] = useState([]);
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ID -> İsim map'leri
  const shipMap = useMemo(() => {
    const m = {};
    ships.forEach((s) => (m[s.shipId] = s.name));
    return m;
  }, [ships]);

  const portMap = useMemo(() => {
    const m = {};
    ports.forEach((p) => (m[p.portId] = p.name)); // istersen `${p.name} - ${p.city}`
    return m;
  }, [ports]);

  const load = () => {
    setLoading(true);
    Promise.all([getVisits(), getShips(), getPorts()])
      .then(([v, s, p]) => {
        setVisits(v);
        setShips(s);
        setPorts(p);
      })
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Bu ziyareti silmek istediğinize emin misiniz?")) return;
    try {
      await deleteVisit(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "crimson" }}>Hata: {err}</p>;

  return (
    <div className="p-4">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="text-3xl font-bold mb-4">Ship Visits</h1>
        <Link to="/shipvisits/new" className="px-3 py-2 rounded bg-blue-600 text-white">
          + Yeni Ziyaret
        </Link>
      </div>

      {visits.length === 0 ? (
        <p>Hiç ziyaret kaydı yok.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">VisitId</th>
              <th className="border p-2 text-left">Ship</th>
              <th className="border p-2 text-left">Port</th>
              <th className="border p-2 text-left">Arrival</th>
              <th className="border p-2 text-left">Departure</th>
              <th className="border p-2 text-left">Purpose</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => {
              const shipName = v.shipName || v.ship?.name || shipMap[v.shipId] || v.shipId;
              const portName = v.portName || v.port?.name || portMap[v.portId] || v.portId;
              return (
                <tr key={v.visitId}>
                  <td className="border p-2">{v.visitId}</td>
                  <td className="border p-2">{shipName}</td>
                  <td className="border p-2">{portName}</td>
                  <td className="border p-2">
                    {v.arrivalDate ? new Date(v.arrivalDate).toLocaleString() : "-"}
                  </td>
                  <td className="border p-2">
                    {v.departureDate ? new Date(v.departureDate).toLocaleString() : "-"}
                  </td>
                  <td className="border p-2">{v.purpose}</td>
                  <td className="border p-2">
                    <Link to={`/shipvisits/${v.visitId}/edit`} className="mr-2 text-blue-600">
                      Düzenle
                    </Link>
                    <button onClick={() => onDelete(v.visitId)} className="text-red-600">
                      Sil
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
