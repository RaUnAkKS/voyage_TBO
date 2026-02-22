import { useState } from 'react';
import '../../../styles/VendorSettings.css';

const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'AED (د.إ)', 'SGD (S$)'];
const TIMEZONES = [
    'Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)',
    'Asia/Dubai (GST)', 'Asia/Singapore (SGT)', 'America/Los_Angeles (PST)',
];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi'];

const PreferencesSettings = () => {
    const [currency, setCurrency] = useState('INR (₹)');
    const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
    const [dashView, setDashView] = useState('Table');
    const [language, setLanguage] = useState('English');

    const fields = [
        { label: 'Default Currency', value: currency, set: setCurrency, opts: CURRENCIES },
        { label: 'Timezone', value: timezone, set: setTimezone, opts: TIMEZONES },
        { label: 'Default Dashboard View', value: dashView, set: setDashView, opts: ['Table', 'Analytics', 'Calendar'] },
        { label: 'Language', value: language, set: setLanguage, opts: LANGUAGES },
    ];

    return (
        <div className="vs-card">
            <p className="vs-card-title">Platform Preferences</p>
            <p className="vs-card-sub">Customize your portal experience.</p>
            <div className="vs-form-grid">
                {fields.map(f => (
                    <div className="vs-field" key={f.label}>
                        <label className="vs-label">{f.label}</label>
                        <select className="vs-select" value={f.value} onChange={e => f.set(e.target.value)}>
                            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreferencesSettings;
