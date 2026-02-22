import { useNavigate } from 'react-router-dom';
import {
    Package, Calendar, BarChart2, TrendingUp,
    ArrowUpRight, CheckCircle, AlertCircle, ChevronRight,
} from 'lucide-react';
import { MOCK_INVENTORY, MOCK_EVENTS } from '../../mockData/inventoryData';
import { getAllocated, getUtilPct } from './inventory/InventoryLayout';
import '../../styles/VendorInventory.css';
import '../../styles/VendorLayout.css';

const totalQty = MOCK_INVENTORY.reduce((s, i) => s + i.totalQuantity, 0);
const totalAlloc = MOCK_INVENTORY.reduce((s, i) => s + getAllocated(i), 0);
const utilPct = Math.round((totalAlloc / totalQty) * 100);

const StatCard = ({ label, value, sub, icon, accent }: {
    label: string; value: string | number; sub: string; icon: React.ReactNode; accent?: boolean;
}) => (
    <div className="vi-kpi-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="vi-kpi-label">{label}</div>
            <span style={{ color: accent ? 'var(--vl-gold)' : 'var(--vl-hint)' }}>{icon}</span>
        </div>
        <div className={`vi-kpi-value ${accent ? 'vi-kpi-gold' : ''}`}>{value}</div>
        <div className="vi-kpi-sub">{sub}</div>
    </div>
);

const VendorOverview = () => {
    const navigate = useNavigate();
    const upcomingEvents = MOCK_EVENTS.filter(e => new Date(e.date) >= new Date()).slice(0, 3);

    return (
        <div>
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <h1>Overview</h1>
                    <p>Your vendor portal at a glance — inventory health, upcoming events, and quick actions.</p>
                </div>
                <div className="vl-topbar-actions">
                    <button className="vl-btn-primary" onClick={() => navigate('/vendor/inventory')}>
                        <ArrowUpRight size={15} /> View Inventory
                    </button>
                </div>
            </div>

            <div className="vl-content">
                {/* KPI summary */}
                <div className="vi-kpi-grid" style={{ marginBottom: '2rem' }}>
                    <StatCard label="Total Items" value={MOCK_INVENTORY.length} sub="Across all categories" icon={<Package size={18} />} />
                    <StatCard label="Total Qty" value={totalQty.toLocaleString()} sub="Cumulative stock units" icon={<TrendingUp size={18} />} />
                    <StatCard label="Active Events" value={MOCK_EVENTS.length} sub="Events using your inventory" icon={<Calendar size={18} />} />
                    <StatCard label="Utilization" value={`${utilPct}%`} sub={utilPct >= 75 ? '⚠ High utilization' : 'Healthy capacity'} icon={<BarChart2 size={18} />} accent={utilPct >= 75} />
                </div>

                {/* Upcoming events — clickable */}
                <h3 style={{ fontFamily: 'var(--vl-serif)', fontSize: '1.15rem', color: 'var(--vl-text)', margin: '0 0 1rem' }}>
                    Upcoming Events
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {upcomingEvents.length === 0 ? (
                        <p style={{ color: 'var(--vl-hint)' }}>No upcoming events found.</p>
                    ) : upcomingEvents.map(evt => {
                        const util = MOCK_INVENTORY.filter(i => i.allocations.some(a => a.eventId === evt.id));
                        const isLow = util.some(i => getUtilPct(i) >= 90);
                        return (
                            <div
                                key={evt.id}
                                className="vi-kpi-card"
                                onClick={() => navigate(`/vendor/events/${evt.id}`)}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.transform = 'translateY(-2px)';
                                    el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(198,167,94,0.2)';
                                    el.style.borderColor = 'rgba(198,167,94,0.25)';
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.transform = '';
                                    el.style.boxShadow = '';
                                    el.style.borderColor = '';
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{evt.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--vl-muted)' }}>
                                        {new Date(evt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {evt.location}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="vi-event-type-badge">{evt.type}</span>
                                    {isLow
                                        ? <AlertCircle size={16} color="#E05C5C" />
                                        : <CheckCircle size={16} color="#4CAF82" />}
                                    <ChevronRight size={15} color="#525252" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick links — Team & Calendar replaced with active portal pages */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {[
                        { label: 'Analytics', icon: <BarChart2 size={22} />, to: '/vendor/analytics' },
                        { label: 'Inventory', icon: <Package size={22} />, to: '/vendor/inventory' },
                        { label: 'Active Events', icon: <Calendar size={22} />, to: '/vendor/active-events' },
                        { label: 'Payments & Cashflow', icon: <TrendingUp size={22} />, to: '/vendor/payments' },
                    ].map(card => (
                        <div
                            key={card.label}
                            className="vi-kpi-card"
                            onClick={() => navigate(card.to)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}
                        >
                            <span style={{ color: 'var(--vl-gold)' }}>{card.icon}</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{card.label}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--vl-hint)' }}>Navigate →</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VendorOverview;
