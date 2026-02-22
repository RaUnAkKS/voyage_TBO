import { InventoryItem, EventRecord } from '../../../mockData/inventoryData';

// ── Date Helpers ──────────────────────────────────────────────────────────────
export const getDateRange = (range: string) => {
    const end = new Date('2026-12-31'); // Reference end for mock data
    const start = new Date('2026-01-01');

    if (range === 'Last 30 days') {
        start.setMonth(end.getMonth() - 1);
    } else if (range === '3 months') {
        start.setMonth(end.getMonth() - 3);
    } else if (range === '6 months') {
        start.setMonth(end.getMonth() - 6);
    } else {
        start.setFullYear(end.getFullYear() - 1);
    }
    return { start, end };
};

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

export const getCategoryStats = (items: InventoryItem[], events: EventRecord[]): CatStat[] => {
    const map: Record<string, CatStat> = {};

    items.forEach(item => {
        // Only count allocations for events in the filtered range
        const filteredAllocations = item.allocations.filter(a =>
            events.some(e => e.id === a.eventId)
        );

        const allocated = filteredAllocations.reduce((s, a) => s + a.quantityAllocated, 0);
        const available = item.totalQuantity - allocated;

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
        map[item.category].allocated += allocated;
        map[item.category].available += available;
    });

    return Object.values(map)
        .filter(s => s.totalQty > 0)
        .map(s => ({
            ...s,
            utilPct: s.totalQty > 0 ? Math.round((s.allocated / s.totalQty) * 100) : 0,
        }));
};

// ── Global KPIs ───────────────────────────────────────────────────────────────
export const getGlobalKpis = (items: InventoryItem[], events: EventRecord[]) => {
    const totalQty = items.reduce((s, i) => s + i.totalQuantity, 0);
    const totalAlloc = items.reduce((iSum, item) => {
        const allocs = item.allocations.filter(a => events.some(e => e.id === a.eventId));
        return iSum + allocs.reduce((s, a) => s + a.quantityAllocated, 0);
    }, 0);

    const utilPct = totalQty > 0 ? Math.round((totalAlloc / totalQty) * 100) : 0;
    const activeEvents = events.filter(e =>
        items.some(i => i.allocations.some(a => a.eventId === e.id))
    ).length;

    const lowCapacity = items.filter(i => {
        const allocs = i.allocations.filter(a => events.some(e => e.id === a.eventId));
        const used = allocs.reduce((s, a) => s + a.quantityAllocated, 0);
        return (i.totalQuantity - used) < i.totalQuantity * 0.2;
    }).length;

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

export const getEventPerformance = (items: InventoryItem[], events: EventRecord[]): EventPerf[] => {
    const today = new Date();

    return events.map(evt => {
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
        const isActive = new Date(evt.date) >= today;

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

// ── Trend data ────────────────────────────────────────────────────────────────
export interface TrendPoint { label: string; utilPct: number; }

export const getTrendData = (
    range: string,
    items: InventoryItem[],
    events: EventRecord[]
): TrendPoint[] => {
    const { start, end } = getDateRange(range);
    const buckets: { date: Date; label: string; alloc: number; total: number }[] = [];

    // 1. Generate Buckets
    if (range === 'Last 30 days') {
        const curr = new Date(start);
        while (curr <= end) {
            buckets.push({
                date: new Date(curr),
                label: curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                alloc: 0,
                total: 0
            });
            curr.setDate(curr.getDate() + 1);
        }
    } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const curr = new Date(start);
        curr.setDate(1); // Start of month
        while (curr <= end) {
            buckets.push({
                date: new Date(curr),
                label: months[curr.getMonth()],
                alloc: 0,
                total: 0
            });
            curr.setMonth(curr.getMonth() + 1);
        }
    }

    // 2. Map Data into Buckets
    events.forEach(evt => {
        const evtDate = new Date(evt.date);

        // Find matching bucket
        let bucketIdx = -1;
        if (range === 'Last 30 days') {
            bucketIdx = buckets.findIndex(b =>
                b.date.getFullYear() === evtDate.getFullYear() &&
                b.date.getMonth() === evtDate.getMonth() &&
                b.date.getDate() === evtDate.getDate()
            );
        } else {
            bucketIdx = buckets.findIndex(b =>
                b.date.getFullYear() === evtDate.getFullYear() &&
                b.date.getMonth() === evtDate.getMonth()
            );
        }

        if (bucketIdx !== -1) {
            items.forEach(i => {
                const a = i.allocations.find(al => al.eventId === evt.id);
                if (a) {
                    buckets[bucketIdx].alloc += a.quantityAllocated;
                    buckets[bucketIdx].total += i.totalQuantity;
                }
            });
        }
    });

    // 3. Convert to TrendPoints
    const result = buckets.map(b => ({
        label: b.label,
        utilPct: b.total > 0 ? Math.round((b.alloc / b.total) * 100) : 0
    }));

    // Ensure minimum 2 points for the chart
    if (result.length < 2 && result.length > 0) {
        return [{ label: '', utilPct: 0 }, ...result];
    }

    return result;
};
