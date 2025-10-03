// src/pages/ListView.tsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { PokemonListItem, PokemonListResponse } from "../types/pokemon";

export default function ListView() {
  const [raw, setRaw] = useState<PokemonListItem[]>([]);
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "id">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    api.get<PokemonListResponse>("/pokemon?limit=200")
      .then(res => setRaw(res.data.results))
      .catch(() => setRaw([])); // you can add a nicer error later
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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Pokémon…"
        className="w-full p-2 border rounded"
      />
      
      <div className="flex gap-2 mt-2">
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as "name" | "id")}
          className="border rounded px-2 py-1"
        >
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
        <button
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          className="border rounded px-3 py-1"
        >
          {sortDir === "asc" ? "⬆ Ascending" : "⬇ Descending"}
        </button>
      </div>
      
      <ul className="mt-4 space-y-2">
        {filtered.map((p) => {
          const id = p.url.split("/").filter(Boolean).pop(); // quick id parse
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
