import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";

type Pokemon = {
  id: number;
  name: string;
  sprites?: { front_default?: string };
  types?: { type: { name: string } }[];
};

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Pokemon>(`/pokemon/${id}`)
      .then(res => setData(res.data))
      .catch(() => setData(null));
  }, [id]);

  const go = (delta: number) => {
    const next = Math.max(1, Number(id) + delta);
    navigate(`/detail/${next}`);
  };

  if (!data) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <Link to="/">← Back</Link>
      <h1 className="text-2xl font-bold capitalize">{data.name}</h1>
      {data.sprites?.front_default && (
        <img src={data.sprites.front_default} alt={data.name} width={160} />
      )}
      <div className="text-sm">
        Types: {data.types?.map(t => t.type.name).join(", ") || "N/A"}
      </div>
      <div className="flex gap-2">
        <button onClick={() => go(-1)} className="border rounded px-3 py-1">Previous</button>
        <button onClick={() => go(1)} className="border rounded px-3 py-1">Next</button>
      </div>
    </div>
  );
}
