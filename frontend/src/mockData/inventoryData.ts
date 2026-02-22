// ── Inventory Mock Data ─────────────────────────────────────────────────────

export type InventoryCategory =
    | 'TECHNICAL'
    | 'FURNITURE'
    | 'DECOR'
    | 'STAFF'
    | 'CATERING'
    | 'ACCOMMODATION'
    | 'FLOOR_SPACE';

export type EventType = 'WEDDING' | 'MEETING' | 'INCENTIVE' | 'CONFERENCE' | 'EXHIBITION';

export interface EventInventoryAllocation {
    eventId: string;
    inventoryItemId: string;
    quantityAllocated: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: InventoryCategory;
    totalQuantity: number;
    allocations: EventInventoryAllocation[];
}

export interface EventRecord {
    id: string;
    name: string;
    type: EventType;
    date: string;
    location: string;
    totalSlots: number;
    usedSlots: number;
}

// ── Events ──────────────────────────────────────────────────────────────────
export const MOCK_EVENTS: EventRecord[] = [
    { id: 'evt-001', name: 'Sharma Wedding', type: 'WEDDING', date: '2026-03-15', location: 'Udaipur, Rajasthan', totalSlots: 500, usedSlots: 420 },
    { id: 'evt-002', name: 'TechSummit 2026', type: 'CONFERENCE', date: '2026-03-22', location: 'Mumbai, Maharashtra', totalSlots: 300, usedSlots: 185 },
    { id: 'evt-003', name: 'Gupta Incentive Retreat', type: 'INCENTIVE', date: '2026-04-05', location: 'Goa', totalSlots: 80, usedSlots: 80 },
    { id: 'evt-004', name: 'Decor Expo 2026', type: 'EXHIBITION', date: '2026-04-18', location: 'Delhi', totalSlots: 200, usedSlots: 140 },
    { id: 'evt-005', name: 'Q2 Strategy Meeting', type: 'MEETING', date: '2026-04-25', location: 'Bangalore', totalSlots: 40, usedSlots: 22 },
];

// ── Inventory Items ──────────────────────────────────────────────────────────
export const MOCK_INVENTORY: InventoryItem[] = [
    {
        id: 'inv-001', name: 'Banquet Chairs', category: 'FURNITURE', totalQuantity: 500,
        allocations: [
            { eventId: 'evt-001', inventoryItemId: 'inv-001', quantityAllocated: 200 },
            { eventId: 'evt-002', inventoryItemId: 'inv-001', quantityAllocated: 150 },
        ],
    },
    {
        id: 'inv-002', name: 'Round Dining Tables', category: 'FURNITURE', totalQuantity: 60,
        allocations: [
            { eventId: 'evt-001', inventoryItemId: 'inv-002', quantityAllocated: 20 },
            { eventId: 'evt-003', inventoryItemId: 'inv-002', quantityAllocated: 10 },
        ],
    },
    {
        id: 'inv-003', name: 'LED Par Lights', category: 'TECHNICAL', totalQuantity: 120,
        allocations: [
            { eventId: 'evt-001', inventoryItemId: 'inv-003', quantityAllocated: 60 },
            { eventId: 'evt-002', inventoryItemId: 'inv-003', quantityAllocated: 40 },
        ],
    },
    {
        id: 'inv-004', name: 'PA Sound System', category: 'TECHNICAL', totalQuantity: 8,
        allocations: [
            { eventId: 'evt-002', inventoryItemId: 'inv-004', quantityAllocated: 4 },
            { eventId: 'evt-005', inventoryItemId: 'inv-004', quantityAllocated: 2 },
        ],
    },
    {
        id: 'inv-005', name: 'Floral Centerpieces', category: 'DECOR', totalQuantity: 80,
        allocations: [
            { eventId: 'evt-001', inventoryItemId: 'inv-005', quantityAllocated: 50 },
        ],
    },
    {
        id: 'inv-006', name: 'Event Staff (General)', category: 'STAFF', totalQuantity: 50,
        allocations: [
            { eventId: 'evt-001', inventoryItemId: 'inv-006', quantityAllocated: 20 },
            { eventId: 'evt-003', inventoryItemId: 'inv-006', quantityAllocated: 15 },
            { eventId: 'evt-004', inventoryItemId: 'inv-006', quantityAllocated: 12 },
        ],
    },
    {
        id: 'inv-007', name: 'Catering Buffet Counters', category: 'CATERING', totalQuantity: 20,
        allocations: [
            { eventId: 'evt-001', inventoryItemId: 'inv-007', quantityAllocated: 8 },
            { eventId: 'evt-003', inventoryItemId: 'inv-007', quantityAllocated: 6 },
        ],
    },
    {
        id: 'inv-008', name: 'Deluxe Hotel Rooms', category: 'ACCOMMODATION', totalQuantity: 40,
        allocations: [
            { eventId: 'evt-003', inventoryItemId: 'inv-008', quantityAllocated: 30 },
        ],
    },
    {
        id: 'inv-009', name: 'Exhibition Floor Space (sq.m)', category: 'FLOOR_SPACE', totalQuantity: 2000,
        allocations: [
            { eventId: 'evt-004', inventoryItemId: 'inv-009', quantityAllocated: 1200 },
        ],
    },
    {
        id: 'inv-010', name: 'Stage Backdrop Panels', category: 'DECOR', totalQuantity: 30,
        allocations: [
            { eventId: 'evt-001', inventoryItemId: 'inv-010', quantityAllocated: 12 },
            { eventId: 'evt-002', inventoryItemId: 'inv-010', quantityAllocated: 10 },
        ],
    },
];

// ── Heatmap Data ─────────────────────────────────────────────────────────────
export const HEATMAP_DATES = ['Mar 15', 'Mar 22', 'Apr 5', 'Apr 18', 'Apr 25'];

export const CATEGORY_LIST: InventoryCategory[] = [
    'TECHNICAL', 'FURNITURE', 'DECOR', 'STAFF', 'CATERING', 'ACCOMMODATION', 'FLOOR_SPACE',
];
