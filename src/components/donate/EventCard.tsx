import type { CommunityEvent } from '@/types/event';
import Badge from '@/components/ui/Badge';

interface EventCardProps {
  event: CommunityEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const isYouthEvent = event.category === 'youth';

  return (
    <div className="relative rounded-lg overflow-hidden h-64 bg-[var(--color-surface)] cursor-pointer bento-card">
      {/* Background - conditional based on event type */}
      {isYouthEvent ? (
        <>
          <img
            src={event.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKqwdOCnGwhZ73w8VV-wYPTcY08buhvxAJDy9S2i6YlpISEqqf5FKAVsk5YzTCaHiWCb0wUP8VyyqW4NQb9yOjIa8CwFZ-ipJj53hfeOcYvFfQjda9CF5HR9Sepqf182Jo1OT1E8iCn80Yi7qL4Jb54gt7eac9yHtUQbATs4Tnd1o6OlFoCqEmNs4UdlIaSUTxJrlhwrLgJEb1rbVL3iaoKPR9Y0xBNL5rEwBodgvXVf1K-ZN-tf3BVcPmnOpAHsyw7G1PNop9k'}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent"></div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
          <span className="material-icons absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 pointer-events-none" style={{ fontSize: '8rem' }}>
            mic
          </span>
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div>
          <Badge variant={event.category === 'youth' ? 'youth' : event.category === 'halaqa' ? 'halaqa' : 'community'}>
            {event.category === 'youth' ? 'YOUTH' : event.category === 'halaqa' ? 'HALAQA' : 'COMMUNITY'}
          </Badge>
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            {event.description}
          </p>
          <div className="flex items-center gap-3 text-xs font-mono text-primary">
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">calendar_today</span>
              {event.day}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">schedule</span>
              {event.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
