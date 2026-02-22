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
const SVG_H = 220;
const PAD = { top: 20, right: 20, bottom: 40, left: 44 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

const InventoryCategoryChart = ({ data }: Props) => {
    const [tip, setTip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', total: 0, allocated: 0, utilPct: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    const maxQty = Math.max(...data.map(d => d.totalQty), 1);
    const yTicks = [0, 25, 50, 75, 100].map(pct => Math.round(maxQty * pct / 100));
    const groupW = data.length > 0 ? PLOT_W / data.length : PLOT_W;
    const barW = Math.min(groupW * 0.35, 28);
    const gap = barW * 0.6;

    const showTip = useCallback((e: React.MouseEvent, d: CatStat) => {
        setTip({ visible: true, x: e.clientX + 12, y: e.clientY - 8, label: d.cat, total: d.totalQty, allocated: d.allocated, utilPct: d.utilPct });
    }, []);
    const moveTip = useCallback((e: React.MouseEvent) => {
        setTip(t => ({ ...t, x: e.clientX + 12, y: e.clientY - 8 }));
    }, []);
    const hideTip = useCallback(() => setTip(t => ({ ...t, visible: false })), []);

    return (
        <>
            <svg
                ref={svgRef}
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
                            <text x={PAD.left - 6} y={y + 4} textAnchor="end" className="va-y-label">{tick}</text>
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

                    return (
                        <g key={d.cat}>
                            {/* Total bar */}
                            <rect
                                x={xTotal} y={yTotal}
                                width={barW} height={totalH}
                                fill="rgba(198,167,94,0.2)"
                                rx={3}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => showTip(e, d)}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                            />
                            {/* Allocated bar */}
                            <rect
                                x={xAlloc} y={yAlloc}
                                width={barW} height={allocH}
                                fill="url(#bar-alloc-grad)"
                                rx={3}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => showTip(e, d)}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                            />
                            {/* Category label */}
                            <text
                                x={cx}
                                y={PAD.top + PLOT_H + 16}
                                textAnchor="middle"
                                className="va-x-label"
                                fontSize="9"
                            >
                                {d.cat.length > 9 ? d.cat.slice(0, 7) + '…' : d.cat}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="va-legend" style={{ marginTop: '1rem' }}>
                <div className="va-legend-item">
                    <div className="va-legend-dot" style={{ background: 'rgba(198,167,94,0.2)' }} />
                    Total Quantity
                </div>
                <div className="va-legend-item">
                    <div className="va-legend-dot" style={{ background: '#C6A75E' }} />
                    Allocated
                </div>
            </div>

            {/* Tooltip */}
            {tip.visible && (
                <div className="va-tooltip" style={{ left: tip.x, top: tip.y, position: 'fixed' }}>
                    <div className="va-tooltip-label">{tip.label.replace('_', ' ')}</div>
                    <div>Total: {tip.total.toLocaleString()} units</div>
                    <div>Allocated: {tip.allocated.toLocaleString()} units</div>
                    <div>Utilization: <strong style={{ color: '#C6A75E' }}>{tip.utilPct}%</strong></div>
                </div>
            )}
        </>
    );
};

export default InventoryCategoryChart;
