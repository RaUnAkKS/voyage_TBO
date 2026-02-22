import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useSettingsCtx } from './SettingsLayout';
import '../../../styles/VendorSettings.css';

const SERVICE_OPTIONS = [
    'TECHNICAL', 'FURNITURE', 'DECOR', 'STAFF',
    'CATERING', 'ACCOMMODATION', 'FLOOR_SPACE', 'AV & LIGHTING',
];

const ProfileSettings = () => {
    const { form, setForm } = useSettingsCtx();
    const [tagInput, setTagInput] = useState('');

    const set = (key: keyof typeof form) => (v: string) =>
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
        reader.onload = ev => setForm({ ...form, logoUrl: ev.target?.result as string });
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
                            <button className="vs-btn-ghost" onClick={() => setForm({ ...form, logoUrl: '' })}>Remove</button>
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

export default ProfileSettings;
