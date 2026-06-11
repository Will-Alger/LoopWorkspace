const FALLBACK_DIFFICULTIES = [
  { value: 'BEGINNER', label: 'Beginner friendly' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'CHALLENGING', label: 'Challenging' },
  { value: 'EXPERT', label: 'Expert' },
];

const FALLBACK_TYPES = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'SEMI_PRIVATE', label: 'Semi-private' },
  { value: 'PRIVATE', label: 'Private' },
];

const FALLBACK_PRICES = [
  { value: 1, label: '$ — under $30' },
  { value: 2, label: '$$ — $30–50' },
  { value: 3, label: '$$$ — $50–80' },
  { value: 4, label: '$$$$ — $80+ / private' },
];

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FiltersPanel({ filters, meta, onChange, onReset }) {
  const difficulties = meta?.difficulties ?? FALLBACK_DIFFICULTIES;
  const types = meta?.types ?? FALLBACK_TYPES;
  const prices = meta?.priceLevels ?? FALLBACK_PRICES;
  const maxRadius = meta?.maxRadiusMiles ?? 50;

  return (
    <div className="filters">
      <div className="filters-title">
        <h2>Filters</h2>
        <button type="button" className="reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Course name, city, designer…"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="radius">
          Distance from downtown: <strong>{filters.radius} mi</strong>
        </label>
        <input
          id="radius"
          type="range"
          min="5"
          max={maxRadius}
          step="5"
          value={filters.radius}
          onChange={(e) => onChange({ radius: Number(e.target.value) })}
        />
      </div>

      <fieldset className="filter-group">
        <legend>Difficulty</legend>
        {difficulties.map((d) => (
          <label key={d.value} className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.difficulties.includes(d.value)}
              onChange={() =>
                onChange({ difficulties: toggle(filters.difficulties, d.value) })
              }
            />
            {d.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Price (18 holes w/ cart)</legend>
        {prices.map((p) => (
          <label key={p.value} className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.priceLevels.includes(p.value)}
              onChange={() =>
                onChange({ priceLevels: toggle(filters.priceLevels, p.value) })
              }
            />
            {p.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Course type</legend>
        {types.map((t) => (
          <label key={t.value} className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.types.includes(t.value)}
              onChange={() => onChange({ types: toggle(filters.types, t.value) })}
            />
            {t.label}
          </label>
        ))}
      </fieldset>

      <div className="filter-group">
        <label htmlFor="minHoles">Holes</label>
        <select
          id="minHoles"
          value={filters.minHoles ?? ''}
          onChange={(e) =>
            onChange({ minHoles: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">Any</option>
          <option value="9">9+ holes</option>
          <option value="18">18+ holes</option>
          <option value="27">27+ holes</option>
        </select>
      </div>
    </div>
  );
}
