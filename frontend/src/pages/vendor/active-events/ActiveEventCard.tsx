import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ChevronRight, Clock } from 'lucide-react';
import { ActiveEvent, ActiveEventStatus, formatDateRange, getDaysUntil } from '../../../mockData/activeEventsData';

interface Props { event: ActiveEvent; }

type StatusConfig = { cls: string; label: string };
const STATUS_MAP: Record<ActiveEventStatus, StatusConfig> = {
    PREPARATION: { cls: 'preparation', label: 'Preparation' },
    IN_PROGRESS: { cls: 'in_progress', label: 'In Progress' },
    NEAR_COMPLETION: { cls: 'near_completion', label: 'Near Completion' },
};

const ActiveEventCard = ({ event }: Props) => {
    const { cls, label } = STATUS_MAP[event.status];
    const dateRange = formatDateRange(event.startDate, event.endDate);
    const daysUntil = getDaysUntil(event.startDate);

    let countdownLabel: string;
    let countdownCls = '';
    if (event.status === 'IN_PROGRESS') {
        countdownLabel = '● Live now';
        countdownCls = 'soon';
    } else if (daysUntil < 0) {
        countdownLabel = 'Underway';
    } else if (daysUntil === 0) {
        countdownLabel = '🔴 Starts today';
        countdownCls = 'urgent';
    } else if (daysUntil <= 7) {
        countdownLabel = `⚡ ${daysUntil}d away`;
        countdownCls = 'urgent';
    } else {
        countdownLabel = `${daysUntil} days until start`;
    }

    return (
        <div className={`ae-card ${cls}`}>
            {/* ── Left ── */}
            <div className="ae-card-left">
                <div className="ae-card-top">
                    <span className="ae-event-code">{event.eventCode}</span>
                    <span className={`ae-badge ${cls}`}>{label}</span>
                    <span className="ae-badge type">{event.type}</span>
                </div>

                <div className="ae-event-name">{event.name}</div>

                <div className="ae-card-meta">
                    <div className="ae-meta-item"><Calendar size={13} /> {dateRange}</div>
                    <div className="ae-meta-item"><MapPin size={13} /> {event.location}</div>
                    <div className="ae-meta-item"><Users size={13} /> {event.attendees.toLocaleString()} attendees</div>
                </div>

                <div className="ae-client-name">Client: {event.clientName}</div>
            </div>

            {/* ── Right ── */}
            <div className="ae-card-right">
                {/* Big pct */}
                <div className="ae-progress-pct">
                    {event.progressPct}<span>%</span>
                </div>

                {/* Progress bar */}
                <div className="ae-progress-track" style={{ width: '100%' }}>
                    <div
                        className={`ae-progress-fill ${cls}`}
                        style={{ width: `${event.progressPct}%` }}
                    />
                </div>

                {/* Countdown */}
                <div className={`ae-countdown ${countdownCls}`}>
                    <Clock size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                    {countdownLabel}
                </div>

                {/* Detail link */}
                <Link to={`/vendor/active-events/${event.id}`} className="ae-btn-detail">
                    View Details <ChevronRight size={13} />
                </Link>
            </div>
        </div>
    );
};

export default ActiveEventCard;
