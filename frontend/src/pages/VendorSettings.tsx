import { useState, useCallback, useEffect } from 'react';
import {
    User, Shield, Bell, Sliders, AlertTriangle,
    LayoutDashboard, Package, Calendar, Settings, LogOut,
    Eye, EyeOff, Monitor, Smartphone, Tablet,
    CheckCircle, Save, Plus, X,
} from 'lucide-react';
import '../styles/VendorSettings.css';

// ── Types ────────────────────────────────────────────────────────────────────
interface VendorProfile {
    businessName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    serviceCategories: string[];
    logoUrl: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
    'TECHNICAL', 'FURNITURE', 'DECOR', 'STAFF',
    'CATERING', 'ACCOMMODATION', 'FLOOR_SPACE', 'AV & LIGHTING',
];

const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'AED (د.إ)', 'SGD (S$)'];
const TIMEZONES = [
    'Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)',
    'Asia/Dubai (GST)', 'Asia/Singapore (SGT)', 'America/Los_Angeles (PST)',
];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi'];

// ── Sub-components ────────────────────────────────────────────────────────────

// Toggle Switch
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="vs-toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="vs-toggle-track" />
    </label>
);

// Password field with visibility toggle
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

// ── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = ({ form, setForm }: {
    form: VendorProfile;
    setForm: (f: VendorProfile) => void;
}) => {
    const [tagInput, setTagInput] = useState('');

    const set = (key: keyof VendorProfile) => (v: string) =>
        setForm({ ...form, [key]: v });

    const addTag = (tag: string) => {
        const t = tag.trim().toUpperCase();
        if (t && !form.serviceCategories.includes(t))
            setForm({ ...form, serviceCategories: [...form.serviceCategories, t] });
        setTagInput('');
    };

    const removeTag = (tag: string) =>
        setForm({ ...form, serviceCategories: form.serviceCategories.filter(t => t !== tag) });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setForm({ ...form, logoUrl: ev.target?.result as string });
        reader.readAsDataURL(file);
    };

    return (
        <div>
            {/* Logo */}
            <div className="vs-card">
                <p className="vs-card-title">Business Logo</p>
                <p className="vs-card-sub">Upload a clear, square logo for best results.</p>
                <div className="vs-logo-upload">
                    <div className="vs-logo-circle">
                        {form.logoUrl
                            ? <img src={form.logoUrl} alt="Logo" />
                            : <span className="vs-logo-circle-placeholder">{form.businessName.charAt(0) || 'V'}</span>
                        }
                    </div>
                    <div className="vs-logo-actions">
                        <label className="vs-btn-ghost" style={{ cursor: 'pointer' }}>
                            Upload Logo
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
                        </label>
                        {form.logoUrl && (
                            <button className="vs-btn-ghost" onClick={() => setForm({ ...form, logoUrl: '' })}>
                                Remove
                            </button>
                        )}
                        <p className="vs-logo-hint">PNG, JPG or SVG · Max 2MB · Square recommended</p>
                    </div>
                </div>
            </div>

            {/* Business Details */}
            <div className="vs-card">
                <p className="vs-card-title">Business Information</p>
                <p className="vs-card-sub">This information appears on your vendor profile.</p>
                <div className="vs-form-grid">
                    <div className="vs-field">
                        <label className="vs-label">Business Name *</label>
                        <input className="vs-input" value={form.businessName} onChange={e => set('businessName')(e.target.value)} placeholder="Acme Events Pvt. Ltd." />
                    </div>
                    <div className="vs-field">
                        <label className="vs-label">Contact Email *</label>
                        <input className="vs-input" type="email" value={form.email} onChange={e => set('email')(e.target.value)} placeholder="vendor@example.com" />
                    </div>
                    <div className="vs-field">
                        <label className="vs-label">Phone Number</label>
                        <input className="vs-input" type="tel" value={form.phone} onChange={e => set('phone')(e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div className="vs-field">
                        <label className="vs-label">Country</label>
                        <input className="vs-input" value={form.country} onChange={e => set('country')(e.target.value)} placeholder="India" />
                    </div>
                    <div className="vs-field vs-form-full">
                        <label className="vs-label">Address</label>
                        <textarea className="vs-textarea vs-input" value={form.address} onChange={e => set('address')(e.target.value)} placeholder="Street address, building…" />
                    </div>
                    <div className="vs-field">
                        <label className="vs-label">City</label>
                        <input className="vs-input" value={form.city} onChange={e => set('city')(e.target.value)} placeholder="Mumbai" />
                    </div>
                    <div className="vs-field">
                        <label className="vs-label">State</label>
                        <input className="vs-input" value={form.state} onChange={e => set('state')(e.target.value)} placeholder="Maharashtra" />
                    </div>

                    {/* Service Categories */}
                    <div className="vs-field vs-form-full">
                        <label className="vs-label">Service Categories</label>
                        <div className="vs-tags-input">
                            {form.serviceCategories.map(tag => (
                                <span key={tag} className="vs-tag">
                                    {tag}
                                    <button className="vs-tag-remove" onClick={() => removeTag(tag)}><X size={11} /></button>
                                </span>
                            ))}
                            <input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); } }}
                                placeholder={form.serviceCategories.length === 0 ? 'Type a category and press Enter…' : '+ Add more'}
                            />
                        </div>
                        <div className="vs-tag-suggestions">
                            {SERVICE_OPTIONS.filter(o => !form.serviceCategories.includes(o)).map(opt => (
                                <button key={opt} className="vs-tag-sugg" onClick={() => addTag(opt)}>
                                    <Plus size={11} style={{ display: 'inline', marginRight: 3 }} />{opt.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Security Tab ──────────────────────────────────────────────────────────────
const SecurityTab = () => {
    const [curr, setCurr] = useState('');
    const [next, setNext] = useState('');
    const [conf, setConf] = useState('');
    const [twoFA, setTwoFA] = useState(false);
    const [pwErr, setPwErr] = useState('');

    const sessions = [
        { id: 1, device: 'MacBook Pro', icon: 'monitor', location: 'Mumbai, IN', last: 'Active now', current: true },
        { id: 2, device: 'iPhone 15 Pro', icon: 'phone', location: 'Mumbai, IN', last: '2 hours ago', current: false },
        { id: 3, device: 'iPad Air', icon: 'tablet', location: 'Delhi, IN', last: '3 days ago', current: false },
    ];

    const DeviceIcon = ({ type }: { type: string }) => {
        if (type === 'phone') return <Smartphone size={16} />;
        if (type === 'tablet') return <Tablet size={16} />;
        return <Monitor size={16} />;
    };

    const handlePwSave = () => {
        if (!curr) return setPwErr('Current password is required.');
        if (next.length < 8) return setPwErr('New password must be at least 8 characters.');
        if (next !== conf) return setPwErr('Passwords do not match.');
        setPwErr('');
        setCurr(''); setNext(''); setConf('');
    };

    return (
        <div>
            {/* Change Password */}
            <div className="vs-card">
                <p className="vs-card-title">Change Password</p>
                <p className="vs-card-sub">Use a strong, unique password for your account.</p>
                <div className="vs-form-grid">
                    <PwField label="Current Password" value={curr} onChange={setCurr} />
                    <div /> {/* spacer */}
                    <PwField label="New Password" value={next} onChange={setNext} placeholder="Min 8 characters" />
                    <PwField label="Confirm New Password" value={conf} onChange={setConf} />
                </div>
                {pwErr && <p className="vs-err-msg" style={{ marginTop: '1rem' }}>{pwErr}</p>}
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button className="vs-btn-primary" onClick={handlePwSave}><Save size={15} /> Update Password</button>
                </div>
            </div>

            {/* 2FA */}
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

            {/* Sessions */}
            <div className="vs-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <p className="vs-card-title" style={{ margin: 0 }}>Active Sessions</p>
                        <p className="vs-card-sub" style={{ margin: '0.2rem 0 0' }}>Devices currently logged in to your account.</p>
                    </div>
                    <button className="vs-btn-danger outline">Logout All Devices</button>
                </div>
                {sessions.map(s => (
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

// ── Notifications Tab ─────────────────────────────────────────────────────────
const NotificationsTab = () => {
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

// ── Preferences Tab ───────────────────────────────────────────────────────────
const PreferencesTab = () => {
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

// ── Danger Zone Tab ───────────────────────────────────────────────────────────
const DangerZoneTab = ({ onShowModal }: { onShowModal: (type: 'deactivate' | 'delete') => void }) => (
    <div>
        <div className="vs-danger-card">
            <div className="vs-danger-row">
                <div className="vs-danger-info">
                    <h4>Deactivate Account</h4>
                    <p>Temporarily disable your vendor account. Your data will be preserved and you can reactivate anytime by contacting support.</p>
                </div>
                <button className="vs-btn-danger" onClick={() => onShowModal('deactivate')}>
                    <AlertTriangle size={15} /> Deactivate
                </button>
            </div>
        </div>
        <div className="vs-danger-card">
            <div className="vs-danger-row">
                <div className="vs-danger-info">
                    <h4>Delete Account Permanently</h4>
                    <p>Permanently delete all your data, inventory records, and event allocations. This action <strong>cannot be undone</strong>.</p>
                </div>
                <button className="vs-btn-danger" onClick={() => onShowModal('delete')}>
                    <X size={15} /> Delete Account
                </button>
            </div>
        </div>
    </div>
);

// ── Confirmation Modal ────────────────────────────────────────────────────────
const ConfirmModal = ({
    type, onClose
}: {
    type: 'deactivate' | 'delete';
    onClose: () => void;
}) => {
    const [confirm, setConfirm] = useState('');
    const expected = type === 'delete' ? 'DELETE' : 'DEACTIVATE';
    const valid = confirm === expected;

    return (
        <div className="vs-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="vs-modal">
                <h3>{type === 'delete' ? '⚠️ Delete Account' : '⚠️ Deactivate Account'}</h3>
                <p>
                    {type === 'delete'
                        ? 'This will permanently erase your vendor profile, all inventory data, and event allocations. This action cannot be reversed.'
                        : 'Your account will be disabled. You can reactivate by contacting support. No data will be deleted.'}
                </p>
                <span className="vs-modal-confirm">
                    Type <strong style={{ color: '#E05C5C' }}>{expected}</strong> to confirm
                </span>
                <input
                    className="vs-input"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value.toUpperCase())}
                    placeholder={expected}
                />
                <div className="vs-modal-actions">
                    <button className="vs-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="vs-btn-danger" style={{ opacity: valid ? 1 : 0.4, cursor: valid ? 'pointer' : 'not-allowed' }}>
                        {type === 'delete' ? 'Delete Permanently' : 'Deactivate Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

type TabId = 'profile' | 'security' | 'notifications' | 'preferences' | 'danger';

const TABS: { id: TabId; label: string; icon: React.ReactNode; danger?: boolean }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={15} /> },
    { id: 'security', label: 'Security', icon: <Shield size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'preferences', label: 'Preferences', icon: <Sliders size={15} /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={15} />, danger: true },
];

const INITIAL_FORM: VendorProfile = {
    businessName: 'Acme Event Solutions',
    email: 'contact@acmeevents.in',
    phone: '+91 98765 43210',
    address: '5th Floor, Prestige Tower, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    serviceCategories: ['TECHNICAL', 'DECOR', 'CATERING'],
    logoUrl: '',
};

const NAV_ITEMS = [
    { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Overview' },
    { id: 'inventory', icon: <Package size={16} />, label: 'Inventory' },
    { id: 'calendar', icon: <Calendar size={16} />, label: 'Calendar' },
    { id: 'settings', icon: <Settings size={16} />, label: 'Settings' },
];

const VendorSettings = () => {
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [sideNav, setSideNav] = useState('settings');
    const [form, setFormRaw] = useState<VendorProfile>(INITIAL_FORM);
    const [hasChanges, setHasChanges] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
    const [modal, setModal] = useState<'deactivate' | 'delete' | null>(null);

    // Track changes
    const setForm = useCallback((f: VendorProfile) => {
        setFormRaw(f);
        setHasChanges(true);
    }, []);

    const handleSave = () => {
        if (!form.businessName || !form.email) {
            setToast({ msg: 'Business Name and Email are required.', type: 'err' });
            return;
        }
        setHasChanges(false);
        setToast({ msg: 'Settings saved successfully!', type: 'ok' });
    };

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    return (
        <div className="vs-page">
            {/* Sidebar */}
            <aside className="vs-sidebar">
                <div className="vs-sidebar-logo">
                    <div className="vs-sidebar-logo-icon">V</div>
                    <span>VendorPortal</span>
                </div>
                <span className="vs-sidebar-section-label">Navigation</span>
                <nav className="vs-sidebar-nav">
                    {NAV_ITEMS.map(n => (
                        <button
                            key={n.id}
                            className={`vs-nav-item ${sideNav === n.id ? 'active' : ''}`}
                            onClick={() => setSideNav(n.id)}
                        >
                            {n.icon} {n.label}
                        </button>
                    ))}
                </nav>
                <span className="vs-sidebar-section-label">Account</span>
                <nav className="vs-sidebar-nav" style={{ flexGrow: 0 }}>
                    <button className="vs-nav-item"><LogOut size={16} /> Logout</button>
                </nav>
            </aside>

            {/* Main */}
            <main className="vs-main">
                {/* Top Bar */}
                <div className="vs-topbar">
                    <div className="vs-topbar-title">
                        <h1>Settings</h1>
                        <p>Manage your vendor profile, security, and portal preferences.</p>
                    </div>
                    <div className="vs-topbar-actions">
                        {hasChanges && <div className="vs-unsaved-dot" title="Unsaved changes" />}
                        <button className="vs-btn-primary" onClick={handleSave}>
                            <Save size={15} /> Save Changes
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="vs-content">
                    {/* Tabs */}
                    <div className="vs-tabs">
                        {TABS.map(t => (
                            <button
                                key={t.id}
                                className={`vs-tab ${activeTab === t.id ? 'active' : ''} ${t.danger ? 'danger' : ''}`}
                                onClick={() => setActiveTab(t.id)}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {t.icon} {t.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'profile' && <ProfileTab form={form} setForm={setForm} />}
                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'notifications' && <NotificationsTab />}
                    {activeTab === 'preferences' && <PreferencesTab />}
                    {activeTab === 'danger' && <DangerZoneTab onShowModal={setModal} />}
                </div>
            </main>

            {/* Modal */}
            {modal && <ConfirmModal type={modal} onClose={() => setModal(null)} />}

            {/* Toast */}
            {toast && (
                <div className={`vs-toast ${toast.type === 'err' ? 'error' : ''}`}>
                    <CheckCircle size={16} />
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default VendorSettings;
