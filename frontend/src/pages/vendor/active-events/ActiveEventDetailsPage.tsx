import { Link, useParams, Navigate } from 'react-router-dom';
import {
    ChevronLeft, MapPin, Calendar, Users, TrendingUp,
    Package, Download, CheckCircle, Circle,
} from 'lucide-react';
import {
    MOCK_ACTIVE_EVENTS, ActiveEventStatus, formatDateRange, getDaysUntil,
} from '../../../mockData/activeEventsData';
import '../../../styles/ActiveEvents.css';
import '../../../styles/VendorLayout.css';
import '../../../styles/VendorAnalytics.css';

type StatusConfig = { cls: string; label: string };
const STATUS_MAP: Record<ActiveEventStatus, StatusConfig> = {
    PREPARATION: { cls: 'preparation', label: 'Preparation' },
    IN_PROGRESS: { cls: 'in_progress', label: 'In Progress' },
    NEAR_COMPLETION: { cls: 'near_completion', label: 'Near Completion' },
};

const ActiveEventDetailsPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const event = MOCK_ACTIVE_EVENTS.find(e => e.id === eventId);
    if (!event) return <Navigate to="/vendor/active-events" replace />;

    const { cls, label } = STATUS_MAP[event.status];
    const dateRange = formatDateRange(event.startDate, event.endDate);
    const daysToStart = getDaysUntil(event.startDate);
    const daysToEnd = getDaysUntil(event.endDate);

    const totalAlloc = event.inventoryItems.reduce((s, i) => s + i.allocatedQty, 0);
    const totalConfirmed = event.inventoryItems.reduce((s, i) => s + i.confirmedQty, 0);
    const confirmPct = totalAlloc > 0 ? Math.round((totalConfirmed / totalAlloc) * 100) : 0;

    return (
        <div>
            {/* ── Topbar ──────────────────────────────────────────────── */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <Link to="/vendor/active-events" className="ea-detail-back">
                        <ChevronLeft size={14} /> Back to Active Events
                    </Link>
                    <h1 style={{ marginTop: '0.5rem' }}>{event.name}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className={`ae-badge ${cls}`}>{label}</span>
                        <span className="ae-badge type">{event.type}</span>
                        <span style={{ fontSize: '0.75rem', color: '#525252' }}>{event.eventCode}</span>
                    </div>
                </div>
                <div className="vl-topbar-actions">
                    <button className="ea-download-btn">
                        <Download size={15} /> Download Report
                    </button>
                </div>
            </div>

            <div className="ae-content">
                {/* ── KPI grid ────────────────────────────────────────── */}
                <div className="ae-detail-grid">
                    {[
                        {
                            label: 'Overall Progress',
                            value: `${event.progressPct}%`,
                            gold: true,
                            icon: <TrendingUp size={18} />,
                        },
                        {
                            label: 'Revenue',
                            value: `₹${event.revenueLakh}L`,
                            gold: true,
                            icon: <TrendingUp size={18} />,
                        },
                        {
                            label: 'Attendees',
                            value: event.attendees.toLocaleString(),
                            icon: <Users size={18} />,
                        },
                        {
                            label: 'Inventory Confirmed',
                            value: `${confirmPct}%`,
                            gold: confirmPct >= 80,
                            icon: <Package size={18} />,
                        },
                        {
                            label: event.status === 'IN_PROGRESS' ? 'Event Ends In' : 'Starts In',
                            value: event.status === 'IN_PROGRESS'
                                ? (daysToEnd >= 0 ? `${daysToEnd}d` : 'Today')
                                : (daysToStart > 0 ? `${daysToStart}d` : 'Underway'),
                            icon: <Calendar size={18} />,
                        },
                        {
                            label: 'Client',
                            value: event.clientName,
                            small: true,
                            icon: <Users size={18} />,
                        },
                    ].map(c => (
                        <div className="ae-detail-card" key={c.label}>
                            <div className="ae-detail-stat-label">{c.label}</div>
                            <div className={`ae-detail-stat-value${c.gold ? ' gold' : ''}${c.small ? ' small' : ''}`}>
                                {c.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Progress + info ─────────────────────────────────── */}
                <div className="va-chart-card">
                    <p className="va-chart-title" style={{ marginBottom: '1.25rem' }}>Event Overview</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Progress bar */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.78rem', color: '#B5B5B5' }}>Completion Progress</span>
                                <span style={{ fontSize: '0.78rem', color: '#C6A75E', fontWeight: 700 }}>{event.progressPct}%</span>
                            </div>
                            <div className="ae-progress-track">
                                <div className={`ae-progress-fill ${cls}`} style={{ width: `${event.progressPct}%` }} />
                            </div>
                        </div>

                        {/* Meta grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                            {[
                                { icon: <Calendar size={14} />, label: 'Date Range', value: dateRange },
                                { icon: <MapPin size={14} />, label: 'Location', value: event.location },
                                { icon: <Users size={14} />, label: 'Client', value: event.clientName },
                            ].map(f => (
                                <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#525252', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                        {f.icon} {f.label}
                                    </div>
                                    <div style={{ fontSize: '0.88rem', color: '#FFFFFF', fontWeight: 500 }}>{f.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Notes */}
                        {event.notes && (
                            <div style={{ padding: '0.85rem 1rem', background: 'rgba(198,167,94,0.05)', border: '1px solid rgba(198,167,94,0.12)', borderRadius: '8px', fontSize: '0.82rem', color: '#B5B5B5' }}>
                                📝 {event.notes}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Two-column: Timeline + Vendors ──────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    {/* Timeline */}
                    <div className="va-chart-card">
                        <p className="va-chart-title" style={{ marginBottom: '1.25rem' }}>Event Timeline</p>
                        <div className="ae-timeline">
                            {event.milestones.map((m, i) => (
                                <div className="ae-timeline-row" key={i}>
                                    <div className={`ae-timeline-dot${m.done ? ' done' : ''}`} />
                                    <span className={`ae-timeline-label${m.done ? ' done' : ''}`}>{m.label}</span>
                                    <span className="ae-timeline-date">
                                        {new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </span>
                                    {m.done && <CheckCircle size={13} style={{ color: '#C6A75E', flexShrink: 0 }} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vendors */}
                    <div className="va-chart-card">
                        <p className="va-chart-title" style={{ marginBottom: '1.25rem' }}>Assigned Vendors ({event.vendorsAssigned.length})</p>
                        <div className="ae-vendor-chips">
                            {event.vendorsAssigned.map(v => (
                                <div className="ae-vendor-chip" key={v}>{v}</div>
                            ))}
                        </div>

                        <p className="va-chart-title" style={{ margin: '1.5rem 0 1rem' }}>Revenue Snapshot</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {[
                                { label: 'Total Contract Value', value: `₹${event.revenueLakh}L`, gold: true },
                                { label: 'Attendees', value: event.attendees.toLocaleString() },
                                { label: 'Rev per Attendee', value: `₹${Math.round((event.revenueLakh * 100000) / event.attendees).toLocaleString('en-IN')}` },
                            ].map(r => (
                                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem' }}>
                                    <span style={{ color: '#B5B5B5' }}>{r.label}</span>
                                    <span style={{ color: r.gold ? '#C6A75E' : '#FFFFFF', fontWeight: 600 }}>{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Inventory allocation table ───────────────────────── */}
                {event.inventoryItems.length > 0 && (
                    <div className="va-chart-card">
                        <p className="va-chart-title" style={{ marginBottom: '1.25rem' }}>
                            Inventory Allocation ({event.inventoryItems.length} items · {confirmPct}% confirmed)
                        </p>
                        {event.inventoryItems.map(item => {
                            const pct = Math.round((item.confirmedQty / Math.max(item.allocatedQty, 1)) * 100);
                            return (
                                <div className="ae-inv-row" key={item.itemName}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                        <strong>{item.itemName}</strong>
                                        <span style={{ fontSize: '0.7rem', color: '#525252' }}>{item.category.replace('_', ' ')}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.78rem', color: '#B5B5B5' }}>
                                                Allocated: <strong style={{ color: '#FFFFFF' }}>{item.allocatedQty}</strong>
                                            </div>
                                            <div className="ae-inv-confirmed">
                                                {item.confirmedQty === item.allocatedQty
                                                    ? <><CheckCircle size={10} style={{ display: 'inline', marginRight: 2 }} />Confirmed</>
                                                    : <><Circle size={10} style={{ display: 'inline', marginRight: 2 }} />{pct}% confirmed</>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveEventDetailsPage;
