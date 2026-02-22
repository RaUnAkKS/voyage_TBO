import { useState } from 'react';
import { Eye, EyeOff, Save, Monitor, Smartphone, Tablet } from 'lucide-react';
import '../../../styles/VendorSettings.css';

const PwField = ({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) => {
    const [show, setShow] = useState(false);
    return (
        <div className="vs-field">
            <label className="vs-label">{label}</label>
            <div className="vs-pw-wrap">
                <input
                    className="vs-input"
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder ?? '••••••••'}
                />
                <button className="vs-pw-toggle" type="button" onClick={() => setShow(s => !s)}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
};

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="vs-toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="vs-toggle-track" />
    </label>
);

const DeviceIcon = ({ type }: { type: string }) => {
    if (type === 'phone') return <Smartphone size={16} />;
    if (type === 'tablet') return <Tablet size={16} />;
    return <Monitor size={16} />;
};

const SESSIONS = [
    { id: 1, device: 'MacBook Pro', icon: 'monitor', location: 'Mumbai, IN', last: 'Active now', current: true },
    { id: 2, device: 'iPhone 15 Pro', icon: 'phone', location: 'Mumbai, IN', last: '2 hours ago', current: false },
    { id: 3, device: 'iPad Air', icon: 'tablet', location: 'Delhi, IN', last: '3 days ago', current: false },
];

const SecuritySettings = () => {
    const [curr, setCurr] = useState('');
    const [next, setNext] = useState('');
    const [conf, setConf] = useState('');
    const [twoFA, setTwoFA] = useState(false);
    const [pwErr, setPwErr] = useState('');

    const handlePwSave = () => {
        if (!curr) return setPwErr('Current password is required.');
        if (next.length < 8) return setPwErr('New password must be at least 8 characters.');
        if (next !== conf) return setPwErr('Passwords do not match.');
        setPwErr('');
        setCurr(''); setNext(''); setConf('');
    };

    return (
        <div>
            <div className="vs-card">
                <p className="vs-card-title">Change Password</p>
                <p className="vs-card-sub">Use a strong, unique password for your account.</p>
                <div className="vs-form-grid">
                    <PwField label="Current Password" value={curr} onChange={setCurr} />
                    <div />
                    <PwField label="New Password" value={next} onChange={setNext} placeholder="Min 8 characters" />
                    <PwField label="Confirm New Password" value={conf} onChange={setConf} />
                </div>
                {pwErr && <p className="vs-err-msg" style={{ marginTop: '1rem' }}>{pwErr}</p>}
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button className="vs-btn-primary" onClick={handlePwSave}><Save size={15} /> Update Password</button>
                </div>
            </div>

            <div className="vs-card">
                <p className="vs-card-title">Two-Factor Authentication</p>
                <p className="vs-card-sub">Add a second layer of security to your account.</p>
                <div className="vs-toggle-row">
                    <div className="vs-toggle-info">
                        <h4>Enable 2FA</h4>
                        <p>{twoFA ? 'Two-factor authentication is active.' : 'Protect your account with an authenticator app or SMS.'}</p>
                    </div>
                    <Toggle checked={twoFA} onChange={setTwoFA} />
                </div>
            </div>

            <div className="vs-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <p className="vs-card-title" style={{ margin: 0 }}>Active Sessions</p>
                        <p className="vs-card-sub" style={{ margin: '0.2rem 0 0' }}>Devices currently logged in to your account.</p>
                    </div>
                    <button className="vs-btn-danger outline">Logout All Devices</button>
                </div>
                {SESSIONS.map(s => (
                    <div className="vs-session-row" key={s.id}>
                        <div className="vs-session-info">
                            <div className="vs-session-icon"><DeviceIcon type={s.icon} /></div>
                            <div>
                                <div className="vs-session-device">
                                    {s.device}
                                    {s.current && <span className="vs-badge-current">Current</span>}
                                </div>
                                <div className="vs-session-meta">{s.location} · {s.last}</div>
                            </div>
                        </div>
                        {!s.current && <button className="vs-btn-ghost" style={{ fontSize: '0.75rem' }}>Revoke</button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SecuritySettings;
