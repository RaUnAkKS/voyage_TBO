import { EventType } from './inventoryData';

// ── Active Event Progress Status ───────────────────────────────────────────────
export type ActiveEventStatus = 'PREPARATION' | 'IN_PROGRESS' | 'NEAR_COMPLETION';

// ── Inventory snapshot for an active event ────────────────────────────────────
export interface ActiveEventInventoryItem {
    category: string;
    itemName: string;
    totalQty: number;
    allocatedQty: number;
    confirmedQty: number;
}

// ── Timeline milestone ─────────────────────────────────────────────────────────
export interface EventMilestone {
    label: string;
    date: string;
    done: boolean;
}

// ── Active Event ───────────────────────────────────────────────────────────────
export interface ActiveEvent {
    id: string;
    eventCode: string;
    name: string;
    type: EventType;
    status: ActiveEventStatus;
    startDate: string;
    endDate: string;
    location: string;
    clientName: string;
    attendees: number;
    progressPct: number;
    inventoryItems: ActiveEventInventoryItem[];
    milestones: EventMilestone[];
    vendorsAssigned: string[];
    revenueLakh: number;
    notes?: string;
}

// ── Mock active events (isActive = true) ──────────────────────────────────────
// Reference date: 2026-02-22
export const MOCK_ACTIVE_EVENTS: ActiveEvent[] = [
    {
        id: 'act-001',
        eventCode: 'EVT-2026-0101',
        name: 'Sharma Destination Wedding',
        type: 'WEDDING',
        status: 'PREPARATION',
        startDate: '2026-03-15',
        endDate: '2026-03-18',
        location: 'Udaipur, Rajasthan',
        clientName: 'Anita & Rahul Sharma',
        attendees: 500,
        progressPct: 34,
        revenueLakh: 14.2,
        vendorsAssigned: ['Decor Masters', 'Royal Catering', 'Luminary Lights'],
        inventoryItems: [
            { category: 'FURNITURE', itemName: 'Banquet Chairs', totalQty: 200, allocatedQty: 200, confirmedQty: 180 },
            { category: 'DECOR', itemName: 'Floral Centerpieces', totalQty: 50, allocatedQty: 50, confirmedQty: 30 },
            { category: 'TECHNICAL', itemName: 'LED Par Lights', totalQty: 60, allocatedQty: 60, confirmedQty: 60 },
            { category: 'CATERING', itemName: 'Buffet Counters', totalQty: 8, allocatedQty: 8, confirmedQty: 8 },
            { category: 'STAFF', itemName: 'Event Staff (General)', totalQty: 20, allocatedQty: 20, confirmedQty: 15 },
        ],
        milestones: [
            { label: 'Booking Confirmed', date: '2026-01-10', done: true },
            { label: 'Venue Inspection', date: '2026-02-01', done: true },
            { label: 'Inventory Lock', date: '2026-03-01', done: true },
            { label: 'Vendor Briefing', date: '2026-03-08', done: false },
            { label: 'Event Day — Day 1', date: '2026-03-15', done: false },
            { label: 'Event Completion', date: '2026-03-18', done: false },
        ],
        notes: 'VIP guests arriving March 14. Poolside rehearsal dinner setup required.',
    },
    {
        id: 'act-002',
        eventCode: 'EVT-2026-0098',
        name: 'TechSummit 2026',
        type: 'CONFERENCE',
        status: 'PREPARATION',
        startDate: '2026-03-22',
        endDate: '2026-03-24',
        location: 'Mumbai, Maharashtra',
        clientName: 'InnovateTech Pvt. Ltd.',
        attendees: 300,
        progressPct: 28,
        revenueLakh: 9.5,
        vendorsAssigned: ['AV Solutions Mumbai', 'Corporate Caterers'],
        inventoryItems: [
            { category: 'TECHNICAL', itemName: 'PA Sound System', totalQty: 4, allocatedQty: 4, confirmedQty: 4 },
            { category: 'TECHNICAL', itemName: 'LED Par Lights', totalQty: 40, allocatedQty: 40, confirmedQty: 40 },
            { category: 'FURNITURE', itemName: 'Banquet Chairs', totalQty: 150, allocatedQty: 150, confirmedQty: 100 },
            { category: 'DECOR', itemName: 'Stage Backdrop Panels', totalQty: 10, allocatedQty: 10, confirmedQty: 6 },
        ],
        milestones: [
            { label: 'Contract Signed', date: '2026-01-15', done: true },
            { label: 'AV Setup Plan', date: '2026-02-10', done: true },
            { label: 'Speaker Confirmation', date: '2026-03-05', done: false },
            { label: 'Setup Day', date: '2026-03-21', done: false },
            { label: 'Conference Start', date: '2026-03-22', done: false },
        ],
    },
    {
        id: 'act-003',
        eventCode: 'EVT-2026-0089',
        name: 'Gupta Incentive Retreat',
        type: 'INCENTIVE',
        status: 'IN_PROGRESS',
        startDate: '2026-02-20',
        endDate: '2026-02-25',
        location: 'Goa',
        clientName: 'BioLife Pharmaceuticals',
        attendees: 80,
        progressPct: 62,
        revenueLakh: 5.8,
        vendorsAssigned: ['Goa Resorts Ltd.', 'Team Builders Inc.'],
        inventoryItems: [
            { category: 'ACCOMMODATION', itemName: 'Deluxe Hotel Rooms', totalQty: 30, allocatedQty: 30, confirmedQty: 30 },
            { category: 'CATERING', itemName: 'Buffet Counters', totalQty: 6, allocatedQty: 6, confirmedQty: 6 },
            { category: 'STAFF', itemName: 'Event Staff (General)', totalQty: 15, allocatedQty: 15, confirmedQty: 15 },
        ],
        milestones: [
            { label: 'Group Booking', date: '2026-01-20', done: true },
            { label: 'Activity Planning', date: '2026-02-05', done: true },
            { label: 'Arrival Day', date: '2026-02-20', done: true },
            { label: 'Team Sessions', date: '2026-02-22', done: true },
            { label: 'Gala Dinner', date: '2026-02-24', done: false },
            { label: 'Departure Day', date: '2026-02-25', done: false },
        ],
        notes: 'Currently in Day 3 of 6. Gala dinner prep underway.',
    },
    {
        id: 'act-004',
        eventCode: 'EVT-2026-0076',
        name: 'Decor Expo 2026',
        type: 'EXHIBITION',
        status: 'NEAR_COMPLETION',
        startDate: '2026-02-18',
        endDate: '2026-02-23',
        location: 'Delhi',
        clientName: 'Event Expo Consortium',
        attendees: 200,
        progressPct: 87,
        revenueLakh: 18.5,
        vendorsAssigned: ['Delhi Displays', 'FloorSpace Pro'],
        inventoryItems: [
            { category: 'FLOOR_SPACE', itemName: 'Exhibition Floor Space', totalQty: 1200, allocatedQty: 1200, confirmedQty: 1200 },
            { category: 'TECHNICAL', itemName: 'LED Par Lights', totalQty: 40, allocatedQty: 40, confirmedQty: 40 },
            { category: 'FURNITURE', itemName: 'Banquet Chairs', totalQty: 140, allocatedQty: 140, confirmedQty: 140 },
            { category: 'STAFF', itemName: 'Event Staff (General)', totalQty: 12, allocatedQty: 12, confirmedQty: 12 },
        ],
        milestones: [
            { label: 'Exhibitor Allotment', date: '2026-01-15', done: true },
            { label: 'Setup Complete', date: '2026-02-17', done: true },
            { label: 'Exhibition Open', date: '2026-02-18', done: true },
            { label: 'Day 3 (Peak Traffic)', date: '2026-02-20', done: true },
            { label: 'Closing Ceremony', date: '2026-02-23', done: false },
            { label: 'Inventory Release', date: '2026-02-24', done: false },
        ],
        notes: 'Final day tomorrow. Prepare inventory release checklist.',
    },
    {
        id: 'act-005',
        eventCode: 'EVT-2026-0055',
        name: 'Q2 Strategy Meeting',
        type: 'MEETING',
        status: 'PREPARATION',
        startDate: '2026-04-25',
        endDate: '2026-04-25',
        location: 'Bengaluru',
        clientName: 'Horizon Capital',
        attendees: 40,
        progressPct: 12,
        revenueLakh: 1.2,
        vendorsAssigned: ['Corp Events Bangalore'],
        inventoryItems: [
            { category: 'TECHNICAL', itemName: 'PA Sound System', totalQty: 2, allocatedQty: 2, confirmedQty: 0 },
            { category: 'FURNITURE', itemName: 'Banquet Chairs', totalQty: 40, allocatedQty: 0, confirmedQty: 0 },
        ],
        milestones: [
            { label: 'Booking Confirmed', date: '2026-02-15', done: true },
            { label: 'Venue Booked', date: '2026-03-20', done: false },
            { label: 'AV Setup', date: '2026-04-24', done: false },
            { label: 'Meeting Day', date: '2026-04-25', done: false },
        ],
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
export const formatDateRange = (start: string, end: string): string => {
    const s = new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return start === end ? s : `${s} – ${e}`;
};

export const getDaysUntil = (dateStr: string): number => {
    const now = new Date('2026-02-22');
    const date = new Date(dateStr);
    return Math.ceil((date.getTime() - now.getTime()) / 86400000);
};

export const filterActiveEvents = (
    events: ActiveEvent[],
    query: string,
    type: EventType | 'ALL',
    status: ActiveEventStatus | 'ALL',
): ActiveEvent[] =>
    events.filter(e => {
        const q = query.toLowerCase();
        const matchQ = !q || e.name.toLowerCase().includes(q) || e.eventCode.toLowerCase().includes(q) || e.clientName.toLowerCase().includes(q);
        const matchT = type === 'ALL' || e.type === type;
        const matchS = status === 'ALL' || e.status === status;
        return matchQ && matchT && matchS;
    });
