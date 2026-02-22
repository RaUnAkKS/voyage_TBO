import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Payment, PaymentStatus, formatINR } from '../../../mockData/paymentsData';
import CustomDropdown, { DropdownOption } from '../../../components/vendor/CustomDropdown';
import '../../../styles/CustomDropdown.css';

// ── Status badge ───────────────────────────────────────────────────────────────
const ICONS: Record<PaymentStatus, React.ReactElement> = {
    RELEASED: <CheckCircle2 size={10} />,
    ELIGIBLE: <Clock size={10} />,
    PENDING: <Clock size={10} />,
    OVERDUE: <XCircle size={10} />,
};
const LABELS: Record<PaymentStatus, string> = {
    RELEASED: 'Released', ELIGIBLE: 'Eligible', PENDING: 'Pending', OVERDUE: 'Overdue',
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => (
    <span className={`pm-badge ${status.toLowerCase()}`}>
        {ICONS[status]} {LABELS[status]}
    </span>
);

// ── Filter options ─────────────────────────────────────────────────────────────
const STATUS_OPTS: DropdownOption<PaymentStatus | 'ALL'>[] = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'RELEASED', label: 'Released' },
    { value: 'ELIGIBLE', label: 'Eligible' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'OVERDUE', label: 'Overdue' },
];

// ── Table ──────────────────────────────────────────────────────────────────────
interface Props { payments: Payment[]; }

const PaymentsTable = ({ payments }: Props) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState<PaymentStatus | 'ALL'>('ALL');

    const filtered = payments.filter(p => {
        const q = query.toLowerCase();
        const matchQ = !q || p.eventName.toLowerCase().includes(q)
            || p.eventCode.toLowerCase().includes(q)
            || p.milestoneName.toLowerCase().includes(q);
        const matchS = status === 'ALL' || p.status === status;
        return matchQ && matchS;
    });

    return (
        <div className="pm-section">
            <p className="pm-section-title">Milestone Payments</p>

            {/* Controls */}
            <div className="pm-table-controls">
                <div className="pm-search-wrap">
                    <Search size={14} />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search event, milestone…"
                    />
                </div>
                <CustomDropdown
                    options={STATUS_OPTS}
                    value={status}
                    onChange={setStatus}
                    minWidth="150px"
                />
                <span style={{ fontSize: '0.78rem', color: '#525252', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                    {filtered.length} milestone{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Table */}
            <div className="pm-table-scroll">
                <table className="pm-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Milestone</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#525252' }}>
                                    No payments match your filters.
                                </td>
                            </tr>
                        ) : filtered.map(p => (
                            <tr
                                key={p.id}
                                onClick={() => navigate(`/vendor/payments/${p.eventId}`)}
                                title="View event payment details"
                            >
                                <td>
                                    <strong>{p.eventName}</strong>
                                    <span className="pm-event-code">{p.eventCode} · {p.eventType}</span>
                                </td>
                                <td>{p.milestoneName}</td>
                                <td><span className="pm-amount">{formatINR(p.amountLakh)}</span></td>
                                <td>
                                    {new Date(p.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td><PaymentStatusBadge status={p.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsTable;
