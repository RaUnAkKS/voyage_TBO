import { useState, useCallback, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    User, Shield, Bell, Sliders, AlertTriangle, Save, CheckCircle,
} from 'lucide-react';
import '../../../styles/VendorSettings.css';
import '../../../styles/VendorLayout.css';

// ── Shared types (used across sub-pages) ──────────────────────────────────────
export interface VendorProfile {
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

export const INITIAL_FORM: VendorProfile = {
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

// Outlet context type
export type SettingsCtx = {
    form: VendorProfile;
    setForm: (f: VendorProfile) => void;
    modal: 'deactivate' | 'delete' | null;
    setModal: (v: 'deactivate' | 'delete' | null) => void;
};

import { useOutletContext } from 'react-router-dom';
export const useSettingsCtx = () => useOutletContext<SettingsCtx>();

// ── Confirmation Modal ────────────────────────────────────────────────────────
export const ConfirmModal = ({
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
                    <button
                        className="vs-btn-danger"
                        style={{ opacity: valid ? 1 : 0.4, cursor: valid ? 'pointer' : 'not-allowed' }}
                    >
                        {type === 'delete' ? 'Delete Permanently' : 'Deactivate Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════════════
//  SETTINGS LAYOUT
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
    { to: 'profile', label: 'Profile', icon: <User size={14} /> },
    { to: 'security', label: 'Security', icon: <Shield size={14} /> },
    { to: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { to: 'preferences', label: 'Preferences', icon: <Sliders size={14} /> },
    { to: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={14} />, danger: true },
];

const SettingsLayout = () => {
    const [form, setFormRaw] = useState<VendorProfile>(INITIAL_FORM);
    const [hasChanges, setHasChanges] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
    const [modal, setModal] = useState<'deactivate' | 'delete' | null>(null);

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

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    return (
        <div>
            {/* Topbar */}
            <div className="vl-topbar">
                <div className="vl-topbar-title">
                    <h1>Settings</h1>
                    <p>Manage your vendor profile, security, and portal preferences.</p>
                </div>
                <div className="vl-topbar-actions">
                    {hasChanges && <div className="vs-unsaved-dot" title="Unsaved changes" />}
                    <button className="vl-btn-primary" onClick={handleSave}>
                        <Save size={15} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Sub-route tab bar */}
            <div className="vl-subtabs">
                {TABS.map(t => (
                    <NavLink
                        key={t.to}
                        to={t.to}
                        className={({ isActive }) =>
                            `vl-subtab${t.danger ? ' danger' : ''}${isActive ? ' active' : ''}`
                        }
                    >
                        {t.icon} {t.label}
                    </NavLink>
                ))}
            </div>

            {/* Content */}
            <div className="vl-content" style={{ maxWidth: 900, animation: 'vl-fadein 0.25s ease' }}>
                <Outlet context={{ form, setForm, modal, setModal } satisfies SettingsCtx} />
            </div>

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

export default SettingsLayout;
