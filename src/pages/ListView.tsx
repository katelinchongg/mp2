import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { PokemonListItem, PokemonListResponse } from "../types/pokemon";
import { saveListOrder } from "../utils/listState";
import ControlPanel from "../components/ControlPanel";

export default function ListView() {

  const [raw, setRaw] = useState<PokemonListItem[]>([]);
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "id">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await api.get<PokemonListResponse>("/pokemon?limit=200");
        setRaw(res.data.results);
      } catch {
        setErr("Failed to load Pokémon list.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return raw
      .filter((p: PokemonListItem) => p.name.includes(term))
      .sort((a: PokemonListItem, b: PokemonListItem) => {
        let comp = 0;
        if (sortKey === "name") {
          comp = a.name.localeCompare(b.name);
        } else {
          const idA = parseInt(a.url.split("/").filter(Boolean).pop() || "0");
          const idB = parseInt(b.url.split("/").filter(Boolean).pop() || "0");
          comp = idA - idB;
        }
        return sortDir === "asc" ? comp : -comp;
      });
  }, [raw, q, sortKey, sortDir]);


  useEffect(() => {
    const ids = filtered.map((p) =>
      parseInt(p.url.split("/").filter(Boolean).pop() || "0")
    );
    saveListOrder(ids);
  }, [filtered]);


  return (
    <div className="centered">

      <ControlPanel
        q={q}
        setQ={setQ}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDir={sortDir}
        setSortDir={setSortDir}
      />


      {loading && <div>Loading Pokémon…</div>}
      {err && (
        <div className="border border-red-300 bg-red-50 p-2 rounded">{err}</div>
      )}


      <ul className="list mt-4 space-y-2">
        {filtered.map((p) => {
          const id = p.url.split("/").filter(Boolean).pop();
          return (
            <li key={p.name} className="border rounded p-2">
              <Link to={`/detail/${id}`}>{p.name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
