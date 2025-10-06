// src/pages/GalleryView.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { PokemonListItem, PokemonListResponse, Pokemon } from "../types/pokemon";

type Card = {
  id: number;
  name: string;
  img?: string;
  types: string[];
};

export default function GalleryView() {
  const [cards, setCards] = useState<Card[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); 
      try {
        // 1) list → take first N (keep it quick)
        const list = await api.get<PokemonListResponse>("/pokemon?limit=200");
        const items: PokemonListItem[] = list.data.results;

        // 2) fetch each pokemon details (for image + types)
        setLoading(true); setErr(null);

        const details = await Promise.all(
          items.map(async (p) => {
            const id = parseInt(p.url.split("/").filter(Boolean).pop() || "0");
            const res = await api.get<Pokemon>(`/pokemon/${id}`);
            const d = res.data;
            return {
              id: d.id,
              name: d.name,
              img: d.sprites?.front_default,
              types: (d.types || []).map((t) => t.type.name),
            } as Card;
          })
        );

        if (cancelled) return;

        setCards(details);

        // collect unique types for filters
        const typesSet = new Set<string>();
        details.forEach((c) => c.types.forEach((t) => typesSet.add(t)));
        setAllTypes(Array.from(typesSet).sort());
      } catch (e) {
        if (!cancelled) setErr("Failed to load gallery data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (selected.size === 0) return cards;
    return cards.filter((c) => {
      // require the card to include ALL selected types
      for (const t of selected) if (!c.types.includes(t)) return false;
      return true;
    });
  }, [cards, selected]);

  const toggleType = (t: string) => {
    const next = new Set(selected);
    next.has(t) ? next.delete(t) : next.add(t);
    setSelected(next);
  };
  {loading && <div>Loading…</div>}
  {err && <div className="border border-red-300 bg-red-50 p-2 rounded">{err}</div>}
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Gallery</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allTypes.map((t) => (
          <label key={t} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.has(t)}
              onChange={() => toggleType(t)}
            />
            <span className="capitalize">{t}</span>
          </label>
        ))}
        {allTypes.length > 0 && (
          <button
            className="ml-2 border rounded px-3 py-1"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </button>
        )}
      </div>

      {loading && <div>Loading…</div>}

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {filtered.map((c) => (
          <Link
            key={c.id}
            to={`/detail/${c.id}`}
            className="border rounded-xl p-3 text-center hover:shadow"
          >
            {c.img ? (
              <img src={c.img} alt={c.name} className="mx-auto mb-2" width={96} height={96} />
            ) : (
              <div className="h-[96px] flex items-center justify-center text-sm text-gray-500">
                No image
              </div>
            )}
            <div className="font-medium capitalize">{c.name}</div>
            <div className="text-xs text-gray-600 capitalize">{c.types.join(", ")}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
