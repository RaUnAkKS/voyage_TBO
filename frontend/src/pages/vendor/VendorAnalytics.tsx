import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { MOCK_INVENTORY, MOCK_EVENTS, InventoryCategory } from '../../mockData/inventoryData';
import {
    getCategoryStats,
    getGlobalKpis,
    getEventPerformance,
    getTrendData,
    getDateRange,
} from './analytics/analyticsData';
import AnalyticsKPI from './analytics/AnalyticsKPI';
import InventoryCategoryChart from './analytics/InventoryCategoryChart';
import InventoryDonutChart from './analytics/InventoryDonutChart';
import UtilizationTrendChart from './analytics/UtilizationTrendChart';
import EventPerformanceTable from './analytics/EventPerformanceTable';
import '../../styles/VendorAnalytics.css';
import '../../styles/VendorLayout.css';

const DATE_RANGES = ['Last 30 days', '3 months', '6 months', '1 year'] as const;
const CATEGORIES: (InventoryCategory | 'ALL')[] = [
    'ALL', 'TECHNICAL', 'FURNITURE', 'DECOR', 'STAFF',
    'CATERING', 'ACCOMMODATION', 'FLOOR_SPACE',
];

const VendorAnalytics = () => {
    const [dateRange, setDateRange] = useState<typeof DATE_RANGES[number]>('6 months');
    const [catFilter, setCatFilter] = useState<InventoryCategory | 'ALL'>('ALL');

    // Centralized Analytics State
    const analytics = useMemo(() => {
        const { start, end } = getDateRange(dateRange);

        // 1. Filter events by date range
        const filteredEvents = MOCK_EVENTS.filter(e => {
            const d = new Date(e.date);
            return d >= start && d <= end;
        });

        // 2. Filter inventory by category
        const filteredItems = catFilter === 'ALL'
            ? MOCK_INVENTORY
            : MOCK_INVENTORY.filter(i => i.category === catFilter);

        // 3. Derive complex data
        const catStats = getCategoryStats(filteredItems, filteredEvents);
        const kpis = getGlobalKpis(filteredItems, filteredEvents);
        const evtPerf = getEventPerformance(filteredItems, filteredEvents);
        const trendData = getTrendData(dateRange, filteredItems, filteredEvents);

        return {
            catStats,
            kpis,
            evtPerf,
            trendData
        };
    }, [dateRange, catFilter]);

    const { catStats, kpis, evtPerf, trendData } = analytics;
    const hasInventory = MOCK_INVENTORY.length > 0;

    return (
        <div>
            {/* ── Topbar ──────────────────────────────────── */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <h1>Capacity Analytics</h1>
                    <p>Visual insights into inventory utilization, capacity trends, and event performance.</p>
                </div>
                <div className="vl-topbar-actions va-filters">
                    {/* Date range chips */}
                    <div className="va-filter-chips">
                        {DATE_RANGES.map(r => (
                            <button
                                key={r}
                                className={`va-chip${dateRange === r ? ' active' : ''}`}
                                onClick={() => setDateRange(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    {/* Category filter */}
                    <select
                        className="va-select"
                        value={catFilter}
                        onChange={e => setCatFilter(e.target.value as InventoryCategory | 'ALL')}
                    >
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>
                                {c === 'ALL' ? 'All Categories' : c.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                    {/* Export */}
                    <button className="va-btn-export">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            <div className="va-content">
                {/* ── KPI Cards ───────────────────────────────── */}
                <AnalyticsKPI
                    utilPct={kpis.utilPct}
                    activeEvents={kpis.activeEvents}
                    revenueLakh={kpis.revenueLakh}
                    lowCapacity={kpis.lowCapacity}
                />

                {/* ── Row 1: Bar + Donut ──────────────────────── */}
                <div className="va-chart-row two-col">
                    <div className="va-chart-card">
                        <div className="va-chart-card-header">
                            <div>
                                <p className="va-chart-title">Inventory by Category</p>
                                <p className="va-chart-sub">Total quantity vs allocated units per category</p>
                            </div>
                        </div>
                        {catStats.length > 0
                            ? <InventoryCategoryChart data={catStats} />
                            : <div className="va-empty" style={{ minHeight: 220 }}>No data for selected filter.</div>}
                    </div>

                    <div className="va-chart-card">
                        <div className="va-chart-card-header">
                            <div>
                                <p className="va-chart-title">Inventory Distribution</p>
                                <p className="va-chart-sub">Percentage share of total stock by category</p>
                            </div>
                        </div>
                        {catStats.length > 0
                            ? <InventoryDonutChart data={catStats} />
                            : <div className="va-empty" style={{ minHeight: 220 }}>No data for selected filter.</div>}
                    </div>
                </div>

                {/* ── Row 2: Trend Line (full width) ─────────── */}
                <div className="va-chart-row one-col">
                    <div className="va-chart-card">
                        <div className="va-chart-card-header">
                            <div>
                                <p className="va-chart-title">Utilization Trend ({dateRange})</p>
                                <p className="va-chart-sub">Month-over-month inventory utilization across all categories</p>
                            </div>
                        </div>
                        {hasInventory
                            ? <UtilizationTrendChart data={trendData} />
                            : <div className="va-empty" style={{ minHeight: 180 }}>No inventory items in system.</div>}
                    </div>
                </div>

                {/* ── Event Performance Table ─────────────────── */}
                <div className="va-chart-card">
                    <div className="va-chart-card-header">
                        <div>
                            <p className="va-chart-title">Event Capacity Performance</p>
                            <p className="va-chart-sub">Utilization, revenue, and status per event</p>
                        </div>
                    </div>
                    {evtPerf.length > 0
                        ? <EventPerformanceTable data={evtPerf} />
                        : <div className="va-empty">No event performance data available for this range.</div>}
                </div>
            </div>
        </div>
    );
};

export default VendorAnalytics;
