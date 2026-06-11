import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCourses, fetchMeta } from './api.js';
import FiltersPanel from './components/FiltersPanel.jsx';
import CourseCard from './components/CourseCard.jsx';
import MapView from './components/MapView.jsx';

const DEFAULT_FILTERS = {
  q: '',
  radius: 30,
  difficulties: [],
  priceLevels: [],
  types: [],
  minHoles: null,
  sort: 'DISTANCE',
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [meta, setMeta] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchMeta().then(setMeta).catch(() => setMeta(null));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    // Debounce so typing in the search box doesn't fire a request per keystroke.
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetchCourses(filters, controller.signal)
        .then((data) => {
          setResults(data);
          setError(null);
        })
        .catch((e) => {
          if (e.name !== 'AbortError') setError(e.message);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [filters]);

  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const center = meta?.center ?? { latitude: 39.1031, longitude: -84.512 };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1>
            <span className="flag">⛳</span> Cincy Golf Finder
          </h1>
          <p>
            Explore {results.length} golf course{results.length === 1 ? '' : 's'} within{' '}
            {filters.radius} miles of downtown Cincinnati
          </p>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <FiltersPanel
            filters={filters}
            meta={meta}
            onChange={updateFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        <section className="content">
          <MapView
            center={center}
            radiusMiles={filters.radius}
            results={results}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {error && <div className="error-banner">⚠️ {error}</div>}

          <div className="results-header">
            <h2>{loading ? 'Searching…' : `${results.length} courses found`}</h2>
            <label className="sort-control">
              Sort by{' '}
              <select
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
              >
                <option value="DISTANCE">Distance</option>
                <option value="NAME">Name</option>
                <option value="PRICE_ASC">Price (low → high)</option>
                <option value="PRICE_DESC">Price (high → low)</option>
                <option value="DIFFICULTY">Difficulty</option>
              </select>
            </label>
          </div>

          <div className="course-grid">
            {results.map((r) => (
              <CourseCard
                key={r.course.id}
                result={r}
                selected={r.course.id === selectedId}
                onSelect={() => setSelectedId(r.course.id)}
              />
            ))}
          </div>

          {!loading && results.length === 0 && !error && (
            <div className="empty-state">
              No courses match your filters. Try widening the radius or clearing a filter.
            </div>
          )}

          <footer className="footer">
            Course data is a curated snapshot — please verify rates, hours, and tee-time
            availability with each course before you go.
          </footer>
        </section>
      </main>
    </div>
  );
}
