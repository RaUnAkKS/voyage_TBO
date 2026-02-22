import { useState, useMemo } from 'react';
import {
    Package, LayoutDashboard, Calendar, BarChart2, Layers, Search,
    Plus, X, MapPin, TrendingUp, CheckCircle, AlertCircle,
    ChevronLeft, ChevronRight, Settings, LogOut, Users,
} from 'lucide-react';
import {
    MOCK_INVENTORY, MOCK_EVENTS, HEATMAP_DATES, CATEGORY_LIST,
    InventoryItem, InventoryCategory, EventType,
} from '../mockData/inventoryData';
import '../styles/VendorInventory.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
const getAllocated = (item: InventoryItem) =>
    item.allocations.reduce((s, a) => s + a.quantityAllocated, 0);

const getAvailable = (item: InventoryItem) =>
    item.totalQuantity - getAllocated(item);

const getUtilPct = (item: InventoryItem) =>
    Math.round((getAllocated(item) / item.totalQuantity) * 100);

const progressColor = (pct: number): string => {
    if (pct >= 90) return 'linear-gradient(90deg, #E05C5C, #FF8080)';
    if (pct >= 70) return 'linear-gradient(90deg, #C6A75E, #E8C97A)';
    return 'linear-gradient(90deg, #4CAF82, #70D6A3)';
};

const heatIntensity = (pct: number): number => {
    if (pct === 0) return 0;
    if (pct < 20) return 1;
    if (pct < 40) return 2;
    if (pct < 60) return 3;
    if (pct < 80) return 4;
    return 5;
};

const CATEGORIES: InventoryCategory[] = [
    'TECHNICAL', 'FURNITURE', 'DECOR', 'STAFF', 'CATERING', 'ACCOMMODATION', 'FLOOR_SPACE',
];

const EVENT_TYPES: EventType[] = [
    'WEDDING', 'MEETING', 'INCENTIVE', 'CONFERENCE', 'EXHIBITION',
];

// Calendar constants
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// ══════════════════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// KPI Card
const KpiCard = ({ label, value, sub, gold, utilPct }: {
    label: string; value: string | number; sub?: string; gold?: boolean; utilPct?: number;
}) => (
    <div className="vi-kpi-card">
        <div className="vi-kpi-label">{label}</div>
        <div className={`vi-kpi-value ${gold ? 'vi-kpi-gold' : ''}`}>{value}</div>
        {sub && <div className="vi-kpi-sub">{sub}</div>}
        {utilPct !== undefined && (
            <div className="vi-kpi-progress">
                <div className="vi-kpi-progress-fill" style={{ width: `${utilPct}%` }} />
            </div>
        )}
    </div>
);

// Category Badge
const CatBadge = ({ cat }: { cat: InventoryCategory }) => (
    <span className={`vi-badge vi-badge-${cat}`}>{cat.replace('_', ' ')}</span>
);

