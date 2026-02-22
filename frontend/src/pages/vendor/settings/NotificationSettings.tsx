import { useState } from 'react';
import '../../../styles/VendorSettings.css';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="vs-toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="vs-toggle-track" />
    </label>
);

const NotificationSettings = () => {
    const [notifs, setNotifs] = useState({
        eventAllocation: true,
        lowInventory: true,
        payments: true,
        marketing: false,
    });

    const toggle = (key: keyof typeof notifs) =>
        setNotifs(n => ({ ...n, [key]: !n[key] }));

    const rows = [
        { key: 'eventAllocation' as const, title: 'Event Allocation Alerts', desc: 'Get notified when new allocations are made for your inventory.' },
        { key: 'lowInventory' as const, title: 'Low Inventory Alerts', desc: 'Receive a warning when inventory drops below 10%.' },
        { key: 'payments' as const, title: 'Payment Notifications', desc: 'Alerts for new payments, invoices, and pending dues.' },
        { key: 'marketing' as const, title: 'Marketing Emails', desc: 'Tips, product updates, and promotional offers.' },
    ];

    return (
        <div className="vs-card">
            <p className="vs-card-title">Notification Preferences</p>
            <p className="vs-card-sub">Manage how and when you want to be notified.</p>
            {rows.map(r => (
                <div className="vs-toggle-row" key={r.key}>
                    <div className="vs-toggle-info">
                        <h4>{r.title}</h4>
                        <p>{r.desc}</p>
                    </div>
                    <Toggle checked={notifs[r.key]} onChange={() => toggle(r.key)} />
                </div>
            ))}
        </div>
    );
};

export default NotificationSettings;
