import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CrewService } from '../../services/crew.service.js';
import { api } from "../../services/apiClient"; // sende export const api varsa böyle

export default function CrewDetailPage() {
  const { id } = useParams();
  const [crew, setCrew] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/crewmembers/${id}`)
      .then(res => setCrew(res.data))
      .catch(err => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p style={{color:"crimson"}}>Hata: {error}</p>;
  if (!crew) return <p>Kayıt bulunamadı.</p>;

  return (
    <div className="space-y-2">
      <div><Link to="/crews">← Listeye dön</Link></div>
      <h2 className="text-2xl font-semibold">
        {crew.firstName} {crew.lastName}
      </h2>
      <div>Görev: {crew.role}</div>
      <div>E‑posta: {crew.email}</div>
      <div>Telefon: {crew.phoneNumber}</div>
    </div>
  );
}
