import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronLeft, Download, CheckCircle2, Clock, XCircle } from 'lucide-react';
import {
    MOCK_PAYMENTS, getPaymentSummary, formatINR, PaymentStatus,
} from '../../../mockData/paymentsData';
import { PaymentStatusBadge } from './PaymentsTable';
import '../../../styles/Payments.css';
import '../../../styles/VendorLayout.css';

const DOT_CLS: Record<PaymentStatus, string> = {
    RELEASED: 'released', ELIGIBLE: 'eligible', PENDING: '', OVERDUE: 'overdue',
};

const ICON_MAP: Record<PaymentStatus, React.ReactElement> = {
    RELEASED: <CheckCircle2 size={13} style={{ color: '#22C55E' }} />,
    ELIGIBLE: <Clock size={13} style={{ color: '#3B82F6' }} />,
    PENDING: <Clock size={13} style={{ color: '#F59E0B' }} />,
    OVERDUE: <XCircle size={13} style={{ color: '#EF4444' }} />,
};

const PaymentDetailsPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const eventPayments = MOCK_PAYMENTS.filter(p => p.eventId === eventId);
    if (!eventPayments.length) return <Navigate to="/vendor/payments" replace />;

    const first = eventPayments[0];
    const summary = getPaymentSummary(eventPayments);

    return (
        <div>
            {/* ── Topbar ── */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <Link to="/vendor/payments" className="ea-detail-back">
                        <ChevronLeft size={14} /> Back to Payments
                    </Link>
                    <h1 style={{ marginTop: '0.5rem' }}>{first.eventName}</h1>
                    <p style={{ marginTop: '0.2rem', fontSize: '0.8rem', color: '#525252' }}>
                        {first.eventCode} · {first.eventType}
                    </p>
                </div>
                <div className="vl-topbar-actions">
                    <button className="ea-download-btn">
                        <Download size={15} /> Download Invoice
                    </button>
                </div>
            </div>

            <div className="pm-content">
                {/* ── Detail KPI strip ── */}
                <div className="pm-detail-grid">
                    {[
                        { label: 'Total Contract', value: formatINR(summary.totalExpected), cls: 'gold' },
                        { label: 'Released', value: formatINR(summary.released), cls: 'green' },
                        { label: 'Eligible', value: formatINR(summary.eligible), cls: 'blue' },
                        { label: 'Pending / Overdue', value: formatINR(summary.pending + summary.overdue), cls: summary.overdue > 0 ? 'orange' : 'orange' },
                    ].map(c => (
                        <div className="pm-detail-kpi" key={c.label}>
                            <div className="pm-detail-kpi-label">{c.label}</div>
                            <div className={`pm-detail-kpi-value ${c.cls}`}>{c.value}</div>
                        </div>
                    ))}
                </div>

                {/* ── Cashflow mini bar ── */}
                <div className="pm-section">
                    <p className="pm-section-title">Payment Progress</p>
                    <div className="pm-cf-bar-wrap">
                        <div className="pm-cf-segment released" style={{ width: `${summary.releasedPct}%`, transition: 'width 0.9s ease' }} />
                        <div className="pm-cf-segment eligible" style={{ width: `${summary.eligiblePct}%`, transition: 'width 0.9s ease' }} />
                        <div className="pm-cf-segment pending" style={{ width: `${summary.pendingPct}%`, transition: 'width 0.9s ease' }} />
                    </div>
                    <div className="pm-cf-legend" style={{ marginTop: '0.75rem' }}>
                        {[
                            { cls: 'released', label: 'Released', val: formatINR(summary.released) },
                            { cls: 'eligible', label: 'Eligible', val: formatINR(summary.eligible) },
                            { cls: 'pending', label: 'Pending/Overdue', val: formatINR(summary.pending + summary.overdue) },
                        ].map(l => (
                            <div className="pm-cf-legend-item" key={l.cls}>
                                <span className={`pm-cf-dot ${l.cls}`} />
                                {l.label} <span className="pm-cf-legend-val">{l.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Payment Timeline ── */}
                <div className="pm-section">
                    <p className="pm-section-title">Payment Timeline ({eventPayments.length} milestones)</p>
                    <div className="pm-timeline">
                        {eventPayments.map(p => (
                            <div className="pm-tl-row" key={p.id}>
                                <div className={`pm-tl-dot ${DOT_CLS[p.status]}`} />
                                <div className="pm-tl-body">
                                    <div className="pm-tl-name">
                                        {ICON_MAP[p.status]}{' '}
                                        <span style={{ marginLeft: 6 }}>{p.milestoneName}</span>
                                    </div>
                                    <div className="pm-tl-meta">
                                        Due: {new Date(p.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        {p.paidDate && ` · Paid: ${new Date(p.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                                        {p.invoiceRef && ` · ${p.invoiceRef}`}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                                    <span className="pm-tl-amount">{formatINR(p.amountLakh)}</span>
                                    <PaymentStatusBadge status={p.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Invoice List ── */}
                <div className="pm-section">
                    <p className="pm-section-title">Invoice Downloads</p>
                    {eventPayments.filter(p => p.invoiceRef).length === 0 ? (
                        <p style={{ color: '#525252', fontSize: '0.83rem' }}>No invoices generated yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {eventPayments.filter(p => p.invoiceRef).map(p => (
                                <div
                                    key={p.id}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>{p.invoiceRef}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#525252' }}>{p.milestoneName} · {formatINR(p.amountLakh)}</div>
                                    </div>
                                    <button className="ea-download-btn" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
                                        <Download size={12} /> PDF
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsPage;
