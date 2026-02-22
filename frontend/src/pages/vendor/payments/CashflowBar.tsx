import { PaymentSummary, formatINR } from '../../../mockData/paymentsData';

interface Props { summary: PaymentSummary; }

const CashflowBar = ({ summary }: Props) => {
    const { releasedPct, eligiblePct, pendingPct, released, eligible, pending, overdue } = summary;

    return (
        <div className="pm-section">
            <p className="pm-section-title">Cashflow Overview</p>

            {/* Stacked bar */}
            <div className="pm-cf-bar-wrap">
                <div
                    className="pm-cf-segment released"
                    style={{ width: `${releasedPct}%` }}
                    title={`Released: ${releasedPct.toFixed(1)}%`}
                />
                <div
                    className="pm-cf-segment eligible"
                    style={{ width: `${eligiblePct}%` }}
                    title={`Eligible: ${eligiblePct.toFixed(1)}%`}
                />
                <div
                    className="pm-cf-segment pending"
                    style={{ width: `${pendingPct}%` }}
                    title={`Pending/Overdue: ${pendingPct.toFixed(1)}%`}
                />
            </div>

            {/* Legend */}
            <div className="pm-cf-legend">
                <div className="pm-cf-legend-item">
                    <span className="pm-cf-dot released" />
                    Released
                    <span className="pm-cf-legend-val">{formatINR(released)}</span>
                    <span style={{ color: '#525252' }}>({releasedPct.toFixed(0)}%)</span>
                </div>
                <div className="pm-cf-legend-item">
                    <span className="pm-cf-dot eligible" />
                    Eligible
                    <span className="pm-cf-legend-val">{formatINR(eligible)}</span>
                    <span style={{ color: '#525252' }}>({eligiblePct.toFixed(0)}%)</span>
                </div>
                <div className="pm-cf-legend-item">
                    <span className="pm-cf-dot pending" />
                    Pending / Overdue
                    <span className="pm-cf-legend-val">{formatINR(pending + overdue)}</span>
                    <span style={{ color: '#525252' }}>({pendingPct.toFixed(0)}%)</span>
                </div>
            </div>
        </div>
    );
};

export default CashflowBar;
