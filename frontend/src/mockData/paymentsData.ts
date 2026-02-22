// ── Payment Status ─────────────────────────────────────────────────────────────
export type PaymentStatus = 'RELEASED' | 'ELIGIBLE' | 'PENDING' | 'OVERDUE';

// ── Date range filter ──────────────────────────────────────────────────────────
export type DateRange = '30d' | '3m' | '6m';

// ── Payment row ────────────────────────────────────────────────────────────────
export interface Payment {
    id: string;
    eventId: string;
    eventName: string;
    eventCode: string;
    eventType: string;
    milestoneName: string;
    amountLakh: number;
    dueDate: string;
    paidDate?: string;
    status: PaymentStatus;
    invoiceRef?: string;
}

// ── Mock payments — reference date 2026-02-22 ─────────────────────────────────
export const MOCK_PAYMENTS: Payment[] = [
    // ── Sharma Wedding (active, preparation)
    {
        id: 'pay-001', eventId: 'act-001',
        eventName: 'Sharma Destination Wedding', eventCode: 'EVT-2026-0101', eventType: 'WEDDING',
        milestoneName: 'Advance Payment (30%)',
        amountLakh: 4.26, dueDate: '2026-01-20', paidDate: '2026-01-18',
        status: 'RELEASED', invoiceRef: 'INV-2026-0081',
    },
    {
        id: 'pay-002', eventId: 'act-001',
        eventName: 'Sharma Destination Wedding', eventCode: 'EVT-2026-0101', eventType: 'WEDDING',
        milestoneName: 'Venue Setup Complete (30%)',
        amountLakh: 4.26, dueDate: '2026-03-10', paidDate: undefined,
        status: 'ELIGIBLE', invoiceRef: 'INV-2026-0082',
    },
    {
        id: 'pay-003', eventId: 'act-001',
        eventName: 'Sharma Destination Wedding', eventCode: 'EVT-2026-0101', eventType: 'WEDDING',
        milestoneName: 'Final Settlement (40%)',
        amountLakh: 5.68, dueDate: '2026-03-20', paidDate: undefined,
        status: 'PENDING', invoiceRef: undefined,
    },

    // ── TechSummit 2026 (active, preparation)
    {
        id: 'pay-004', eventId: 'act-002',
        eventName: 'TechSummit 2026', eventCode: 'EVT-2026-0098', eventType: 'CONFERENCE',
        milestoneName: 'Advance Payment (25%)',
        amountLakh: 2.38, dueDate: '2026-01-25', paidDate: '2026-01-22',
        status: 'RELEASED', invoiceRef: 'INV-2026-0074',
    },
    {
        id: 'pay-005', eventId: 'act-002',
        eventName: 'TechSummit 2026', eventCode: 'EVT-2026-0098', eventType: 'CONFERENCE',
        milestoneName: 'Setup Confirmation (35%)',
        amountLakh: 3.33, dueDate: '2026-03-15', paidDate: undefined,
        status: 'PENDING', invoiceRef: undefined,
    },
    {
        id: 'pay-006', eventId: 'act-002',
        eventName: 'TechSummit 2026', eventCode: 'EVT-2026-0098', eventType: 'CONFERENCE',
        milestoneName: 'Final Settlement (40%)',
        amountLakh: 3.79, dueDate: '2026-03-25', paidDate: undefined,
        status: 'PENDING', invoiceRef: undefined,
    },

    // ── Gupta Incentive Retreat (active, in-progress)
    {
        id: 'pay-007', eventId: 'act-003',
        eventName: 'Gupta Incentive Retreat', eventCode: 'EVT-2026-0089', eventType: 'INCENTIVE',
        milestoneName: 'Advance Payment (50%)',
        amountLakh: 2.9, dueDate: '2026-01-30', paidDate: '2026-01-28',
        status: 'RELEASED', invoiceRef: 'INV-2026-0063',
    },
    {
        id: 'pay-008', eventId: 'act-003',
        eventName: 'Gupta Incentive Retreat', eventCode: 'EVT-2026-0089', eventType: 'INCENTIVE',
        milestoneName: 'Final Settlement (50%)',
        amountLakh: 2.9, dueDate: '2026-02-26', paidDate: undefined,
        status: 'ELIGIBLE', invoiceRef: 'INV-2026-0064',
    },

    // ── Decor Expo 2026 (active, near completion)
    {
        id: 'pay-009', eventId: 'act-004',
        eventName: 'Decor Expo 2026', eventCode: 'EVT-2026-0076', eventType: 'EXHIBITION',
        milestoneName: 'Advance Payment (25%)',
        amountLakh: 4.63, dueDate: '2026-01-10', paidDate: '2026-01-08',
        status: 'RELEASED', invoiceRef: 'INV-2026-0052',
    },
    {
        id: 'pay-010', eventId: 'act-004',
        eventName: 'Decor Expo 2026', eventCode: 'EVT-2026-0076', eventType: 'EXHIBITION',
        milestoneName: 'Mid-Event Release (35%)',
        amountLakh: 6.48, dueDate: '2026-02-20', paidDate: '2026-02-19',
        status: 'RELEASED', invoiceRef: 'INV-2026-0053',
    },
    {
        id: 'pay-011', eventId: 'act-004',
        eventName: 'Decor Expo 2026', eventCode: 'EVT-2026-0076', eventType: 'EXHIBITION',
        milestoneName: 'Final Settlement (40%)',
        amountLakh: 7.39, dueDate: '2026-02-25', paidDate: undefined,
        status: 'ELIGIBLE', invoiceRef: 'INV-2026-0054',
    },

    // ── Q2 Strategy Meeting (active, preparation) — OVERDUE advance
    {
        id: 'pay-012', eventId: 'act-005',
        eventName: 'Q2 Strategy Meeting', eventCode: 'EVT-2026-0055', eventType: 'MEETING',
        milestoneName: 'Advance Payment (50%)',
        amountLakh: 0.6, dueDate: '2026-02-10', paidDate: undefined,
        status: 'OVERDUE', invoiceRef: 'INV-2026-0041',
    },
    {
        id: 'pay-013', eventId: 'act-005',
        eventName: 'Q2 Strategy Meeting', eventCode: 'EVT-2026-0055', eventType: 'MEETING',
        milestoneName: 'Final Settlement (50%)',
        amountLakh: 0.6, dueDate: '2026-04-26', paidDate: undefined,
        status: 'PENDING', invoiceRef: undefined,
    },
];

