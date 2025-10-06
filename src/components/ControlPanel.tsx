import "./ControlPanel.css";

type Props = {
  q: string;
  setQ: (v: string) => void;
  sortKey: "name" | "id";
  setSortKey: (v: "name" | "id") => void;
  sortDir: "asc" | "desc";
  setSortDir: (v: "asc" | "desc") => void;
};

export default function ControlPanel({ q, setQ, sortKey, setSortKey, sortDir, setSortDir }: Props) {
  return (
    <section className="panel" aria-label="Search and sort">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Pokémon…"
        className="input"
      />

      <label className="label">Sort by</label>
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as "name" | "id")}
        className="select"
      >
        <option value="name">Name</option>
        <option value="id">ID</option>
      </select>

      <div className="radios" role="group" aria-label="Sort direction">
        <label className="radio">
          <input
            type="radio"
            checked={sortDir === "asc"}
            onChange={() => setSortDir("asc")}
          />
          <span>ascending</span>
        </label>
        <label className="radio">
          <input
            type="radio"
            checked={sortDir === "desc"}
            onChange={() => setSortDir("desc")}
          />
          <span>descending</span>
        </label>
      </div>
    </section>
  );
}
