import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { InventoryCategory } from '../../mockData/inventoryData';
import {
    getCategoryStats,
    getGlobalKpis,
    getEventPerformance,
    getTrendData,
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

    const catStats = useMemo(() => getCategoryStats(catFilter), [catFilter]);
    const kpis = useMemo(() => getGlobalKpis(catFilter), [catFilter]);
    const evtPerf = useMemo(() => getEventPerformance(catFilter), [catFilter]);
    const trendData = useMemo(() => getTrendData(), []);

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
                        <UtilizationTrendChart data={trendData} />
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
                    <EventPerformanceTable data={evtPerf} />
                </div>
            </div>
        </div>
    );
};

export default VendorAnalytics;
