import { useState, useMemo, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import { Layers, Calendar, BarChart2, Package, Search, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import {
    MOCK_INVENTORY, MOCK_EVENTS,
    InventoryItem, InventoryCategory, EventInventoryAllocation,
} from '../../../mockData/inventoryData';
import CustomDropdown, { DropdownOption } from '../../../components/vendor/CustomDropdown';
import '../../../styles/VendorInventory.css';
import '../../../styles/VendorLayout.css';
import '../../../styles/CustomDropdown.css';

// ── Shared helpers ────────────────────────────────────────────────────────────
export const getAllocated = (item: InventoryItem) =>
    item.allocations.reduce((s, a) => s + a.quantityAllocated, 0);

export const getAvailable = (item: InventoryItem) =>
    item.totalQuantity - getAllocated(item);

export const getUtilPct = (item: InventoryItem) =>
    Math.round((getAllocated(item) / item.totalQuantity) * 100);

export const progressColor = (pct: number): string => {
    if (pct >= 90) return 'linear-gradient(90deg, #E05C5C, #FF8080)';
    if (pct >= 70) return 'linear-gradient(90deg, #C6A75E, #E8C97A)';
    return 'linear-gradient(90deg, #4CAF82, #70D6A3)';
};

export const CATEGORIES: InventoryCategory[] = [
    'TECHNICAL', 'FURNITURE', 'DECOR', 'STAFF', 'CATERING', 'ACCOMMODATION', 'FLOOR_SPACE',
];

// ── KPI Card ──────────────────────────────────────────────────────────────────
export const KpiCard = ({ label, value, sub, gold, utilPct }: {
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

// ── Context ───────────────────────────────────────────────────────────────────
export type InventoryCtx = {
    items: InventoryItem[];
    onRowClick: (item: InventoryItem) => void;
    onEdit: (item: InventoryItem) => void;
    onAllocate: (item: InventoryItem) => void;
};
export const useInventoryCtx = () => useOutletContext<InventoryCtx>();

// ── Category Badge ────────────────────────────────────────────────────────────
export const CatBadge = ({ cat }: { cat: InventoryCategory }) => (
    <span className={`vi-badge vi-badge-${cat}`}>{cat.replace('_', ' ')}</span>
);

// ── Modal base ────────────────────────────────────────────────────────────────
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, backdropFilter: 'blur(4px)',
                animation: 'vl-fadein 0.18s ease',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480,
                    position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
                    animation: 'vi-scale-in 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

// ── Shared form field styles ────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
    width: '100%', background: '#121212', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, padding: '0.65rem 0.9rem', color: '#FFFFFF', fontSize: '0.87rem',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.72rem', color: '#525252',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: '0.35rem',
};

// ── ADD ITEM MODAL ────────────────────────────────────────────────────────────
interface AddItemModalProps {
    onClose: () => void;
    onSave: (item: Omit<InventoryItem, 'id' | 'allocations'> & { description?: string }) => void;
}
const CAT_OPTIONS: DropdownOption[] = [
    { value: 'ALL', label: 'Select Category…' },
    ...CATEGORIES.map(c => ({ value: c, label: c.replace('_', ' ') })),
];
const AddItemModal = ({ onClose, onSave }: AddItemModalProps) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<string>('');
    const [qty, setQty] = useState('');
    const [desc, setDesc] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!name.trim()) { setError('Item name is required.'); return; }
        if (!category || category === 'ALL') { setError('Please select a category.'); return; }
        const q = parseInt(qty);
        if (!q || q < 1) { setError('Quantity must be at least 1.'); return; }
        onSave({ name: name.trim(), category: category as InventoryCategory, totalQuantity: q, description: desc });
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>Add Inventory Item</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#525252', display: 'flex' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Item Name</label>
                    <input style={inputStyle} placeholder="e.g. Banquet Chairs" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Category</label>
                    <CustomDropdown
                        options={CAT_OPTIONS.filter(o => o.value !== 'ALL')}
                        value={category || ''}
                        onChange={setCategory}
                        placeholder="Select Category…"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Total Quantity</label>
                    <input style={inputStyle} type="number" min={1} placeholder="e.g. 100" value={qty} onChange={e => setQty(e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Description (optional)</label>
                    <textarea
                        style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                        placeholder="Add notes about this item…"
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                    />
                </div>
                {error && <p style={{ margin: 0, fontSize: '0.8rem', color: '#EF4444' }}>{error}</p>}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className="vi-btn-ghost">Cancel</button>
                <button onClick={handleSave} className="vi-btn-primary">Save Item</button>
            </div>
        </Modal>
    );
};

// ── EDIT ITEM MODAL ───────────────────────────────────────────────────────────
interface EditItemModalProps {
    item: InventoryItem;
    onClose: () => void;
    onSave: (updated: InventoryItem) => void;
}
const EditItemModal = ({ item, onClose, onSave }: EditItemModalProps) => {
    const [name, setName] = useState(item.name);
    const [category, setCategory] = useState<string>(item.category);
    const [qty, setQty] = useState(String(item.totalQuantity));
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!name.trim()) { setError('Item name is required.'); return; }
        const q = parseInt(qty);
        if (!q || q < getAllocated(item)) {
            setError(`Quantity cannot be less than already-allocated ${getAllocated(item)}.`);
            return;
        }
        onSave({ ...item, name: name.trim(), category: category as InventoryCategory, totalQuantity: q });
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>Edit Item</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#525252', display: 'flex' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Item Name</label>
                    <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Category</label>
                    <CustomDropdown
                        options={CATEGORIES.map(c => ({ value: c, label: c.replace('_', ' ') }))}
                        value={category}
                        onChange={setCategory}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Total Quantity</label>
                    <input style={inputStyle} type="number" min={getAllocated(item)} value={qty} onChange={e => setQty(e.target.value)} />
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: '#525252' }}>
                        Currently allocated: {getAllocated(item)} units
                    </p>
                </div>
                {error && <p style={{ margin: 0, fontSize: '0.8rem', color: '#EF4444' }}>{error}</p>}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className="vi-btn-ghost">Cancel</button>
                <button onClick={handleSave} className="vi-btn-primary">Save Changes</button>
            </div>
        </Modal>
    );
};