// ── Drawer ────────────────────────────────────────────────────────────────────
const ItemDrawer = ({ item, onClose }: { item: InventoryItem; onClose: () => void }) => {
    const allocated = getAllocated(item);
    const available = getAvailable(item);
    const utilPct = getUtilPct(item);

    return (
        <>
            <div className="vi-drawer-overlay" onClick={onClose} />
            <aside className="vi-drawer">
                <div className="vi-drawer-header">
                    <div>
                        <h2>{item.name}</h2>
                        <CatBadge cat={item.category} />
                    </div>
                    <button className="vi-drawer-close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="vi-drawer-body">
                    {/* Stats */}
                    <div className="vi-drawer-section">
                        <h4>Inventory Stats</h4>
                        <div className="vi-drawer-stat-grid">
                            <div className="vi-drawer-stat">
                                <div className="vi-drawer-stat-label">Total</div>
                                <div className="vi-drawer-stat-value">{item.totalQuantity}</div>
                            </div>
                            <div className="vi-drawer-stat">
                                <div className="vi-drawer-stat-label">Allocated</div>
                                <div className="vi-drawer-stat-value">{allocated}</div>
                            </div>
                            <div className="vi-drawer-stat">
                                <div className="vi-drawer-stat-label">Available</div>
                                <div className="vi-drawer-stat-value" style={{ color: available < 5 ? '#E05C5C' : '#4CAF82' }}>
                                    {available}
                                </div>
                            </div>
                            <div className="vi-drawer-stat">
                                <div className="vi-drawer-stat-label">Utilization</div>
                                <div className="vi-drawer-stat-value gold">{utilPct}%</div>
                            </div>
                        </div>
                        <div className="vi-kpi-progress" style={{ marginTop: '0.5rem' }}>
                            <div className="vi-kpi-progress-fill" style={{ width: `${utilPct}%`, background: progressColor(utilPct) }} />
                        </div>
                    </div>

                    {/* Allocations */}
                    <div className="vi-drawer-section">
                        <h4>Event Allocations ({item.allocations.length})</h4>
                        {item.allocations.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--vi-hint)' }}>No allocations yet.</p>
                        ) : (
                            item.allocations.map(alloc => {
                                const evt = MOCK_EVENTS.find(e => e.id === alloc.eventId);
                                return (
                                    <div className="vi-alloc-row" key={alloc.eventId}>
                                        <span>{evt?.name ?? alloc.eventId}</span>
                                        <span>{alloc.quantityAllocated} units</span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Quick Allocate */}
                    <div className="vi-drawer-section">
                        <h4>Quick Allocate</h4>
                        <div className="vi-quick-alloc">
                            <select>
                                <option value="">Select Event…</option>
                                {MOCK_EVENTS.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                            <input type="number" min={1} max={available} placeholder={`Max ${available}`} />
                        </div>
                        <button className="vi-btn-primary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                            Allocate Units
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

// ── Inventory Table ───────────────────────────────────────────────────────────
const TableView = ({
    items, onRowClick,
}: {
    items: InventoryItem[];
    onRowClick: (item: InventoryItem) => void;
}) => (
    <div className="vi-table-card">
        <div className="vi-table-header">
            <h3>Inventory Items ({items.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="vi-btn-ghost"><TrendingUp size={14} /> Export</button>
            </div>
        </div>
        {items.length === 0 ? (
            <div className="vi-empty">
                <Package size={48} />
                <p>No inventory items found.</p>
            </div>
        ) : (
            <div style={{ overflowX: 'auto' }}>
                <table className="vi-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Total Qty</th>
                            <th>Allocated</th>
                            <th>Available</th>
                            <th>Utilization</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => {
                            const allocated = getAllocated(item);
                            const available = getAvailable(item);
                            const util = getUtilPct(item);
                            const isLow = available < Math.ceil(item.totalQuantity * 0.1);

                            return (
                                <tr key={item.id} onClick={() => onRowClick(item)}>
                                    <td><strong>{item.name}</strong></td>
                                    <td><CatBadge cat={item.category} /></td>
                                    <td className="td-muted">{item.totalQuantity}</td>
                                    <td>{allocated}</td>
                                    <td style={{ color: isLow ? '#E05C5C' : 'var(--vi-green)' }}>
                                        {available}
                                    </td>
                                    <td>
                                        <div className="vi-progress-wrap">
                                            <div className="vi-progress-track">
                                                <div className="vi-progress-fill" style={{
                                                    width: `${util}%`,
                                                    background: progressColor(util),
                                                }} />
                                            </div>
                                            <div className="vi-progress-label">{util}% used</div>
                                        </div>
                                    </td>
                                    <td>
                                        {isLow ? (
                                            <span className="vi-badge-low"><AlertCircle size={10} /> Low Stock</span>
                                        ) : (
                                            <span style={{ fontSize: '0.78rem', color: 'var(--vi-green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <CheckCircle size={12} /> OK
                                            </span>
                                        )}
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div className="vi-row-actions">
                                            <button className="vi-action-btn" onClick={() => onRowClick(item)}>View</button>
                                            <button className="vi-action-btn vi-action-btn-primary">Allocate</button>
                                            <button className="vi-action-btn">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

// ── Calendar View ─────────────────────────────────────────────────────────────
const CalendarView = () => {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Map event dates to this month
    const eventsByDay: Record<number, string[]> = {};
    MOCK_EVENTS.forEach(evt => {
        const d = new Date(evt.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!eventsByDay[day]) eventsByDay[day] = [];
            eventsByDay[day].push(evt.name);
        }
    });

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
    const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

    return (
        <div className="vi-calendar-card">
            <div className="vi-calendar-header">
                <h3>{MONTH_NAMES[month]} {year}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="vi-btn-ghost" onClick={prevMonth}><ChevronLeft size={16} /></button>
                    <button className="vi-btn-ghost" onClick={nextMonth}><ChevronRight size={16} /></button>
                </div>
            </div>
            <div className="vi-calendar-grid">
                {DAYS_OF_WEEK.map(d => (
                    <div key={d} className="vi-cal-day-label">{d}</div>
                ))}
                {cells.map((day, idx) => (
                    <div
                        key={idx}
                        className={`vi-cal-day ${day === now.getDate() && month === now.getMonth() && year === now.getFullYear() ? 'cal-today' : ''}`}
                    >
                        {day && (
                            <>
                                <div className="vi-cal-day-num">{day}</div>
                                {(eventsByDay[day] ?? []).map(name => (
                                    <div key={name} className="vi-cal-event-dot" title={name}>
                                        {name}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Heatmap View ──────────────────────────────────────────────────────────────
const HeatmapView = () => {
    // For each category × date, compute average utilization
    const getCatUtil = (cat: InventoryCategory, dateStr: string): number => {
        const eventDate = MOCK_EVENTS.find(e => {
            const d = new Date(e.date);
            return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}` === dateStr;
        });
        if (!eventDate) return 0;
        const items = MOCK_INVENTORY.filter(i => i.category === cat);
        if (items.length === 0) return 0;
        const total = items.reduce((s, i) => {
            const a = i.allocations.find(al => al.eventId === eventDate.id);
            return s + (a ? (a.quantityAllocated / i.totalQuantity) * 100 : 0);
        }, 0);
        return Math.round(total / items.length);
    };

    const LEGEND = [0, 1, 2, 3, 4, 5];

    return (
        <div className="vi-heatmap-card">
            <div className="vi-heatmap-header">
                <h3>Utilization Heatmap</h3>
                <p>Gold intensity = utilization %. Hover cells for details.</p>
            </div>
            <div className="vi-heatmap-body">
                <table className="vi-heatmap-table">
                    <thead>
                        <tr>
                            <th className="vi-hm-cat">Category</th>
                            {HEATMAP_DATES.map(d => (
                                <th key={d} className="vi-hm-date">{d}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CATEGORY_LIST.map(cat => (
                            <tr key={cat}>
                                <td className="vi-hm-cat">{cat.replace('_', ' ')}</td>
                                {HEATMAP_DATES.map(date => {
                                    const pct = getCatUtil(cat, date);
                                    const lvl = heatIntensity(pct);
                                    return (
                                        <td
                                            key={date}
                                            className={`vi-hm-cell vi-hm-${lvl}`}
                                            title={`${cat} on ${date}: ${pct}%`}
                                        >
                                            {pct > 0 ? `${pct}%` : '–'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="vi-heatmap-legend">
                    <span>Low</span>
                    <div className="vi-legend-scale">
                        {LEGEND.map(l => (
                            <div key={l} className={`vi-legend-box vi-hm-${l}`} />
                        ))}
                    </div>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

// ── Event Allocations View ────────────────────────────────────────────────────
const AllocationsView = () => {
    const [activeType, setActiveType] = useState<EventType | 'ALL'>('ALL');

    const filtered = MOCK_EVENTS.filter(
        e => activeType === 'ALL' || e.type === activeType
    );

    return (
        <div>
            <div className="vi-alloc-filters">
                {(['ALL', ...EVENT_TYPES] as (EventType | 'ALL')[]).map(t => (
                    <button
                        key={t}
                        className={`vi-filter-chip ${activeType === t ? 'active' : ''}`}
                        onClick={() => setActiveType(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="vi-event-grid">
                {filtered.map(evt => {
                    const usedItems = MOCK_INVENTORY.filter(i =>
                        i.allocations.some(a => a.eventId === evt.id)
                    );
                    const usagePct = Math.round((evt.usedSlots / evt.totalSlots) * 100);
                    const evtDate = new Date(evt.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                    });

                    return (
                        <div className="vi-event-card" key={evt.id}>
                            <div className="vi-event-card-header">
                                <div>
                                    <h3>{evt.name}</h3>
                                    <p>{evtDate}</p>
                                </div>
                                <span className="vi-event-type-badge">{evt.type}</span>
                            </div>

                            <div className="vi-event-meta">
                                <div className="vi-event-meta-row">
                                    <MapPin size={14} />
                                    {evt.location}
                                </div>
                                <div className="vi-event-meta-row">
                                    <Package size={14} />
                                    {usedItems.length} inventory types allocated
                                </div>
                                <div className="vi-event-meta-row">
                                    <Users size={14} />
                                    {evt.usedSlots} / {evt.totalSlots} attendees
                                </div>
                            </div>

                            <div className="vi-event-progress-label">
                                <span>Resource Usage</span>
                                <span>{usagePct}%</span>
                            </div>
                            <div className="vi-progress-track">
                                <div className="vi-progress-fill" style={{
                                    width: `${usagePct}%`,
                                    background: progressColor(usagePct),
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
type TabId = 'table' | 'calendar' | 'heatmap' | 'allocations';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'table', label: 'Inventory Table', icon: <Layers size={15} /> },
    { id: 'calendar', label: 'Calendar View', icon: <Calendar size={15} /> },
    { id: 'heatmap', label: 'Utilization Heatmap', icon: <BarChart2 size={15} /> },
    { id: 'allocations', label: 'Event Allocations', icon: <Package size={15} /> },
];

const VendorInventory = () => {
    const [activeTab, setActiveTab] = useState<TabId>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [catFilter, setCatFilter] = useState<InventoryCategory | 'ALL'>('ALL');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [sidebarTab, setSidebarTab] = useState('inventory');

    // ── Filtered items ──────────────────────────────────────────────────────
    const filtered = useMemo(() =>
        MOCK_INVENTORY.filter(item => {
            const matchQ = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCat = catFilter === 'ALL' || item.category === catFilter;
            return matchQ && matchCat;
        }),
        [searchQuery, catFilter]);

    // ── KPIs ────────────────────────────────────────────────────────────────
    const totalItems = MOCK_INVENTORY.length;
    const totalQty = MOCK_INVENTORY.reduce((s, i) => s + i.totalQuantity, 0);
    const totalAlloc = MOCK_INVENTORY.reduce((s, i) => s + getAllocated(i), 0);
    const totalAvail = totalQty - totalAlloc;
    const utilPct = Math.round((totalAlloc / totalQty) * 100);

    // ── Sidebar nav items ────────────────────────────────────────────────────
    const NAV = [
        { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Overview' },
        { id: 'inventory', icon: <Package size={16} />, label: 'Inventory' },
        { id: 'calendar', icon: <Calendar size={16} />, label: 'Calendar' },
        { id: 'analytics', icon: <BarChart2 size={16} />, label: 'Analytics' },
        { id: 'team', icon: <Users size={16} />, label: 'Team' },
    ];

    return (
        <div className="vi-page">
            {/* ── Sidebar ─── */}
            <aside className="vi-sidebar">
                <div className="vi-sidebar-logo">
                    <div className="vi-sidebar-logo-icon">V</div>
                    <span>VendorPortal</span>
                </div>

                <div className="vi-sidebar-section-label">Navigation</div>
                <nav className="vi-sidebar-nav">
                    {NAV.map(n => (
                        <button
                            key={n.id}
                            className={`vi-nav-item ${sidebarTab === n.id ? 'active' : ''}`}
                            onClick={() => setSidebarTab(n.id)}
                        >
                            {n.icon} {n.label}
                        </button>
                    ))}
                </nav>

                <div className="vi-sidebar-section-label">Account</div>
                <nav className="vi-sidebar-nav" style={{ flexGrow: 0 }}>
                    <button className="vi-nav-item"><Settings size={16} /> Settings</button>
                </nav>

                <div className="vi-sidebar-bottom">
                    <button className="vi-nav-item"><LogOut size={16} /> Logout</button>
                </div>
            </aside>

            {/* ── Main ─── */}
            <main className="vi-main">
                {/* Top Bar */}
                <div className="vi-topbar">
                    <div className="vi-topbar-title">
                        <h1>Inventory Dashboard</h1>
                        <p>Manage inventory, track utilization, and allocate resources across events.</p>
                    </div>
                    <div className="vi-topbar-actions">
                        <div className="vi-search">
                            <Search size={14} />
                            <input
                                placeholder="Search items…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="vi-filter-select"
                            value={catFilter}
                            onChange={e => setCatFilter(e.target.value as InventoryCategory | 'ALL')}
                        >
                            <option value="ALL">All Categories</option>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <button className="vi-btn-primary">
                            <Plus size={15} /> Add Item
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="vi-content">
                    {/* KPI Cards */}
                    <div className="vi-kpi-grid">
                        <KpiCard label="Total Items" value={totalItems} sub="Across all categories" />
                        <KpiCard label="Total Quantity" value={totalQty.toLocaleString()} sub="Cumulative units" />
                        <KpiCard label="Allocated" value={totalAlloc.toLocaleString()} sub={`Across ${MOCK_EVENTS.length} events`} />
                        <KpiCard label="Available" value={totalAvail.toLocaleString()} sub="Ready to deploy" />
                        <KpiCard
                            label="Utilization"
                            value={`${utilPct}%`}
                            sub={utilPct >= 75 ? '⚠ High utilization' : 'Healthy capacity'}
                            gold={utilPct >= 75}
                            utilPct={utilPct}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="vi-tabs">
                        {TABS.map(t => (
                            <button
                                key={t.id}
                                className={`vi-tab ${activeTab === t.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(t.id)}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {t.icon} {t.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    {activeTab === 'table' && <TableView items={filtered} onRowClick={setSelectedItem} />}
                    {activeTab === 'calendar' && <CalendarView />}
                    {activeTab === 'heatmap' && <HeatmapView />}
                    {activeTab === 'allocations' && <AllocationsView />}
                </div>
            </main>

            {/* Drawer */}
            {selectedItem && (
                <ItemDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
};

export default VendorInventory;
