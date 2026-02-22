import { useState, useRef, useCallback } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter out categories with 0 qty just in case
    const validData = data.filter(d => d.totalQty > 0);
    const total = validData.reduce((s, d) => s + d.totalQty, 0);

    if (validData.length === 0) {
        return <div className="va-empty">No distribution data available.</div>;
    }

    // Build segments with minimum visibility threshold (3%)
    const MIN_FRAC = 0.03;
    let rawSegments = validData.map((d, i) => ({
        ...d,
        rawFrac: d.totalQty / total,
        color: GOLD_SHADES[i % GOLD_SHADES.length],
    }));

    // Re-normalize to ensure all slices have at least MIN_FRAC
    const smallSlices = rawSegments.filter(s => s.rawFrac < MIN_FRAC).length;
    const reserved = smallSlices * MIN_FRAC;
    const remaining = 1 - reserved;
    const largeTotal = rawSegments.filter(s => s.rawFrac >= MIN_FRAC).reduce((s, d) => s + d.rawFrac, 0);

    let cumAngle = 0;
    const segments = rawSegments.map(s => {
        const frac = s.rawFrac < MIN_FRAC ? MIN_FRAC : (s.rawFrac / largeTotal) * remaining;
        const sweep = frac * 360;
        const start = cumAngle;
        const end = cumAngle + sweep;
        cumAngle = end;
        return {
            ...s,
            frac,
            start,
            end,
            pct: Math.round(s.rawFrac * 100),
            path: validData.length === 1 ? '' : toPath(start, end),
        };
    });

    const showTip = useCallback((e: React.MouseEvent, s: typeof segments[0]) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTip({
            visible: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            label: s.cat,
            pct: s.pct,
            qty: s.totalQty
        });
    }, []);

    const moveTip = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTip(t => ({ ...t, x: e.clientX - rect.left, y: e.clientY - rect.top }));
    }, []);

    const hideTip = useCallback(() => setTip(t => ({ ...t, visible: false })), []);

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <div className="va-donut-wrap">
                <div className="va-donut-svg-wrap">
                    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                        <circle
                            cx={CX} cy={CY} r={R}
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth={STROKE}
                        />
                        {validData.length === 1 ? (
                            <circle
                                cx={CX} cy={CY} r={R}
                                fill="none"
                                stroke={segments[0].color}
                                strokeWidth={hovered ? STROKE + 4 : STROKE}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    filter: hovered ? `drop-shadow(0 0 10px ${segments[0].color}aa)` : 'none'
                                }}
                                onMouseEnter={e => { setHovered(segments[0].cat); showTip(e, segments[0]); }}
                                onMouseMove={moveTip}
                                onMouseLeave={() => { setHovered(null); hideTip(); }}
                            />
                        ) : (
                            segments.map(s => (
                                <path
                                    key={s.cat}
                                    d={s.path}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={hovered === s.cat ? STROKE + 4 : STROKE}
                                    strokeLinecap="round"
                                    style={{
                                        cursor: 'pointer',
                                        opacity: hovered && hovered !== s.cat ? 0.35 : 1,
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        filter: hovered === s.cat ? `drop-shadow(0 0 10px ${s.color}aa)` : 'none',
                                    }}
                                    onMouseEnter={e => { setHovered(s.cat); showTip(e, s); }}
                                    onMouseMove={moveTip}
                                    onMouseLeave={() => { setHovered(null); hideTip(); }}
                                />
                            ))
                        )}
                    </svg>

                    <div className="va-donut-center-text">
                        <div className="va-donut-center-val">
                            {hovered
                                ? `${segments.find(s => s.cat === hovered)?.pct ?? 0}%`
                                : `${validData.length}`}
                        </div>
                        <div className="va-donut-center-lab">
                            {hovered
                                ? hovered.replace('_', ' ')
                                : validData.length === 1 ? 'Category' : 'Categories'}
                        </div>
                    </div>
                </div>

                <div className="va-donut-legend">
                    {segments.map(s => (
                        <div
                            key={s.cat}
                            className="va-donut-legend-row"
                            style={{
                                opacity: hovered && hovered !== s.cat ? 0.4 : 1,
                                transition: 'opacity 0.2s',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: hovered === s.cat ? 'rgba(255,255,255,0.03)' : 'transparent'
                            }}
                            onMouseEnter={() => setHovered(s.cat)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className="va-donut-legend-dot" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}66` }} />
                            <span className="va-donut-legend-label">{s.cat.replace('_', ' ')}</span>
                            <span className="va-donut-legend-pct">{s.pct}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {tip.visible && (
                <div className="va-tooltip" style={{ left: tip.x, top: tip.y }}>
                    <div className="va-tooltip-label">{tip.label.replace('_', ' ')} Distribution</div>
                    <div>Share: <strong style={{ color: '#C6A75E' }}>{tip.pct}%</strong></div>
                    <div>Resources: <span style={{ color: '#FFF' }}>{tip.qty.toLocaleString()} units</span></div>
                </div>
            )}
        </div>
    );
};

export default InventoryDonutChart;
