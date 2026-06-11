const DIFFICULTY_LABELS = {
  BEGINNER: 'Beginner friendly',
  MODERATE: 'Moderate',
  CHALLENGING: 'Challenging',
  EXPERT: 'Expert',
};

const TYPE_LABELS = {
  PUBLIC: 'Public',
  SEMI_PRIVATE: 'Semi-private',
  PRIVATE: 'Private',
};

function formatAmenity(a) {
  return a.replaceAll('_', ' ');
}

export function bookingHref(course) {
  if (course.bookingUrl) return course.bookingUrl;
  if (course.type === 'PRIVATE') return null;
  const q = encodeURIComponent(`${course.name} ${course.city} ${course.state} tee times`);
  return `https://www.google.com/search?q=${q}`;
}

export default function CourseCard({ result, selected, onSelect }) {
  const { course, distanceMiles } = result;
  const fees =
    course.greenFeeMin != null && course.greenFeeMax != null
      ? `$${course.greenFeeMin}–$${course.greenFeeMax}`
      : null;
  const booking = bookingHref(course);

  return (
    <article
      className={`course-card${selected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <div className="card-top">
        <h3>{course.name}</h3>
        <span className="price-badge">{'$'.repeat(course.priceLevel)}</span>
      </div>

      <p className="card-location">
        {course.address}, {course.city}, {course.state} · {distanceMiles} mi away
      </p>

      <div className="badge-row">
        <span className={`badge difficulty-${course.difficulty.toLowerCase()}`}>
          {DIFFICULTY_LABELS[course.difficulty]}
        </span>
        <span className="badge type-badge">{TYPE_LABELS[course.type]}</span>
        <span className="badge">{course.holes} holes</span>
        {course.par && <span className="badge">Par {course.par}</span>}
        {course.slope && <span className="badge">Slope {course.slope}</span>}
      </div>

      {course.description && <p className="card-description">{course.description}</p>}

      <dl className="card-facts">
        {course.yardage && (
          <div>
            <dt>Yardage</dt>
            <dd>{course.yardage.toLocaleString()} yds</dd>
          </div>
        )}
        {fees && (
          <div>
            <dt>Green fees</dt>
            <dd>{fees}</dd>
          </div>
        )}
        {course.designer && (
          <div>
            <dt>Designer</dt>
            <dd>{course.designer}</dd>
          </div>
        )}
        {course.yearOpened && (
          <div>
            <dt>Opened</dt>
            <dd>{course.yearOpened}</dd>
          </div>
        )}
      </dl>

      {course.amenities?.length > 0 && (
        <p className="card-amenities">{course.amenities.map(formatAmenity).join(' · ')}</p>
      )}

      <div className="card-actions">
        {booking ? (
          <a
            className="btn btn-primary"
            href={booking}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Book a tee time
          </a>
        ) : (
          <span className="private-note">Private club — membership required</span>
        )}
        {course.website && (
          <a
            className="btn btn-secondary"
            href={course.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Website
          </a>
        )}
        <a
          className="btn btn-secondary"
          href={`https://www.google.com/maps/dir/?api=1&destination=${course.latitude},${course.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Directions
        </a>
      </div>
    </article>
  );
}
