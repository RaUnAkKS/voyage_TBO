import { useParams, Navigate, Link } from 'react-router-dom';
import {
    ChevronLeft, MapPin, Calendar, Users, Package,
    CheckCircle2, AlertCircle, BarChart2, Hash, Zap
} from 'lucide-react';
import { MOCK_EVENTS, MOCK_INVENTORY } from '../../mockData/inventoryData';
import { getUtilPct, progressColor } from './inventory/InventoryLayout';
import '../../styles/VendorLayout.css';
import '../../styles/VendorInventory.css';

/* ── Status badge colour map ── */
const STATUS_STYLES = {
    PREPARATION: { bg: 'rgba(198,167,94,0.12)', color: '#C6A75E' },
    'IN PROGRESS': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
    COMPLETED: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' },
};

/* ── Progress bar for the table ── */
const TableProgressBar = ({ pct }: { pct: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
            flex: 1, height: 6, background: 'rgba(255,255,255,0.06)',
            borderRadius: 4, overflow: 'hidden',
        }}>
            <div style={{
                height: '100%', width: `${Math.min(pct, 100)}%`,
                background: progressColor(pct), borderRadius: 4,
                transition: 'width 0.8s ease',
            }} />
        </div>
        <span style={{ fontSize: '0.72rem', color: '#525252', width: '30px', textAlign: 'right' }}>{pct}%</span>
    </div>
);

/* ── Summary Card ── */
const SummaryCard = ({ label, value, sub, icon, gold }: {
    label: string; value: string | number; subText?: string; icon: React.ReactNode; gold?: boolean; sub?: string;
}) => (
    <div style={{
        background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#525252', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
            <span style={{ color: gold ? '#C6A75E' : '#525252' }}>{icon}</span>
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>{value}</div>
        {sub && <div style={{ fontSize: '0.78rem', color: '#525252' }}>{sub}</div>}
    </div>
);

const EventDetailsPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) return <Navigate to="/vendor/overview" replace />;

    /* ── Derived data ── */
    const allocatedItems = MOCK_INVENTORY.filter(i =>
        i.allocations.some(a => a.eventId === event.id),
    );
    const totalAllocatedQty = allocatedItems.reduce((acc, item) => {
        const alloc = item.allocations.find(a => a.eventId === event.id);
        return acc + (alloc?.quantityAllocated ?? 0);
    }, 0);

    const overallUsagePct = Math.round((event.usedSlots / event.totalSlots) * 100);
    const isOverallocated = allocatedItems.some(i => getUtilPct(i) > 100);
    const resourceStatus = isOverallocated ? 'Overallocated' : 'Healthy';

    // Derive status based on date
    const today = new Date();
    const eventDate = new Date(event.date);
    let status: 'PREPARATION' | 'IN PROGRESS' | 'COMPLETED' = 'PREPARATION';
    if (eventDate < today) status = 'COMPLETED';
    else if (eventDate.toDateString() === today.toDateString()) status = 'IN PROGRESS';

    const statusStyle = STATUS_STYLES[status];

    return (
        <div style={{ padding: '0 2rem 2rem 2rem', animation: 'vl-fadein 0.4s ease' }}>
            {/* ── Top Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', marginTop: '1.5rem' }}>
                <div>
                    <Link
                        to="/vendor/inventory/allocations"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.85rem', color: '#525252', textDecoration: 'none',
                            marginBottom: '0.75rem', transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C6A75E')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#525252')}
                    >
                        <ChevronLeft size={14} /> Back to Allocations
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF' }}>{event.name}</h1>
                        <span style={{
                            padding: '0.3rem 0.8rem', borderRadius: 20,
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.5,
                            background: statusStyle.bg, color: statusStyle.color,
                            border: `1px solid ${statusStyle.color}44`,
                        }}>
                            {status}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', color: '#525252', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Hash size={14} /> EVT-2026-{event.id.padStart(4, '0')}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {event.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> {event.totalSlots} expected</span>
                    </div>
                </div>
            </div>

            {/* ── Summary Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <SummaryCard label="Inventory Types" value={allocatedItems.length} sub="Resources required" icon={<Package size={18} />} gold />
                <SummaryCard label="Allocated Units" value={totalAllocatedQty} sub="Total item units" icon={<Zap size={18} />} gold />
                <SummaryCard label="Utilization" value={`${overallUsagePct}%`} sub="Event capacity" icon={<BarChart2 size={18} />} gold />
                <SummaryCard
                    label="Resource Status"
                    value={resourceStatus}
                    sub={isOverallocated ? "Requires immediate attention" : "Everything looks good"}
                    icon={isOverallocated ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                />
            </div>

            {/* ── Allocation Table ── */}
            <div style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem', marginBottom: '2.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Inventory Allocation Detail</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', fontSize: '0.68rem', color: '#525252', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                            <th style={{ paddingBottom: '1rem' }}>Item Name</th>
                            <th style={{ paddingBottom: '1rem' }}>Category</th>
                            <th style={{ paddingBottom: '1rem' }}>Total Quantity</th>
                            <th style={{ paddingBottom: '1rem' }}>Allocated Here</th>
                            <th style={{ paddingBottom: '1rem' }}>Available</th>
                            <th style={{ paddingBottom: '1rem' }}>Utilization</th>
                            <th style={{ paddingBottom: '1rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocatedItems.map(item => {
                            const alloc = item.allocations.find(a => a.eventId === event.id)?.quantityAllocated ?? 0;
                            const util = getUtilPct(item);
                            const available = item.totalQuantity - item.allocations.reduce((s, a) => s + a.quantityAllocated, 0);

                            let statusText = 'OK';
                            let statusColor = '#22C55E';
                            if (util > 100) { statusText = 'Overallocated'; statusColor = '#EF4444'; }
                            else if (util > 75) { statusText = 'High Usage'; statusColor = '#F59E0B'; }

                            return (
                                <tr key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem', color: '#B5B5B5' }}>
                                    <td style={{ padding: '1.2rem 0', color: '#FFFFFF', fontWeight: 600 }}>{item.name}</td>
                                    <td>{item.category.replace('_', ' ')}</td>
                                    <td>{item.totalQuantity}</td>
                                    <td>{alloc}</td>
                                    <td>{available}</td>
                                    <td style={{ width: '150px' }}><TableProgressBar pct={util} /></td>
                                    <td>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor, textTransform: 'uppercase' }}>
                                            {statusText}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {allocatedItems.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: '#525252' }}>
                        No inventory items allocated to this event yet.
                    </div>
                )}
            </div>

            {/* ── Resource Usage Bar ── */}
            <div style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Total Resource Usage</h3>
                    <span style={{ color: progressColor(overallUsagePct), fontWeight: 800, fontSize: '1.4rem' }}>{overallUsagePct}%</span>
                </div>
                <div style={{ height: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 7, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', width: `${overallUsagePct}%`,
                        background: 'linear-gradient(90deg, #C6A75E, #D4B76A)',
                        boxShadow: '0 0 10px rgba(198,167,94,0.3)',
                        transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} />
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#525252' }}>
                    Cumulative capacity utilized across all allocated resources for this event.
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
