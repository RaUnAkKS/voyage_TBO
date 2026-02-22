import { Link, useParams, Navigate } from 'react-router-dom';
import {
    ChevronLeft, MapPin, Calendar, Package, CheckCircle, XCircle,
    Download, TrendingUp, Users, BarChart2,
} from 'lucide-react';
import { MOCK_ARCHIVED_EVENTS, formatDateRange } from '../../../mockData/archiveData';
import { MOCK_INVENTORY } from '../../../mockData/inventoryData';
import '../../../styles/EventArchive.css';
import '../../../styles/VendorLayout.css';
import '../../../styles/VendorAnalytics.css';

const ArchiveDetailsPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const event = MOCK_ARCHIVED_EVENTS.find(e => e.id === eventId);

    if (!event) return <Navigate to="/vendor/archive" replace />;

    // Inventory used in this event
    const usedInventory = MOCK_INVENTORY.filter(item =>
        item.allocations.some(a => a.eventId === event.id)
    ).map(item => {
        const alloc = item.allocations.find(a => a.eventId === event.id)!;
        const utilPct = Math.round((alloc.quantityAllocated / item.totalQuantity) * 100);
        return { ...item, quantityAllocated: alloc.quantityAllocated, utilPct };
    });

    const dateRange = formatDateRange(event.startDate, event.endDate);
    const durationDays = Math.max(1, Math.ceil(
        (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / 86400000
    ) + 1);

    return (
        <div>
            {/* ── Topbar ────────────────────────────────────── */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <Link to="/vendor/archive" className="ea-detail-back">
                        <ChevronLeft size={14} /> Back to Archive
                    </Link>
                    <h1 style={{ marginTop: '0.5rem' }}>{event.name}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className={`ea-badge ${event.status.toLowerCase()}`}>{event.status}</span>
                        <span className="ea-badge type">{event.type}</span>
                        <span style={{ fontSize: '0.75rem', color: '#525252' }}>{event.eventCode}</span>
                    </div>
                </div>
                <div className="vl-topbar-actions">
                    <button className="ea-download-btn">
                        <Download size={15} /> Download Report
                    </button>
                </div>
            </div>

            <div className="ea-content">
                {/* ── KPI grid ────────────────────────────────── */}
                <div className="ea-detail-grid">
                    {[
                        { label: 'Revenue', value: event.revenueLakh > 0 ? `₹${event.revenueLakh}L` : '—', gold: true, icon: <TrendingUp size={18} /> },
                        { label: 'Units Allocated', value: event.totalAllocatedUnits.toLocaleString(), icon: <Package size={18} /> },
                        { label: 'Duration', value: `${durationDays} day${durationDays > 1 ? 's' : ''}`, icon: <Calendar size={18} /> },
                        { label: 'Categories Used', value: event.usedCategories.length, icon: <BarChart2 size={18} /> },
                        { label: 'Inventory Status', value: event.inventoryReleased ? 'Released' : 'Held', gold: event.inventoryReleased, icon: event.inventoryReleased ? <CheckCircle size={18} /> : <XCircle size={18} /> },
                        { label: 'Client', value: event.clientName, icon: <Users size={18} />, small: true },
                    ].map(c => (
                        <div className="ea-detail-card" key={c.label}>
                            <div className="ea-detail-stat-label">{c.label}</div>
                            <div className={`ea-detail-stat-value${c.gold ? ' gold' : ''}`} style={c.small ? { fontSize: '0.9rem', marginTop: '0.4rem' } : {}}>
                                {c.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Event Info ──────────────────────────────── */}
                <div className="va-chart-card">
                    <p className="va-chart-title" style={{ marginBottom: '1.25rem' }}>Event Details</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {[
                            { icon: <Calendar size={14} />, label: 'Date Range', value: dateRange },
                            { icon: <MapPin size={14} />, label: 'Location', value: event.location },
                            { icon: <Package size={14} />, label: 'Event Code', value: event.eventCode },
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
                    {event.notes && (
                        <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(198,167,94,0.05)', border: '1px solid rgba(198,167,94,0.12)', borderRadius: '8px', fontSize: '0.82rem', color: '#B5B5B5' }}>
                            📝 {event.notes}
                        </div>
                    )}
                </div>

                {/* ── Inventory breakdown ─────────────────────── */}
                {usedInventory.length > 0 && (
                    <div className="va-chart-card">
                        <p className="va-chart-title" style={{ marginBottom: '1.25rem' }}>Inventory Used ({usedInventory.length} items)</p>
                        {usedInventory.map(item => (
                            <div className="ea-inv-row" key={item.id}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                    <strong>{item.name}</strong>
                                    <span style={{ fontSize: '0.7rem', color: '#525252' }}>{item.category.replace('_', ' ')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="va-util-wrap" style={{ minWidth: 150 }}>
                                        <div className="va-util-track">
                                            <div className="va-util-fill" style={{
                                                width: `${Math.min(item.utilPct, 100)}%`,
                                                background: item.utilPct >= 85 ? 'linear-gradient(90deg,#E05C5C,#FF8080)' : item.utilPct >= 55 ? 'linear-gradient(90deg,#C6A75E,#E8C97A)' : 'linear-gradient(90deg,#4CAF82,#70D6A3)',
                                            }} />
                                        </div>
                                        <span className="va-util-val">{item.utilPct}%</span>
                                    </div>
                                    <span style={{ minWidth: 80, textAlign: 'right', color: '#FFFFFF', fontWeight: 600 }}>
                                        {item.quantityAllocated} / {item.totalQuantity} units
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchiveDetailsPage;