// ── Aggregation helpers ────────────────────────────────────────────────────────
export interface PaymentSummary {
    totalExpected: number;
    released: number;
    eligible: number;
    pending: number;
    overdue: number;
    releasedPct: number;
    eligiblePct: number;
    pendingPct: number;
}

export const getPaymentSummary = (payments: Payment[]): PaymentSummary => {
    const sum = (s: PaymentStatus) =>
        payments.filter(p => p.status === s).reduce((acc, p) => acc + p.amountLakh, 0);

    const released = sum('RELEASED');
    const eligible = sum('ELIGIBLE');
    const pending = sum('PENDING');
    const overdue = sum('OVERDUE');
    const totalExpected = released + eligible + pending + overdue;

    return {
        totalExpected,
        released, eligible, pending, overdue,
        releasedPct: totalExpected ? (released / totalExpected) * 100 : 0,
        eligiblePct: totalExpected ? (eligible / totalExpected) * 100 : 0,
        pendingPct: totalExpected ? ((pending + overdue) / totalExpected) * 100 : 0,
    };
};

export const filterByDateRange = (payments: Payment[], range: DateRange): Payment[] => {
    const now = new Date('2026-02-22');
    const cutoff = new Date(now);
    if (range === '30d') cutoff.setDate(now.getDate() - 30);
    if (range === '3m') cutoff.setMonth(now.getMonth() - 3);
    if (range === '6m') cutoff.setMonth(now.getMonth() - 6);
    // Show payments due within range or already released within range
    return payments.filter(p => {
        const due = new Date(p.dueDate);
        return due >= cutoff;
    });
};

export const formatINR = (lakh: number): string =>
    `₹${lakh.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}L`;

export const grouped = (payments: Payment[]): Record<string, Payment[]> =>
    payments.reduce((acc, p) => {
        (acc[p.eventId] ??= []).push(p);
        return acc;
    }, {} as Record<string, Payment[]>);
