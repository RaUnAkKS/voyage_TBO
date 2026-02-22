import { Wallet, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { PaymentSummary, formatINR } from '../../../mockData/paymentsData';

interface Props { summary: PaymentSummary; }

const CARDS = (s: PaymentSummary) => [
    {
        cls: 'gold',
        icon: <Wallet size={18} />,
        label: 'Total Expected',
        value: formatINR(s.totalExpected),
        sub: 'Across all active events',
    },
    {
        cls: 'green',
        icon: <CheckCircle2 size={18} />,
        label: 'Released',
        value: formatINR(s.released),
        sub: `${s.releasedPct.toFixed(0)}% of total`,
    },
    {
        cls: 'blue',
        icon: <Clock size={18} />,
        label: 'Eligible',
        value: formatINR(s.eligible),
        sub: `${s.eligiblePct.toFixed(0)}% of total`,
    },
    {
        cls: 'orange',
        icon: <AlertCircle size={18} />,
        label: 'Pending / Overdue',
        value: formatINR(s.pending + s.overdue),
        sub: `${s.pendingPct.toFixed(0)}% of total`,
    },
];

const PaymentKPICards = ({ summary }: Props) => (
    <div className="pm-kpi-grid">
        {CARDS(summary).map(c => (
            <div className={`pm-kpi-card ${c.cls}`} key={c.label}>
                <div className={`pm-kpi-icon ${c.cls}`}>{c.icon}</div>
                <div className="pm-kpi-label">{c.label}</div>
                <div className={`pm-kpi-value ${c.cls}`}>{c.value}</div>
                <div className="pm-kpi-sub">{c.sub}</div>
            </div>
        ))}
    </div>
);

export default PaymentKPICards;
