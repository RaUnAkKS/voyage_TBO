import { useState, useRef, useCallback } from 'react';
import { CatStat } from './analyticsData';

interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    label: string;
    total: number;
    allocated: number;
    utilPct: number;
}

interface Props { data: CatStat[]; }

const SVG_W = 500;
const SVG_H = 260; // Increased height for rotated labels
const PAD = { top: 20, right: 20, bottom: 65, left: 50 }; // Increased padding
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

const InventoryCategoryChart = ({ data }: Props) => {
    const [tip, setTip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', total: 0, allocated: 0, utilPct: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const maxQty = Math.max(...data.map(d => d.totalQty), 1);
    const yTicks = [0, 25, 50, 75, 100].map(pct => Math.round(maxQty * pct / 100));
    const groupW = data.length > 0 ? PLOT_W / data.length : PLOT_W;
    const barW = Math.min(groupW * 0.35, 24);
    const gap = barW * 0.5;

    const showTip = useCallback((e: React.MouseEvent, d: CatStat) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTip({
            visible: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            label: d.cat,
            total: d.totalQty,
            allocated: d.allocated,
            utilPct: d.utilPct
        });
    }, []);

    const moveTip = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTip(t => ({ ...t, x: e.clientX - rect.left, y: e.clientY - rect.top }));
    }, []);
    const hideTip = useCallback(() => setTip(t => ({ ...t, visible: false })), []);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                width="100%"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id="bar-alloc-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8C97A" />
                        <stop offset="100%" stopColor="#C6A75E" />
                    </linearGradient>
                </defs>

                {/* Y gridlines */}
                {yTicks.map(tick => {
                    const y = PAD.top + PLOT_H - (tick / maxQty) * PLOT_H;
                    return (
                        <g key={tick}>
                            <line x1={PAD.left} y1={y} x2={PAD.left + PLOT_W} y2={y} className="va-grid-line" />
                            <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="va-y-label">{tick}</text>
                        </g>
                    );
                })}

                {/* X baseline */}
                <line
                    x1={PAD.left} y1={PAD.top + PLOT_H}
                    x2={PAD.left + PLOT_W} y2={PAD.top + PLOT_H}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={1}
                />

                {/* Bars */}
                {data.map((d, i) => {
                    const cx = PAD.left + i * groupW + groupW / 2;
                    const totalH = (d.totalQty / maxQty) * PLOT_H;
                    const allocH = (d.allocated / maxQty) * PLOT_H;
                    const xTotal = cx - barW - gap / 2;
                    const xAlloc = cx + gap / 2;
                    const yTotal = PAD.top + PLOT_H - totalH;
                    const yAlloc = PAD.top + PLOT_H - allocH;

                    const label = d.cat.length > 12 ? d.cat.slice(0, 10) + '…' : d.cat;

                    return (
                        <g key={d.cat}>
                            {/* Total bar - Muted Gold */}
                            <rect
                                x={xTotal} y={yTotal}
                                width={barW} height={totalH}
                                fill="rgba(198,167,94,0.15)"
                                rx={2}
                                style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                                onMouseEnter={e => showTip(e, d)}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                            />
                            {/* Allocated bar - Bright Gold */}
                            <rect
                                x={xAlloc} y={yAlloc}
                                width={barW} height={allocH}
                                fill="url(#bar-alloc-grad)"
                                rx={2}
                                style={{ cursor: 'pointer', transition: 'filter 0.2s' }}
                                onMouseEnter={e => showTip(e, d)}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                            />
                            {/* Category label - Rotated */}
                            <text
                                x={cx}
                                y={PAD.top + PLOT_H + 12}
                                textAnchor="end"
                                className="va-x-label"
                                transform={`rotate(-30, ${cx}, ${PAD.top + PLOT_H + 12})`}
                                style={{ opacity: 0.7, fontSize: '10px' }}
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="va-legend" style={{ marginTop: '0.5rem', paddingLeft: PAD.left }}>
                <div className="va-legend-item">
                    <div className="va-legend-dot" style={{ background: 'rgba(198,167,94,0.15)' }} />
                    Total Quantity
                </div>
                <div className="va-legend-item">
                    <div className="va-legend-dot" style={{ background: '#C6A75E' }} />
                    Allocated Resources
                </div>
            </div>

            {/* Tooltip */}
            {tip.visible && (
                <div className="va-tooltip" style={{ left: tip.x, top: tip.y }}>
                    <div className="va-tooltip-label">{tip.label.replace('_', ' ')}</div>
                    <div>Total: <span style={{ color: '#FFF' }}>{tip.total.toLocaleString()}</span></div>
                    <div>Allocated: <span style={{ color: '#FFF' }}>{tip.allocated.toLocaleString()}</span></div>
                    <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>
                        Utilization: <strong style={{ color: '#C6A75E' }}>{tip.utilPct}%</strong>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryCategoryChart;
