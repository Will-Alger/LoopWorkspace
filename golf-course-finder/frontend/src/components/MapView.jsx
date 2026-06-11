import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { bookingHref } from './CourseCard.jsx';

const MILES_TO_METERS = 1609.34;

function courseIcon(selected) {
  return L.divIcon({
    className: 'course-marker',
    html: `<div class="marker-pin${selected ? ' marker-selected' : ''}"><span>⛳</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });
}

function popupHtml(result) {
  const { course, distanceMiles } = result;
  const booking = bookingHref(course);
  const fees =
    course.greenFeeMin != null && course.greenFeeMax != null
      ? ` · $${course.greenFeeMin}–$${course.greenFeeMax}`
      : '';
  const link = booking
    ? `<a href="${booking}" target="_blank" rel="noopener noreferrer">Book a tee time →</a>`
    : '<em>Private club</em>';
  return `
    <strong>${course.name}</strong><br/>
    ${course.holes} holes · ${distanceMiles} mi from downtown${fees}<br/>
    ${link}
  `;
}

export default function MapView({ center, radiusMiles, results, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const circleRef = useRef(null);

  useEffect(() => {
    const map = L.map(containerRef.current).setView(
      [center.latitude, center.longitude],
      10,
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([center.latitude, center.longitude], {
      icon: L.divIcon({
        className: 'center-marker',
        html: '<div class="marker-center">📍</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 26],
      }),
    })
      .addTo(map)
      .bindTooltip('Downtown Cincinnati');

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; center never changes after meta loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Radius circle follows the slider.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (circleRef.current) circleRef.current.remove();
    circleRef.current = L.circle([center.latitude, center.longitude], {
      radius: radiusMiles * MILES_TO_METERS,
      color: '#2e7d32',
      weight: 1.5,
      fillColor: '#2e7d32',
      fillOpacity: 0.05,
    }).addTo(map);
  }, [center, radiusMiles]);

  // Markers follow the filtered results.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    results.forEach((r) => {
      const marker = L.marker([r.course.latitude, r.course.longitude], {
        icon: courseIcon(r.course.id === selectedId),
      })
        .addTo(map)
        .bindPopup(popupHtml(r));
      marker.on('click', () => onSelect(r.course.id));
      markersRef.current.set(r.course.id, marker);
    });
  }, [results, selectedId, onSelect]);

  // Pan to the selected course when a card is clicked.
  useEffect(() => {
    const map = mapRef.current;
    const marker = selectedId ? markersRef.current.get(selectedId) : null;
    if (map && marker) {
      map.panTo(marker.getLatLng());
      marker.openPopup();
    }
  }, [selectedId]);

  return <div className="map-container" ref={containerRef} />;
}
