import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { api } from "../api/client";
import type { Pokemon } from "../types/pokemon";
import { loadListOrder, saveListOrder } from "../utils/listState";

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

 
  useEffect(() => {
    let cancelled = false;
    async function go() {
      if (!numericId) return;
      setLoading(true); setErr(null);
      try {
        const res = await api.get<Pokemon>(`/pokemon/${numericId}`);
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setErr("Failed to load Pokémon.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    go();
    return () => { cancelled = true; };
  }, [numericId]);

  const { prevId, nextId } = useMemo(() => {
    const order = loadListOrder(); // array of ids
    if (!order.length) {
      return { prevId: Math.max(1, numericId - 1), nextId: numericId + 1 };
    }
    const idx = order.indexOf(numericId);
    if (idx === -1) {

      order.push(numericId);
      saveListOrder(order, numericId);
      return { prevId: Math.max(1, numericId - 1), nextId: numericId + 1 };
    }
    const prev = order[(idx - 1 + order.length) % order.length];
    const next = order[(idx + 1) % order.length];
    return { prevId: prev, nextId: next };
  }, [numericId]);

  const goto = (id: number) => navigate(`/detail/${id}`);

  {loading && <div>Loading…</div>}
  {err && <div className="border border-red-300 bg-red-50 p-2 rounded">{err}</div>}

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <Link to="/">← Back to list</Link>

      {loading && <div>Loading…</div>}
      {err && (
        <div className="border border-red-300 bg-red-50 p-2 rounded">{err}</div>
      )}

      {data && (
        <>
          <h1 className="text-2xl font-bold capitalize">
            #{data.id} {data.name}
          </h1>
          {data.sprites?.front_default && (
            <img
              src={data.sprites.front_default || ""}
              alt={data.name}
              width={160}
              height={160}
            />
          )}
          <div className="text-sm">
            Types: {data.types?.map(t => t.type.name).join(", ") || "N/A"}
          </div>

          <div className="flex gap-2">
            <button onClick={() => goto(prevId)} className="border rounded px-3 py-1">
              ← Previous
            </button>
            <button onClick={() => goto(nextId)} className="border rounded px-3 py-1">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
