import { EventType } from './inventoryData';

// ── Archive Status ─────────────────────────────────────────────────────────────
export type ArchiveStatus = 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

// ── Archived Event data model ──────────────────────────────────────────────────
export interface ArchivedEvent {
    id: string;
    eventCode: string;
    name: string;
    type: EventType;
    status: ArchiveStatus;
    startDate: string;
    endDate: string;
    location: string;
    clientName: string;
    totalAllocatedUnits: number;
    inventoryReleased: boolean;
    revenueLakh: number;
    usedCategories: string[];
    notes?: string;
}

// ── Mock archived events ───────────────────────────────────────────────────────
export const MOCK_ARCHIVED_EVENTS: ArchivedEvent[] = [
    {
        id: 'arch-001',
        eventCode: 'EVT-2025-0081',
        name: 'Kapoor Destination Wedding',
        type: 'WEDDING',
        status: 'COMPLETED',
        startDate: '2025-11-08',
        endDate: '2025-11-11',
        location: 'Udaipur, Rajasthan',
        clientName: 'Priya & Vikram Kapoor',
        totalAllocatedUnits: 820,
        inventoryReleased: true,
        revenueLakh: 12.4,
        usedCategories: ['FURNITURE', 'DECOR', 'CATERING', 'STAFF', 'FLOOR_SPACE'],
        notes: 'Grand palace wedding. All inventory returned on time.',
    },
    {
        id: 'arch-002',
        eventCode: 'EVT-2025-0079',
        name: 'InnovateTech Conference 2025',
        type: 'CONFERENCE',
        status: 'COMPLETED',
        startDate: '2025-10-14',
        endDate: '2025-10-16',
        location: 'Mumbai, Maharashtra',
        clientName: 'InnovateTech Pvt. Ltd.',
        totalAllocatedUnits: 540,
        inventoryReleased: true,
        revenueLakh: 8.7,
        usedCategories: ['TECHNICAL', 'FURNITURE', 'FLOOR_SPACE'],
    },
    {
        id: 'arch-003',
        eventCode: 'EVT-2025-0072',
        name: 'Mehta Silver Jubilee',
        type: 'WEDDING',
        status: 'COMPLETED',
        startDate: '2025-09-20',
        endDate: '2025-09-22',
        location: 'Jaipur, Rajasthan',
        clientName: 'Suresh & Lata Mehta',
        totalAllocatedUnits: 460,
        inventoryReleased: true,
        revenueLakh: 6.8,
        usedCategories: ['FURNITURE', 'DECOR', 'STAFF', 'CATERING'],
    },
    {
        id: 'arch-004',
        eventCode: 'EVT-2025-0068',
        name: 'Pharma Incentive Goa 2025',
        type: 'INCENTIVE',
        status: 'COMPLETED',
        startDate: '2025-08-30',
        endDate: '2025-09-02',
        location: 'Goa',
        clientName: 'BioLife Pharmaceuticals',
        totalAllocatedUnits: 310,
        inventoryReleased: true,
        revenueLakh: 5.2,
        usedCategories: ['ACCOMMODATION', 'STAFF', 'CATERING'],
    },
    {
        id: 'arch-005',
        eventCode: 'EVT-2025-0059',
        name: 'Decor & Design Expo',
        type: 'EXHIBITION',
        status: 'COMPLETED',
        startDate: '2025-07-10',
        endDate: '2025-07-13',
        location: 'Delhi',
        clientName: 'Event Expo Consortium',
        totalAllocatedUnits: 1850,
        inventoryReleased: false,
        revenueLakh: 18.3,
        usedCategories: ['FLOOR_SPACE', 'TECHNICAL', 'FURNITURE'],
        notes: 'Partial inventory dispute pending resolution.',
    },
    {
        id: 'arch-006',
        eventCode: 'EVT-2025-0044',
        name: 'Q1 Strategy Offsite',
        type: 'MEETING',
        status: 'CANCELLED',
        startDate: '2025-05-15',
        endDate: '2025-05-15',
        location: 'Bengaluru',
        clientName: 'Horizon Capital',
        totalAllocatedUnits: 0,
        inventoryReleased: true,
        revenueLakh: 0,
        usedCategories: [],
        notes: 'Cancelled 48h before event due to client emergency.',
    },
    {
        id: 'arch-007',
        eventCode: 'EVT-2025-0033',
        name: 'Bhatia Wedding Celebration',
        type: 'WEDDING',
        status: 'COMPLETED',
        startDate: '2025-04-05',
        endDate: '2025-04-07',
        location: 'Chandigarh, Punjab',
        clientName: 'Rajesh Bhatia Family',
        totalAllocatedUnits: 720,
        inventoryReleased: true,
        revenueLakh: 9.1,
        usedCategories: ['FURNITURE', 'DECOR', 'CATERING', 'STAFF'],
    },
    {
        id: 'arch-008',
        eventCode: 'EVT-2025-0019',
        name: 'FinTech India Summit',
        type: 'CONFERENCE',
        status: 'ARCHIVED',
        startDate: '2025-02-18',
        endDate: '2025-02-20',
        location: 'Hyderabad, Telangana',
        clientName: 'FinTech Association of India',
        totalAllocatedUnits: 410,
        inventoryReleased: true,
        revenueLakh: 7.5,
        usedCategories: ['TECHNICAL', 'FLOOR_SPACE', 'STAFF'],
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
export const formatDateRange = (start: string, end: string): string => {
    const s = new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return start === end ? s : `${s} – ${e}`;
};

export const filterArchiveEvents = (
    events: ArchivedEvent[],
    query: string,
    type: EventType | 'ALL',
    status: ArchiveStatus | 'ALL',
): ArchivedEvent[] =>
    events.filter(e => {
        const q = query.toLowerCase();
        const matchQ = !q || e.name.toLowerCase().includes(q) || e.eventCode.toLowerCase().includes(q) || e.clientName.toLowerCase().includes(q);
        const matchT = type === 'ALL' || e.type === type;
        const matchS = status === 'ALL' || e.status === status;
        return matchQ && matchT && matchS;
    });
