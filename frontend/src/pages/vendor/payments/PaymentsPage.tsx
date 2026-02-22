import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import {
    MOCK_PAYMENTS, getPaymentSummary, filterByDateRange, DateRange,
} from '../../../mockData/paymentsData';
import PaymentKPICards from './PaymentKPICards';
import CashflowBar from './CashflowBar';
import PaymentsTable from './PaymentsTable';
import '../../../styles/Payments.css';
import '../../../styles/VendorLayout.css';

const RANGES: { label: string; value: DateRange }[] = [
    { label: 'Last 30 days', value: '30d' },
    { label: '3 months', value: '3m' },
    { label: '6 months', value: '6m' },
];

const PaymentsPage = () => {
    const [range, setRange] = useState<DateRange>('6m');

    const payments = useMemo(
        () => filterByDateRange(MOCK_PAYMENTS, range),
        [range],
    );

    const summary = useMemo(() => getPaymentSummary(payments), [payments]);

    return (
        <div>
            {/* ── Topbar ── */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <h1>Payments &amp; Cashflow</h1>
                    <p>Track milestone-linked payments, cashflow, and payout status across events.</p>
                </div>
                <div className="vl-topbar-actions" style={{ gap: '0.75rem' }}>
                    {/* Date range toggle */}
                    <div className="pm-range-toggle">
                        {RANGES.map(r => (
                            <button
                                key={r.value}
                                className={`pm-range-btn${range === r.value ? ' active' : ''}`}
                                onClick={() => setRange(r.value)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <button className="va-btn-export">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            <div className="pm-content">
                {/* ── KPI Cards ── */}
                <PaymentKPICards summary={summary} />

                {/* ── Cashflow Bar ── */}
                <CashflowBar summary={summary} />

                {/* ── Table ── */}
                <PaymentsTable payments={payments} />
            </div>
        </div>
    );
};

export default PaymentsPage;
