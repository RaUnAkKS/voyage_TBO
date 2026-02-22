import { Link } from 'react-router-dom';
import { MapPin, Calendar, Package, CheckCircle, XCircle, Archive, ChevronRight } from 'lucide-react';
import { ArchivedEvent, formatDateRange } from '../../../mockData/archiveData';

interface Props { event: ArchivedEvent; }

const STATUS_MAP: Record<ArchivedEvent['status'], { cls: string; icon: React.ReactElement; label: string }> = {
    COMPLETED: { cls: 'completed', icon: <CheckCircle size={10} />, label: 'Completed' },
    CANCELLED: { cls: 'cancelled', icon: <XCircle size={10} />, label: 'Cancelled' },
    ARCHIVED: { cls: 'archived', icon: <Archive size={10} />, label: 'Archived' },
};

const StatusBadge = ({ status }: { status: ArchivedEvent['status'] }) => {
    const { cls, icon, label } = STATUS_MAP[status];
    return <span className={`ea-badge ${cls}`}>{icon} {label}</span>;
};

const ArchiveEventCard = ({ event }: Props) => {
    const dateRange = formatDateRange(event.startDate, event.endDate);
    const isCancelled = event.status === 'CANCELLED';

    return (
        <div className={`ea-card ${isCancelled ? 'cancelled' : ''}`}>
            {/* ── Left side ── */}
            <div className="ea-card-left">
                <div className="ea-card-top">
                    <span className="ea-event-code">{event.eventCode}</span>
                    <StatusBadge status={event.status} />
                    <span className="ea-badge type">{event.type}</span>
                </div>

                <div className="ea-event-name">{event.name}</div>

                <div className="ea-card-meta">
                    <div className="ea-meta-item">
                        <Calendar size={13} />
                        {dateRange}
                    </div>
                    <div className="ea-meta-item">
                        <MapPin size={13} />
                        {event.location}
                    </div>
                    {event.totalAllocatedUnits > 0 && (
                        <div className="ea-meta-item">
                            <Package size={13} />
                            {event.totalAllocatedUnits.toLocaleString()} units allocated
                        </div>
                    )}
                </div>

                <div className="ea-client-name">Client: {event.clientName}</div>

                {event.usedCategories.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                        {event.usedCategories.map((c: string) => (
                            <span key={c} style={{
                                fontSize: '0.65rem', padding: '0.15rem 0.45rem',
                                borderRadius: '4px', background: 'rgba(255,255,255,0.04)',
                                color: '#525252', border: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                {c.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Right side ── */}
            <div className="ea-card-right">
                <div className={`ea-revenue ${event.revenueLakh === 0 ? 'zero' : ''}`}>
                    {event.revenueLakh > 0 ? `₹${event.revenueLakh}L` : '—'}
                </div>

                <div className="ea-card-badges">
                    {event.inventoryReleased
                        ? <span className="ea-badge released"><CheckCircle size={10} /> Inventory Released</span>
                        : <span className="ea-badge held"><XCircle size={10} /> Inventory Held</span>}
                </div>

                <Link
                    to={`/vendor/archive/${event.id}`}
                    className="ea-btn-detail"
                >
                    View Details <ChevronRight size={13} />
                </Link>
            </div>
        </div>
    );
};

export default ArchiveEventCard;
