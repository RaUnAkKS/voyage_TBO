import { useState, useCallback } from 'react';
import { CatStat } from './analyticsData';

interface Props { data: CatStat[]; }

const SIZE = 180;
const R = 72;
const STROKE = 28;
const CX = SIZE / 2;
const CY = SIZE / 2;

const toPath = (startAngle: number, endAngle: number): string => {
    const r = R;
    const aStart = (startAngle - 90) * (Math.PI / 180);
    const aEnd = (endAngle - 90) * (Math.PI / 180);
    const x1 = CX + r * Math.cos(aStart);
    const y1 = CY + r * Math.sin(aStart);
    const x2 = CX + r * Math.cos(aEnd);
    const y2 = CY + r * Math.sin(aEnd);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

const GOLD_SHADES = [
    '#C6A75E', '#E8C97A', '#A08540', '#D4A855',
    '#EDCF7A', '#9A7A35', '#7A6030',
];

const InventoryDonutChart = ({ data }: Props) => {
    const [hovered, setHovered] = useState<string | null>(null);
    const [tip, setTip] = useState({ visible: false, x: 0, y: 0, label: '', pct: 0, qty: 0 });

    const total = data.reduce((s, d) => s + d.totalQty, 0) || 1;

    // Build segments
    let cumAngle = 0;
    const segments = data.map((d, i) => {
        const frac = d.totalQty / total;
        const sweep = frac * 360;
        const start = cumAngle;
        const end = cumAngle + sweep;
        cumAngle = end;
        return {
            ...d,
            frac,
            start,
            end,
            pct: Math.round(frac * 100),
            path: toPath(start, end),
            color: GOLD_SHADES[i % GOLD_SHADES.length],
        };
    });

    const showTip = useCallback((e: React.MouseEvent, s: typeof segments[0]) => {
        setTip({ visible: true, x: e.clientX + 12, y: e.clientY - 8, label: s.cat, pct: s.pct, qty: s.totalQty });
    }, []);
    const moveTip = useCallback((e: React.MouseEvent) => {
        setTip(t => ({ ...t, x: e.clientX + 12, y: e.clientY - 8 }));
    }, []);
    const hideTip = useCallback(() => setTip(t => ({ ...t, visible: false })), []);

    return (
        <>
            <div className="va-donut-wrap">
                {/* SVG Ring */}
                <div className="va-donut-svg-wrap">
                    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                        {/* Background ring */}
                        <circle
                            cx={CX} cy={CY} r={R}
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth={STROKE}
                        />
                        {segments.map(s => (
                            <path
                                key={s.cat}
                                d={s.path}
                                fill="none"
                                stroke={s.color}
                                strokeWidth={hovered === s.cat ? STROKE + 4 : STROKE}
                                strokeLinecap="round"
                                style={{
                                    cursor: 'pointer',
                                    opacity: hovered && hovered !== s.cat ? 0.4 : 1,
                                    transition: 'all 0.2s ease',
                                    filter: hovered === s.cat ? `drop-shadow(0 0 8px ${s.color}88)` : 'none',
                                }}
                                onMouseEnter={e => { setHovered(s.cat); showTip(e, s); }}
                                onMouseMove={moveTip}
                                onMouseLeave={() => { setHovered(null); hideTip(); }}
                            />
                        ))}
                    </svg>

                    {/* Center text */}
                    <div className="va-donut-center-text">
                        <div className="va-donut-center-val">
                            {hovered
                                ? `${segments.find(s => s.cat === hovered)?.pct ?? 0}%`
                                : `${data.length}`}
                        </div>
                        <div className="va-donut-center-lab">
                            {hovered
                                ? hovered.replace('_', ' ')
                                : 'categories'}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="va-donut-legend">
                    {segments.map(s => (
                        <div
                            key={s.cat}
                            className="va-donut-legend-row"
                            style={{ opacity: hovered && hovered !== s.cat ? 0.4 : 1, transition: 'opacity 0.2s', cursor: 'pointer' }}
                            onMouseEnter={() => setHovered(s.cat)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className="va-donut-legend-dot" style={{ background: s.color }} />
                            <span className="va-donut-legend-label">{s.cat.replace('_', ' ')}</span>
                            <span className="va-donut-legend-pct">{s.pct}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tip.visible && (
                <div className="va-tooltip" style={{ left: tip.x, top: tip.y }}>
                    <div className="va-tooltip-label">{tip.label.replace('_', ' ')}</div>
                    <div>Share: <strong style={{ color: '#C6A75E' }}>{tip.pct}%</strong></div>
                    <div>Total Qty: {tip.qty.toLocaleString()}</div>
                </div>
            )}
        </>
    );
};

export default InventoryDonutChart;