// ── ALLOCATE MODAL ────────────────────────────────────────────────────────────
interface AllocateModalProps {
    item: InventoryItem;
    onClose: () => void;
    onConfirm: (itemId: string, eventId: string, qty: number) => void;
}
const AllocateModal = ({ item, onClose, onConfirm }: AllocateModalProps) => {
    const available = getAvailable(item);
    const [eventId, setEventId] = useState('');
    const [qty, setQty] = useState('');
    const [error, setError] = useState('');

    const eventOptions: DropdownOption[] = MOCK_EVENTS.map(e => ({ value: e.id, label: e.name }));

    const handleConfirm = () => {
        if (!eventId) { setError('Please select an event.'); return; }
        const q = parseInt(qty);
        if (!q || q < 1) { setError('Quantity must be at least 1.'); return; }
        if (q > available) { setError(`Cannot allocate ${q} — only ${available} available.`); return; }
        onConfirm(item.id, eventId, q);
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>Allocate Units</h2>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#525252' }}>{item.name}</p>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#525252', display: 'flex' }}><X size={18} /></button>
            </div>

            {/* Available badge */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: available > 0 ? 'rgba(76,175,130,0.1)' : 'rgba(224,92,92,0.1)',
                border: `1px solid ${available > 0 ? 'rgba(76,175,130,0.2)' : 'rgba(224,92,92,0.2)'}`,
                borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem',
            }}>
                {available > 0
                    ? <CheckCircle size={14} color="#4CAF82" />
                    : <AlertCircle size={14} color="#E05C5C" />}
                <span style={{ fontSize: '0.82rem', color: '#B5B5B5' }}>
                    <strong style={{ color: available > 0 ? '#4CAF82' : '#E05C5C' }}>{available}</strong> units currently available
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Select Event</label>
                    <CustomDropdown options={eventOptions} value={eventId} onChange={setEventId} placeholder="Choose an event…" />
                </div>
                <div>
                    <label style={labelStyle}>Quantity to Allocate</label>
                    <input
                        style={inputStyle} type="number" min={1} max={available}
                        placeholder={`Max ${available}`} value={qty}
                        onChange={e => setQty(e.target.value)}
                    />
                </div>
                {error && <p style={{ margin: 0, fontSize: '0.8rem', color: '#EF4444' }}>{error}</p>}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className="vi-btn-ghost">Cancel</button>
                <button onClick={handleConfirm} className="vi-btn-primary" disabled={available === 0}
                    style={{ opacity: available === 0 ? 0.5 : 1 }}>
                    Confirm Allocation
                </button>
            </div>
        </Modal>
    );
};

