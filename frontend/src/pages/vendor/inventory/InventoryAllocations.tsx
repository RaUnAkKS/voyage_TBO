import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, Users } from 'lucide-react';
import { MOCK_EVENTS, MOCK_INVENTORY, EventType } from '../../../mockData/inventoryData';
import { progressColor } from './InventoryLayout';

const EVENT_TYPES: EventType[] = ['WEDDING', 'MEETING', 'INCENTIVE', 'CONFERENCE', 'EXHIBITION'];

const InventoryAllocations = () => {
    const navigate = useNavigate();
    const [activeType, setActiveType] = useState<EventType | 'ALL'>('ALL');

    const filtered = MOCK_EVENTS.filter(
        e => activeType === 'ALL' || e.type === activeType
    );

    return (
        <div>
            <div className="vi-alloc-filters">
                {(['ALL', ...EVENT_TYPES] as (EventType | 'ALL')[]).map(t => (
                    <button
                        key={t}
                        className={`vi-filter-chip ${activeType === t ? 'active' : ''}`}
                        onClick={() => setActiveType(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="vi-event-grid">
                {filtered.map(evt => {
                    const usedItems = MOCK_INVENTORY.filter(i =>
                        i.allocations.some(a => a.eventId === evt.id)
                    );
                    const usagePct = Math.round((evt.usedSlots / evt.totalSlots) * 100);
                    const evtDate = new Date(evt.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                    });

                    return (
                        <div
                            className="vi-event-card"
                            key={evt.id}
                            onClick={() => navigate(`/vendor/events/${evt.id}`)}
                        >
                            <div className="vi-event-card-header">
                                <div>
                                    <h3>{evt.name}</h3>
                                    <p>{evtDate}</p>
                                </div>
                                <span className="vi-event-type-badge">{evt.type}</span>
                            </div>

                            <div className="vi-event-meta">
                                <div className="vi-event-meta-row"><MapPin size={14} /> {evt.location}</div>
                                <div className="vi-event-meta-row"><Package size={14} /> {usedItems.length} inventory types allocated</div>
                                <div className="vi-event-meta-row"><Users size={14} /> {evt.usedSlots} / {evt.totalSlots} attendees</div>
                            </div>

                            <div className="vi-event-progress-label">
                                <span>Resource Usage</span>
                                <span>{usagePct}%</span>
                            </div>
                            <div className="vi-progress-track">
                                <div className="vi-progress-fill" style={{
                                    width: `${usagePct}%`,
                                    background: progressColor(usagePct),
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InventoryAllocations;
