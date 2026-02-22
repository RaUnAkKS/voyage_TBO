import { useState, useRef, useCallback } from 'react';
import { TrendPoint } from './analyticsData';

interface Props { data: TrendPoint[]; }

const W = 700;
const H = 220;
const PAD = { top: 30, right: 30, bottom: 40, left: 50 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

// Refined smooth monotone curve logic
const smoothLine = (pts: [number, number][]): string => {
    if (pts.length < 2) return '';
    if (pts.length === 2) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        const cp1x = x0 + (x1 - x0) / 3;
        const cp2x = x0 + (2 * (x1 - x0)) / 3;
        d += ` C ${cp1x} ${y0}, ${cp2x} ${y1}, ${x1} ${y1}`;
    }
    return d;
};

const UtilizationTrendChart = ({ data }: Props) => {
    const [tip, setTip] = useState({ visible: false, x: 0, y: 0, label: '', util: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const maxUtil = Math.max(...data.map(d => d.utilPct), 0) + 10;
    const step = PW / Math.max(data.length - 1, 1);

    const pts: [number, number][] = data.map((d, i) => [
        PAD.left + i * step,
        PAD.top + PH - (d.utilPct / maxUtil) * PH,
    ]);

    const linePath = smoothLine(pts);
    const areaPath = pts.length
        ? linePath + ` L ${pts[pts.length - 1][0]} ${PAD.top + PH} L ${pts[0][0]} ${PAD.top + PH} Z`
        : '';

    const yTicks = [0, 25, 50, 75, 100].filter(v => v <= maxUtil);

    const showTip = useCallback((e: React.MouseEvent, d: TrendPoint) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTip({
            visible: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            label: d.label,
            util: d.utilPct
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
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="va-area-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6A75E" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#C6A75E" stopOpacity="0.00" />
                    </linearGradient>
                    <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Grid */}
                {yTicks.map(tick => {
                    const y = PAD.top + PH - (tick / maxUtil) * PH;
                    return (
                        <g key={tick}>
                            <line x1={PAD.left} y1={y} x2={PAD.left + PW} y2={y} className="va-grid-line" />
                            <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="va-y-label">{tick}%</text>
                        </g>
                    );
                })}

                {/* Baseline */}
                <line
                    x1={PAD.left} y1={PAD.top + PH}
                    x2={PAD.left + PW} y2={PAD.top + PH}
                    stroke="rgba(255,255,255,0.06)" strokeWidth={1}
                />

                {/* Area fill */}
                <path d={areaPath} fill="url(#va-area-gradient)" style={{ transition: 'all 0.4s' }} />

                {/* Line */}
                <path d={linePath} className="va-line-path" filter="url(#glow-line)" />

                {/* Interactive points */}
                {data.map((d, i) => {
                    const [x, y] = pts[i];
                    return (
                        <g key={`${d.label}-${i}`}>
                            <circle
                                cx={x} cy={y} r={4}
                                fill="#C6A75E"
                                stroke="#1E1E1E"
                                strokeWidth={2}
                                style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                                onMouseEnter={e => showTip(e, d)}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                            />
                            <text
                                x={x} y={PAD.top + PH + 18}
                                textAnchor="middle"
                                className="va-x-label"
                                style={{ opacity: 0.6 }}
                            >
                                {d.label}
                            </text>
                            {/* Larger hover target */}
                            <rect
                                x={x - 15} y={PAD.top}
                                width={30} height={PH}
                                fill="transparent"
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => showTip(e, d)}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Tooltip */}
            {tip.visible && (
                <div className="va-tooltip" style={{ left: tip.x, top: tip.y }}>
                    <div className="va-tooltip-label">{tip.label} Readiness</div>
                    <div>Avg Utilization: <strong style={{ color: '#C6A75E' }}>{tip.util}%</strong></div>
                    <div style={{ fontSize: '0.65rem', color: '#525252', marginTop: '4px' }}>Based on projected inventory usage</div>
                </div>
            )}
        </div>
    );
};

export default UtilizationTrendChart;
