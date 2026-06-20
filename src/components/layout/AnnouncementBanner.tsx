const MESSAGE =
  'Moskeen er midlertidig stengt mens vi flytter til nye lokaler. Vi åpner igjen i august, insha’Allah.';

function Segment() {
  return (
    <span className="announcement-segment" aria-hidden="true">
      {MESSAGE}
      <span className="announcement-dot">✦</span>
    </span>
  );
}

function Group() {
  return (
    <div className="announcement-group">
      {Array.from({ length: 4 }).map((_, i) => (
        <Segment key={i} />
      ))}
    </div>
  );
}

export function AnnouncementBanner() {
  return (
    <div className="announcement-banner" role="note" aria-label={MESSAGE}>
      {/* Single, static copy for screen readers and reduced-motion users */}
      <span className="sr-only">{MESSAGE}</span>
      <div className="announcement-track" aria-hidden="true">
        <Group />
        <Group />
      </div>
    </div>
  );
}
