# ⛳ Cincy Golf Finder

A deployable full-stack web application for discovering golf courses within a
50-mile radius of Cincinnati, Ohio.

- **Backend:** Java 21 + Spring Boot 3 REST API
- **Frontend:** React 18 (Vite) + Leaflet / OpenStreetMap
- **Data:** Curated dataset of ~40 real Cincinnati-area courses (Ohio munis,
  Great Parks courses, Northern Kentucky, daily-fee clubs, and notable private
  clubs) bundled as JSON

## Features

- **Radius search** from downtown Cincinnati (5–50 miles, Haversine distance)
- **Searchable filters:** free-text search (name, city, designer), difficulty
  (beginner → expert), price level ($–$$$$), course type
  (public / semi-private / private), and number of holes
- **Sorting** by distance, name, price, or difficulty
- **Interactive map** with course markers, popups, and a radius overlay that
  stays in sync with the filters; clicking a course card pans the map to it
- **Booking links** on every card — direct tee-time links where available,
  a tee-time search fallback otherwise — plus website and driving-directions
  links
- Rich course details: par, yardage, slope, green-fee range, designer,
  year opened, and amenities

## Project layout

```
golf-course-finder/
├── backend/    # Spring Boot API (serves the built frontend in production)
│   └── src/main/resources/data/courses.json   # the course dataset
├── frontend/   # React + Vite app
└── Dockerfile  # multi-stage build → single runnable image
```

## API

| Endpoint | Description |
|---|---|
| `GET /api/courses` | Search courses. Params: `q`, `radius` (miles, default 50), `difficulty` (repeatable: `BEGINNER`/`MODERATE`/`CHALLENGING`/`EXPERT`), `price` (repeatable: 1–4), `type` (repeatable: `PUBLIC`/`SEMI_PRIVATE`/`PRIVATE`), `minHoles`, `sort` (`DISTANCE`/`NAME`/`PRICE_ASC`/`PRICE_DESC`/`DIFFICULTY`) |
| `GET /api/courses/{id}` | Single course with distance |
| `GET /api/meta` | Filter option metadata (difficulty/price/type labels, map center) |

Example:

```
GET /api/courses?radius=20&difficulty=CHALLENGING&price=2&price=3&type=PUBLIC&sort=PRICE_ASC
```

## Running locally (development)

Two terminals:

```bash
# Terminal 1 — API on :8080
cd backend
mvn spring-boot:run

# Terminal 2 — React dev server on :5173 (proxies /api to :8080)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Building for production (single JAR)

The Vite build outputs directly into the backend's `static/` resources, so the
Spring Boot JAR serves the whole app:

```bash
cd frontend && npm install && npm run build
cd ../backend && mvn package
java -jar target/golf-course-finder-1.0.0.jar
```

Open http://localhost:8080. The port can be overridden with the `PORT`
environment variable (handy on Heroku/Render).

## Deploying

**Docker** (works on any container host — Render, Fly.io, Railway, AWS, etc.):

```bash
docker build -t cincy-golf-finder .
docker run -p 8080:8080 cincy-golf-finder
```

**Plain JAR:** build as above and run `java -jar` on any host with Java 21.

## Tests

```bash
cd backend && mvn test
```

Covers the Haversine distance math and the search/filter/sort behavior of the
service layer.

## Data notes

The course dataset (`backend/src/main/resources/data/courses.json`) is a
curated snapshot: coordinates are approximate, and green fees, slope ratings,
difficulty categories, and links are best-effort and change over time. Verify
rates and tee-time availability with each course. To add or correct a course,
edit the JSON — no code changes needed.
