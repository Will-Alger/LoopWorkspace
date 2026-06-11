function buildQuery(filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  params.set('radius', String(filters.radius));
  filters.difficulties.forEach((d) => params.append('difficulty', d));
  filters.priceLevels.forEach((p) => params.append('price', String(p)));
  filters.types.forEach((t) => params.append('type', t));
  if (filters.minHoles) params.set('minHoles', String(filters.minHoles));
  params.set('sort', filters.sort);
  return params.toString();
}

export async function fetchCourses(filters, signal) {
  const res = await fetch(`/api/courses?${buildQuery(filters)}`, { signal });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  return res.json();
}

export async function fetchMeta() {
  const res = await fetch('/api/meta');
  if (!res.ok) throw new Error(`Failed to load filter options (${res.status})`);
  return res.json();
}
