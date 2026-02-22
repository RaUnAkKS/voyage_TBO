import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsKPIProps {
    utilPct: number;
    activeEvents: number;
    revenueLakh: number;
    lowCapacity: number;
}

const AnalyticsKPI = ({ utilPct, activeEvents, revenueLakh, lowCapacity }: AnalyticsKPIProps) => {
    const cards = [
        {
            label: 'Overall Utilization',
            value: `${utilPct}%`,
            gold: utilPct >= 60,
            bar: utilPct,
            trend: { dir: utilPct >= 50 ? 'up' : 'warn', label: utilPct >= 50 ? '+12% vs last month' : 'Below 50%' },
        },
        {
            label: 'Active Events',
            value: activeEvents,
            sub: 'Currently consuming inventory',
            trend: { dir: 'up', label: '' },
            icon: '📅',
        },
        {
            label: 'Revenue Pipeline',
            value: `₹${revenueLakh}L`,
            sub: 'Across all active events',
            gold: true,
            trend: { dir: 'up', label: '' },
            icon: '💰',
        },
        {
            label: 'Low Capacity Alerts',
            value: `${lowCapacity} items`,
            sub: 'Below 20% availability',
            trend: { dir: lowCapacity > 0 ? 'warn' : 'up', label: '' },
            icon: lowCapacity > 0 ? '⚠️' : '✅',
        },
    ];

    return (
        <div className="va-kpi-grid">
            {cards.map((c, i) => (
                <div className="va-kpi-card" key={i}>
                    {/* Trend Badge */}
                    {c.trend.label && (
                        <div className={`va-kpi-trend ${c.trend.dir}`}>
                            {c.trend.dir === 'up'
                                ? <TrendingUp size={11} />
                                : <TrendingDown size={11} />}
                            {c.trend.label}
                        </div>
                    )}

                    <div className="va-kpi-label">{c.label}</div>
                    <div className={`va-kpi-value${c.gold ? ' gold' : ''}`}>{c.value}</div>
                    {c.sub && <div className="va-kpi-sub">{c.sub}</div>}

                    {/* Utilization bar on first card */}
                    {c.bar !== undefined && (
                        <div className="va-kpi-bar">
                            <div
                                className="va-kpi-bar-fill"
                                style={{ width: `${Math.min(c.bar, 100)}%` }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AnalyticsKPI;
