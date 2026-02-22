import { MOCK_INVENTORY, MOCK_EVENTS, HEATMAP_DATES, CATEGORY_LIST, InventoryCategory } from '../../../mockData/inventoryData';

const heatIntensity = (pct: number): number => {
    if (pct === 0) return 0;
    if (pct < 20) return 1;
    if (pct < 40) return 2;
    if (pct < 60) return 3;
    if (pct < 80) return 4;
    return 5;
};

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

const InventoryHeatmap = () => (
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
                        {HEATMAP_DATES.map(d => <th key={d} className="vi-hm-date">{d}</th>)}
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
                    {LEGEND.map(l => <div key={l} className={`vi-legend-box vi-hm-${l}`} />)}
                </div>
                <span>High</span>
            </div>
        </div>
    </div>
);

export default InventoryHeatmap;
