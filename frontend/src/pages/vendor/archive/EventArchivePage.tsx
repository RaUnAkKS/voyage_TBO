import { useState, useMemo } from 'react';
import { Archive, Download } from 'lucide-react';
import { MOCK_ARCHIVED_EVENTS, filterArchiveEvents, ArchiveStatus } from '../../../mockData/archiveData';
import { EventType } from '../../../mockData/inventoryData';
import ArchiveFilters from './ArchiveFilters';
import ArchiveEventCard from './ArchiveEventCard';
import '../../../styles/EventArchive.css';
import '../../../styles/VendorLayout.css';

const EventArchivePage = () => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<EventType | 'ALL'>('ALL');
    const [status, setStatus] = useState<ArchiveStatus | 'ALL'>('ALL');

    const filtered = useMemo(
        () => filterArchiveEvents(MOCK_ARCHIVED_EVENTS, query, type, status),
        [query, type, status],
    );

    // Summary KPIs
    const totalRevenue = MOCK_ARCHIVED_EVENTS.reduce((s, e) => s + e.revenueLakh, 0).toFixed(1);
    const completedCount = MOCK_ARCHIVED_EVENTS.filter(e => e.status === 'COMPLETED').length;
    const releasedCount = MOCK_ARCHIVED_EVENTS.filter(e => e.inventoryReleased).length;

    return (
        <div>
            {/* ── Topbar ─────────────────────────────────── */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <h1>Event Archive</h1>
                    <p>Historical events with completion status, inventory release records, and performance data.</p>
                </div>
                <div className="vl-topbar-actions">
                    <button className="va-btn-export">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* ── Quick summary strip ─────────────────────── */}
            <div style={{ padding: '0 2.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1.25rem', marginBottom: '0.25rem' }}>
                {[
                    { label: 'Total Archived', value: MOCK_ARCHIVED_EVENTS.length },
                    { label: 'Completed', value: completedCount },
                    { label: 'Inventory Released', value: releasedCount },
                    { label: 'Total Revenue', value: `₹${totalRevenue}L`, gold: true },
                ].map(s => (
                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#525252' }}>{s.label}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.gold ? '#C6A75E' : '#FFFFFF' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="ea-content">
                {/* ── Filters ──────────────────────────────── */}
                <ArchiveFilters
                    query={query} setQuery={setQuery}
                    type={type} setType={setType}
                    status={status} setStatus={setStatus}
                    resultCount={filtered.length}
                />

                {/* ── Cards ────────────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="ea-empty">
                        <Archive size={48} />
                        <h3>No archived events found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filtered.map(evt => (
                            <ArchiveEventCard key={evt.id} event={evt} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventArchivePage;
