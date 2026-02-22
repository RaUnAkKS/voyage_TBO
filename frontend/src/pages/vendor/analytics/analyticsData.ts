import { MOCK_INVENTORY, MOCK_EVENTS } from '../../../mockData/inventoryData';
import { getAllocated, getAvailable } from '../inventory/InventoryLayout';

// ── Category breakdown ────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
    TECHNICAL: '#C6A75E',
    FURNITURE: '#9A7A35',
    DECOR: '#E8C97A',
    STAFF: '#A08540',
    CATERING: '#D4A855',
    ACCOMMODATION: '#7A6030',
    FLOOR_SPACE: '#EDCF7A',
};

export interface CatStat {
    cat: string;
    totalQty: number;
    allocated: number;
    available: number;
    utilPct: number;
    color: string;
}

export const getCategoryStats = (catFilter: string): CatStat[] => {
    const items = catFilter === 'ALL'
        ? MOCK_INVENTORY
        : MOCK_INVENTORY.filter(i => i.category === catFilter);

    const map: Record<string, CatStat> = {};
    items.forEach(item => {
        const alloc = getAllocated(item);
        const avail = getAvailable(item);
        if (!map[item.category]) {
            map[item.category] = {
                cat: item.category,
                totalQty: 0,
                allocated: 0,
                available: 0,
                utilPct: 0,
                color: CATEGORY_COLORS[item.category] ?? '#C6A75E',
            };
        }
        map[item.category].totalQty += item.totalQuantity;
        map[item.category].allocated += alloc;
        map[item.category].available += avail;
    });

    return Object.values(map).map(s => ({
        ...s,
        utilPct: s.totalQty > 0 ? Math.round((s.allocated / s.totalQty) * 100) : 0,
    }));
};

// ── Global KPIs ───────────────────────────────────────────────────────────────
export const getGlobalKpis = (catFilter: string) => {
    const items = catFilter === 'ALL'
        ? MOCK_INVENTORY
        : MOCK_INVENTORY.filter(i => i.category === catFilter);

    const totalQty = items.reduce((s, i) => s + i.totalQuantity, 0);
    const totalAlloc = items.reduce((s, i) => s + getAllocated(i), 0);
    const utilPct = totalQty > 0 ? Math.round((totalAlloc / totalQty) * 100) : 0;

    const activeEvents = MOCK_EVENTS.filter(e =>
        items.some(i => i.allocations.some(a => a.eventId === e.id))
    ).length;

    const lowCapacity = items.filter(i => {
        const avail = getAvailable(i);
        return avail < i.totalQuantity * 0.2;
    }).length;

    // Mock revenue — ₹2400 per allocated unit
    const revenueLakh = Math.round((totalAlloc * 2400) / 100000 * 10) / 10;

    return { utilPct, activeEvents, revenueLakh, lowCapacity };
};

// ── Event performance ─────────────────────────────────────────────────────────
export interface EventPerf {
    id: string;
    name: string;
    type: string;
    totalAllocated: number;
    utilPct: number;
    revenueLakh: number;
    isActive: boolean;
}

export const getEventPerformance = (catFilter: string): EventPerf[] => {
    const items = catFilter === 'ALL'
        ? MOCK_INVENTORY
        : MOCK_INVENTORY.filter(i => i.category === catFilter);

    return MOCK_EVENTS.map(evt => {
        let totalAlloc = 0;
        let totalQty = 0;

        items.forEach(item => {
            const a = item.allocations.find(al => al.eventId === evt.id);
            if (a) {
                totalAlloc += a.quantityAllocated;
                totalQty += item.totalQuantity;
            }
        });

        const utilPct = totalQty > 0 ? Math.round((totalAlloc / totalQty) * 100) : 0;
        const revenueLakh = Math.round((totalAlloc * 2400) / 100000 * 10) / 10;
        const isActive = new Date(evt.date) >= new Date('2025-03-01');

        return {
            id: evt.id,
            name: evt.name,
            type: evt.type,
            totalAllocated: totalAlloc,
            utilPct,
            revenueLakh,
            isActive,
        };
    }).filter(e => e.totalAllocated > 0);
};

// ── Trend data (6 months mock) ────────────────────────────────────────────────
export interface TrendPoint { month: string; utilPct: number; }

export const getTrendData = (): TrendPoint[] => [
    { month: 'Sep', utilPct: 24 },
    { month: 'Oct', utilPct: 31 },
    { month: 'Nov', utilPct: 28 },
    { month: 'Dec', utilPct: 45 },
    { month: 'Jan', utilPct: 38 },
    { month: 'Feb', utilPct: 53 },
];