// ── Item Drawer ───────────────────────────────────────────────────────────────
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

                    <div className="vi-drawer-section">
                        <h4>Event Allocations ({item.allocations.length})</h4>
                        {item.allocations.length === 0
                            ? <p style={{ fontSize: '0.85rem', color: 'var(--vi-hint)' }}>No allocations yet.</p>
                            : item.allocations.map(alloc => {
                                const evt = MOCK_EVENTS.find(e => e.id === alloc.eventId);
                                return (
                                    <div className="vi-alloc-row" key={alloc.eventId}>
                                        <span>{evt?.name ?? alloc.eventId}</span>
                                        <span>{alloc.quantityAllocated} units</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </aside>
        </>
    );
};

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
    { to: '', label: 'Inventory Table', icon: <Layers size={14} />, end: true },
    { to: 'calendar', label: 'Calendar View', icon: <Calendar size={14} /> },
    { to: 'heatmap', label: 'Utilization Heatmap', icon: <BarChart2 size={14} /> },
    { to: 'allocations', label: 'Event Allocations', icon: <Package size={14} /> },
];

// ── Category dropdown options ─────────────────────────────────────────────────
const CAT_FILTER_OPTIONS: DropdownOption[] = [
    { value: 'ALL', label: 'All Categories' },
    ...CATEGORIES.map(c => ({ value: c, label: c.replace('_', ' ') })),
];

// ══════════════════════════════════════════════════════════════════════════════
//  INVENTORY LAYOUT
// ══════════════════════════════════════════════════════════════════════════════
const InventoryLayout = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [catFilter, setCatFilter] = useState<InventoryCategory | 'ALL'>('ALL');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);

    // Modal state
    const [addOpen, setAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [allocateItem, setAllocateItem] = useState<InventoryItem | null>(null);

    const filtered = useMemo(() =>
        items.filter(item => {
            const matchQ = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCat = catFilter === 'ALL' || item.category === catFilter;
            return matchQ && matchCat;
        }),
        [items, searchQuery, catFilter]);

    const totalQty = items.reduce((s, i) => s + i.totalQuantity, 0);
    const totalAlloc = items.reduce((s, i) => s + getAllocated(i), 0);
    const totalAvail = totalQty - totalAlloc;
    const utilPct = totalQty > 0 ? Math.round((totalAlloc / totalQty) * 100) : 0;

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleAddItem = useCallback((data: Omit<InventoryItem, 'id' | 'allocations'>) => {
        const newItem: InventoryItem = {
            id: `inv-${Date.now()}`,
            allocations: [],
            ...data,
        };
        setItems(prev => [...prev, newItem]);
    }, []);

    const handleEditItem = useCallback((updated: InventoryItem) => {
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        if (selectedItem?.id === updated.id) setSelectedItem(updated);
    }, [selectedItem]);

    const handleAllocate = useCallback((itemId: string, eventId: string, qty: number) => {
        setItems(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            const existing = item.allocations.find(a => a.eventId === eventId);
            let newAllocations: EventInventoryAllocation[];
            if (existing) {
                newAllocations = item.allocations.map(a =>
                    a.eventId === eventId
                        ? { ...a, quantityAllocated: a.quantityAllocated + qty }
                        : a,
                );
            } else {
                newAllocations = [...item.allocations, { eventId, inventoryItemId: itemId, quantityAllocated: qty }];
            }
            return { ...item, allocations: newAllocations };
        }));
    }, []);

    const ctx: InventoryCtx = {
        items: filtered,
        onRowClick: setSelectedItem,
        onEdit: setEditItem,
        onAllocate: setAllocateItem,
    };

    return (
        <div>
            {/* Topbar */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <h1>Inventory Dashboard</h1>
                    <p>Manage inventory, track utilization, and allocate resources across events.</p>
                </div>
                <div className="vl-topbar-actions">
                    <div className="vl-search">
                        <Search size={14} />
                        <input
                            placeholder="Search items…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <CustomDropdown
                        options={CAT_FILTER_OPTIONS}
                        value={catFilter}
                        onChange={(v) => setCatFilter(v as InventoryCategory | 'ALL')}
                    />
                    <button className="vl-btn-primary" onClick={() => setAddOpen(true)}>
                        <Plus size={15} /> Add Item
                    </button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="vl-content" style={{ paddingBottom: 0 }}>
                <div className="vi-kpi-grid">
                    <KpiCard label="Total Items" value={items.length} sub="Across all categories" />
                    <KpiCard label="Total Qty" value={totalQty.toLocaleString()} sub="Cumulative units" />
                    <KpiCard label="Allocated" value={totalAlloc.toLocaleString()} sub={`Across ${MOCK_EVENTS.length} events`} />
                    <KpiCard label="Available" value={totalAvail.toLocaleString()} sub="Ready to deploy" />
                    <KpiCard
                        label="Utilization" value={`${utilPct}%`}
                        sub={utilPct >= 75 ? '⚠ High utilization' : 'Healthy capacity'}
                        gold={utilPct >= 75} utilPct={utilPct}
                    />
                </div>
            </div>

            {/* Sub-route tab bar */}
            <div className="vl-subtabs">
                {TABS.map(t => (
                    <NavLink
                        key={t.to}
                        to={t.to}
                        end={t.end}
                        className={({ isActive }) => `vl-subtab${isActive ? ' active' : ''}`}
                    >
                        {t.icon} {t.label}
                    </NavLink>
                ))}
            </div>

            {/* Nested route content */}
            <div className="vl-content" style={{ animation: 'vl-fadein 0.25s ease' }}>
                <Outlet context={ctx satisfies InventoryCtx} />
            </div>

            {/* Drawer */}
            {selectedItem && (
                <ItemDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}

            {/* Modals */}
            {addOpen && (
                <AddItemModal onClose={() => setAddOpen(false)} onSave={handleAddItem} />
            )}
            {editItem && (
                <EditItemModal item={editItem} onClose={() => setEditItem(null)} onSave={handleEditItem} />
            )}
            {allocateItem && (
                <AllocateModal item={allocateItem} onClose={() => setAllocateItem(null)} onConfirm={handleAllocate} />
            )}
        </div>
    );
};

export default InventoryLayout;
