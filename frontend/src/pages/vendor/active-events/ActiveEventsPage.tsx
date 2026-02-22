import { useState, useMemo } from 'react';
import { Activity, Download } from 'lucide-react';
import {
    MOCK_ACTIVE_EVENTS, filterActiveEvents,
    ActiveEventStatus,
} from '../../../mockData/activeEventsData';
import { EventType } from '../../../mockData/inventoryData';
import ActiveEventFilters from './ActiveEventFilters';
import ActiveEventCard from './ActiveEventCard';
import '../../../styles/ActiveEvents.css';
import '../../../styles/VendorLayout.css';

const ActiveEventsPage = () => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<EventType | 'ALL'>('ALL');
    const [status, setStatus] = useState<ActiveEventStatus | 'ALL'>('ALL');

    const filtered = useMemo(
        () => filterActiveEvents(MOCK_ACTIVE_EVENTS, query, type, status),
        [query, type, status],
    );

    // Summary stats
    const inProgressCount = MOCK_ACTIVE_EVENTS.filter(e => e.status === 'IN_PROGRESS').length;
    const nearDoneCount = MOCK_ACTIVE_EVENTS.filter(e => e.status === 'NEAR_COMPLETION').length;
    const totalRevenue = MOCK_ACTIVE_EVENTS.reduce((s, e) => s + e.revenueLakh, 0).toFixed(1);
    const avgProgress = Math.round(MOCK_ACTIVE_EVENTS.reduce((s, e) => s + e.progressPct, 0) / MOCK_ACTIVE_EVENTS.length);

    return (
        <div>
            {/* ── Topbar ─────────────────────────────────── */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <h1>Active Events</h1>
                    <p>Manage ongoing events, track progress, and coordinate execution.</p>
                </div>
                <div className="vl-topbar-actions">
                    <button className="va-btn-export">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* ── Summary strip ──────────────────────────── */}
            <div className="ae-summary-strip">
                {[
                    { label: 'Total Active', value: MOCK_ACTIVE_EVENTS.length },
                    { label: 'Live Now', value: inProgressCount },
                    { label: 'Near Completion', value: nearDoneCount },
                    { label: 'Avg Progress', value: `${avgProgress}%` },
                    { label: 'Revenue Pipeline', value: `₹${totalRevenue}L`, gold: true },
                ].map(s => (
                    <div className="ae-summary-item" key={s.label}>
                        <div className="ae-summary-label">{s.label}</div>
                        <div className={`ae-summary-value${s.gold ? ' gold' : ''}`}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="ae-content">
                {/* ── Filters ──────────────────────────────── */}
                <ActiveEventFilters
                    query={query} setQuery={setQuery}
                    type={type} setType={setType}
                    status={status} setStatus={setStatus}
                    resultCount={filtered.length}
                />

                {/* ── Cards list ───────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="ae-empty">
                        <Activity size={48} />
                        <h3>No active events found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filtered.map(evt => (
                            <ActiveEventCard key={evt.id} event={evt} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveEventsPage;
