import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_EVENTS } from '../../../mockData/inventoryData';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const InventoryCalendar = () => {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const eventsByDay: Record<number, string[]> = {};
    MOCK_EVENTS.forEach(evt => {
        const d = new Date(evt.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!eventsByDay[day]) eventsByDay[day] = [];
            eventsByDay[day].push(evt.name);
        }
    });

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
    const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

    return (
        <div className="vi-calendar-card">
            <div className="vi-calendar-header">
                <h3>{MONTH_NAMES[month]} {year}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="vi-btn-ghost" onClick={prevMonth}><ChevronLeft size={16} /></button>
                    <button className="vi-btn-ghost" onClick={nextMonth}><ChevronRight size={16} /></button>
                </div>
            </div>
            <div className="vi-calendar-grid">
                {DAYS_OF_WEEK.map(d => (
                    <div key={d} className="vi-cal-day-label">{d}</div>
                ))}
                {cells.map((day, idx) => (
                    <div
                        key={idx}
                        className={`vi-cal-day ${day === now.getDate() && month === now.getMonth() && year === now.getFullYear() ? 'cal-today' : ''}`}
                    >
                        {day && (
                            <>
                                <div className="vi-cal-day-num">{day}</div>
                                {(eventsByDay[day] ?? []).map(name => (
                                    <div key={name} className="vi-cal-event-dot" title={name}>{name}</div>
                                ))}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryCalendar;
