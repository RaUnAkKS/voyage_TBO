import { useState, useCallback } from 'react';
import { TrendPoint } from './analyticsData';

interface Props { data: TrendPoint[]; }

const W = 700;
const H = 220;
const PAD = { top: 20, right: 20, bottom: 36, left: 44 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

const smooth = (pts: [number, number][]): string => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        const cpx = (x0 + x1) / 2;
        d += ` C ${cpx} ${y0}, ${cpx} ${y1}, ${x1} ${y1}`;
    }
    return d;
};

const UtilizationTrendChart = ({ data }: Props) => {
    const [tip, setTip] = useState({ visible: false, x: 0, y: 0, month: '', util: 0 });

    const maxUtil = Math.max(...data.map(d => d.utilPct), 0) + 10;
    const step = PW / Math.max(data.length - 1, 1);

    const pts: [number, number][] = data.map((d, i) => [
        PAD.left + i * step,
        PAD.top + PH - (d.utilPct / maxUtil) * PH,
    ]);

    // Area path: line points + close to baseline
    const areaPath = pts.length
        ? smooth(pts) + ` L ${pts[pts.length - 1][0]} ${PAD.top + PH} L ${pts[0][0]} ${PAD.top + PH} Z`
        : '';

    const yTicks = [0, 25, 50, 75, 100].filter(v => v <= maxUtil);

    const showTip = useCallback((e: React.MouseEvent, d: TrendPoint) => {
        setTip({ visible: true, x: e.clientX + 12, y: e.clientY - 8, month: d.month, util: d.utilPct });
    }, []);
    const hideTip = useCallback(() => setTip(t => ({ ...t, visible: false })), []);

    return (
        <>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="va-area-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6A75E" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#C6A75E" stopOpacity="0.00" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid */}
                {yTicks.map(tick => {
                    const y = PAD.top + PH - (tick / maxUtil) * PH;
                    return (
                        <g key={tick}>
                            <line x1={PAD.left} y1={y} x2={PAD.left + PW} y2={y} className="va-grid-line" />
                            <text x={PAD.left - 6} y={y + 4} textAnchor="end" className="va-y-label">{tick}%</text>
                        </g>
                    );
                })}

                {/* Baseline */}
                <line
                    x1={PAD.left} y1={PAD.top + PH}
                    x2={PAD.left + PW} y2={PAD.top + PH}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={1}
                />

                {/* Area fill */}
                <path d={areaPath} className="va-line-area" />

                {/* Line */}
                <path d={smooth(pts)} className="va-line-path" filter="url(#glow)" />

                {/* Dots + x labels */}
                {data.map((d, i) => {
                    const [x, y] = pts[i];
                    return (
                        <g key={d.month} style={{ animationDelay: `${0.8 + i * 0.08}s` }}>
                            <circle
                                cx={x} cy={y} r={5}
                                className="va-line-dot"
                                filter="url(#glow)"
                                onMouseEnter={e => showTip(e, d)}
                                onMouseLeave={hideTip}
                                onMouseMove={e => setTip(t => ({ ...t, x: e.clientX + 12, y: e.clientY - 8 }))}
                            />
                            <text x={x} y={PAD.top + PH + 18} textAnchor="middle" className="va-x-label">{d.month}</text>
                        </g>
                    );
                })}
            </svg>

            {/* Tooltip */}
            {tip.visible && (
                <div className="va-tooltip" style={{ left: tip.x, top: tip.y }}>
                    <div className="va-tooltip-label">{tip.month}</div>
                    <div>Utilization: <strong style={{ color: '#C6A75E' }}>{tip.util}%</strong></div>
                </div>
            )}
        </>
    );
};

export default UtilizationTrendChart;
