import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, X, Check } from 'lucide-react';
import '../styles/HostEventForm.css';

// ── DATA ────────────────────────────────────────────────────────────────────
const EVENT_TYPES: Record<string, string[]> = {
    wedding: ['Haldi', 'Mehndi', 'Sangeet', 'Wedding'],
    events: ['Birthday Party', 'Anniversary', 'Private Party', 'Festival Event'],
    conferences: ['Tech Conference', 'Business Summit', 'Startup Meet', 'Workshop'],
    meetings: ['Corporate Meeting', 'Board Meeting', 'Client Meeting', 'Team Meeting'],
};

const CATEGORY_HEADINGS: Record<string, { title: string; sub: string }> = {
    wedding: { title: 'Plan Your Wedding Event', sub: 'Provide details to begin planning your celebration.' },
    events: { title: 'Plan Your Event', sub: 'Share the details so we can start building your experience.' },
    conferences: { title: 'Organise Your Conference', sub: 'Tell us what you need and we will take it from there.' },
    meetings: { title: 'Schedule Your Meeting', sub: 'Provide the specifics to arrange the ideal session.' },
};

const DEFAULT_H = { title: 'Plan Your Event', sub: 'Provide details to begin planning.' };

const GUEST_RANGES = ['50 – 100', '100 – 300', '300 – 600', '600+'];
const ROOM_RANGES = ['5 – 10', '10 – 20', '20 – 50', '50+'];
const WHO_OPTIONS = ['Bride Side', 'Groom Side', 'Both Families'];
const THEME_OPTIONS = [
    'Ethnic Traditional', 'Rajasthani Royal', 'Mughal Theme',
    'South Indian Temple Style', 'Western Classic', 'Boho Chic',
    'Minimal Elegant', 'Luxury Palace', 'Bollywood Glam', 'Pastel Floral',
];
const DESTINATION_OPTIONS = [
    'Beach Wedding', 'Mountain Retreat', 'Palace / Heritage Venue',
    'Destination Abroad', 'Luxury Resort', 'Garden Wedding',
    'Temple Wedding', 'Banquet Hall',
];

const BUDGET_MIDPOINTS: Record<string, number> = {
    '50k-1L': 75000, '1L-3L': 200000, '3L-5L': 400000, '5L+': 600000,
};
const GUEST_MIDPOINTS: Record<string, number> = {
    '50 – 100': 75, '100 – 300': 200, '300 – 600': 450, '600+': 700,
};

function budgetPerGuest(budget: string, guests: string): string | null {
    const b = BUDGET_MIDPOINTS[budget];
    const g = GUEST_MIDPOINTS[guests];
    if (!b || !g) return null;
    return `₹${Math.round(b / g).toLocaleString('en-IN')}`;
}

function normalise(cat: string): string {
    const m: Record<string, string> = {
        wedding: 'wedding', weddings: 'wedding',
        event: 'events', events: 'events',
        conference: 'conferences', conferences: 'conferences',
        meeting: 'meetings', meetings: 'meetings',
    };
    return m[cat] ?? cat;
}

// ── MULTI-SELECT ─────────────────────────────────────────────────────────────
interface MSProps { options: string[]; selected: string[]; onChange: (v: string[]) => void; placeholder?: string; error?: boolean; }

const MultiSelect = ({ options, selected, onChange, placeholder = 'Select…', error }: MSProps) => {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQ(''); } };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
    const toggle = (o: string) => onChange(selected.includes(o) ? selected.filter(s => s !== o) : [...selected, o]);
    const remove = (o: string, e: React.MouseEvent) => { e.stopPropagation(); onChange(selected.filter(s => s !== o)); };

    return (
        <div className={`ef-ms ${error ? 'ef-ms--err' : ''}`} ref={ref}>
            <div className={`ef-ms-box ${open ? 'ef-ms-box--open' : ''}`} onClick={() => setOpen(v => !v)}>
                <div className="ef-ms-tags">
                    {selected.length === 0 ? <span className="ef-ms-ph">{placeholder}</span> : null}
                    {selected.map(s => (
                        <span key={s} className="ef-ms-tag">
                            {s}
                            <button type="button" onClick={e => remove(s, e)} aria-label={`Remove ${s}`}><X size={10} /></button>
                        </span>
                    ))}
                </div>
                <ChevronDown size={14} className={`ef-ms-chevron ${open ? 'ef-ms-chevron--open' : ''}`} />
            </div>
            {open && (
                <div className="ef-ms-drop">
                    <input className="ef-ms-search" type="text" placeholder="Search…" value={q}
                        onChange={e => setQ(e.target.value)} onClick={e => e.stopPropagation()} autoFocus />
                    <ul role="listbox" aria-multiselectable="true">
                        {filtered.length === 0 && <li className="ef-ms-empty">No results</li>}
                        {filtered.map(opt => {
                            const sel = selected.includes(opt);
                            return (
                                <li key={opt} role="option" aria-selected={sel}
                                    className={`ef-ms-opt ${sel ? 'ef-ms-opt--sel' : ''}`}
                                    onClick={() => toggle(opt)}>
                                    <span className={`ef-ms-cb ${sel ? 'ef-ms-cb--on' : ''}`}>
                                        {sel && <Check size={9} strokeWidth={3} />}
                                    </span>
                                    {opt}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

// ── FIELD WRAPPER ────────────────────────────────────────────────────────────
const Field = ({ label, required, children, error, hint }: {
    label: string; required?: boolean; children: React.ReactNode; error?: string; hint?: string;
}) => (
    <div className="ef-field">
        <label className="ef-label">{label}{required && <span aria-hidden="true"> *</span>}</label>
        {children}
        {hint && <span className="ef-hint">{hint}</span>}
        {error && <span className="ef-err" role="alert">{error}</span>}
    </div>
);

// ── NATIVE SELECT ────────────────────────────────────────────────────────────
const Select = ({ id, value, onChange, children, error }: {
    id?: string; value: string; onChange: (v: string) => void; children: React.ReactNode; error?: boolean;
}) => (
    <div className="ef-sel-wrap">
        <select id={id} className={`ef-sel ${error ? 'ef-sel--err' : ''}`}
            value={value} onChange={e => onChange(e.target.value)}>
            {children}
        </select>
        <ChevronDown size={14} className="ef-sel-icon" />
    </div>
);

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
type Pkg = 'custom' | 'designed' | null;

const HostEventForm = () => {
    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const cat = normalise((sp.get('category') || '').toLowerCase());
    const isWedding = cat === 'wedding';
    const heading = CATEGORY_HEADINGS[cat] ?? DEFAULT_H;
    const typeOptions = EVENT_TYPES[cat] ?? EVENT_TYPES['wedding'];

    // Core fields
    const [types, setTypes] = useState<string[]>([]);
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [pkg, setPkg] = useState<Pkg>(null);

    // Wedding fields
    const [guests, setGuests] = useState('');
    const [rooms, setRooms] = useState('');
    const [who, setWho] = useState('');
    const [themes, setThemes] = useState<string[]>([]);
    const [dest, setDest] = useState('');

    // Validation
    const [tried, setTried] = useState(false);
    const [dateErr, setDateErr] = useState('');
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => { setTypes([]); setGuests(''); setRooms(''); setWho(''); setThemes([]); setDest(''); setTried(false); }, [cat]);
    useEffect(() => { setDateErr(start && end && end < start ? 'End date cannot be before start date.' : ''); }, [start, end]);

    const weddingOk = !isWedding || Boolean(guests && rooms && who && themes.length > 0 && dest);
    const valid = Boolean(types.length > 0 && location.trim() && budget && start && end && !dateErr && pkg && weddingOk);

    const submit = () => {
        setTried(true);
        if (!valid) return;
        navigate(pkg === 'custom' ? '/host/customize' : `/host/marketplace/${cat}`);
    };

    const perGuest = budgetPerGuest(budget, guests);

    return (
        <div className="ef-page">
            <div className="ef-container">

                {/* Header */}
                <header className="ef-head">
                    {cat && <p className="ef-cat">{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>}
                    <h1 className="ef-h1">{heading.title}</h1>
                    <p className="ef-sub">{heading.sub}</p>
                </header>

                {/* Form card */}
                <div className="ef-card">

                    {/* ── Event Type ── */}
                    <Field label="Event Type" required error={tried && types.length === 0 ? 'Select at least one type.' : undefined}>
                        <MultiSelect options={typeOptions} selected={types}
                            onChange={v => setTypes(v)}
                            placeholder={`Select ${cat || 'event'} types…`}
                            error={tried && types.length === 0} />
                    </Field>

                    {/* ── Location + Budget ── */}
                    <div className="ef-row">
                        <Field label="Location" required>
                            <input className="ef-input" type="text" placeholder="City or venue"
                                value={location} onChange={e => setLocation(e.target.value)} />
                        </Field>
                        <Field label="Budget" required>
                            <Select value={budget} onChange={setBudget}>
                                <option value="">Select range…</option>
                                <option value="50k-1L">₹50,000 – ₹1,00,000</option>
                                <option value="1L-3L">₹1,00,000 – ₹3,00,000</option>
                                <option value="3L-5L">₹3,00,000 – ₹5,00,000</option>
                                <option value="5L+">₹5,00,000+</option>
                            </Select>
                        </Field>
                    </div>

                    {/* ── Dates ── */}
                    <div className="ef-row">
                        <Field label="Start Date" required>
                            <input className="ef-input" type="date" min={today}
                                value={start} onChange={e => setStart(e.target.value)} />
                        </Field>
                        <Field label="End Date" required error={dateErr || undefined}>
                            <input className={`ef-input ${dateErr ? 'ef-input--err' : ''}`} type="date"
                                min={start || today} value={end} onChange={e => setEnd(e.target.value)} />
                        </Field>
                    </div>

                    {/* ── Wedding-only fields ── */}
                    {isWedding && (
                        <>
                            {/* Guests + Rooms */}
                            <div className="ef-row">
                                <Field label="Number of Guests" required hint="Estimated total attending"
                                    error={tried && !guests ? 'Required.' : undefined}>
                                    <Select value={guests} onChange={setGuests} error={tried && !guests}>
                                        <option value="">Select range…</option>
                                        {GUEST_RANGES.map(r => <option key={r} value={r}>{r} guests</option>)}
                                    </Select>
                                    {perGuest && <p className="ef-per-guest">Approx. {perGuest} per guest</p>}
                                </Field>
                                <Field label="Rooms Required" required hint="For guest accommodation"
                                    error={tried && !rooms ? 'Required.' : undefined}>
                                    <Select value={rooms} onChange={setRooms} error={tried && !rooms}>
                                        <option value="">Select range…</option>
                                        {ROOM_RANGES.map(r => <option key={r} value={r}>{r} rooms</option>)}
                                    </Select>
                                </Field>
                            </div>

                            {/* Who is it for */}
                            <Field label="Who is the event for?" required
                                error={tried && !who ? 'Required.' : undefined}>
                                <div className="ef-pills">
                                    {WHO_OPTIONS.map(opt => (
                                        <button key={opt} type="button"
                                            className={`ef-pill ${who === opt ? 'ef-pill--on' : ''}`}
                                            onClick={() => setWho(opt)}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {/* Theme / Customisation */}
                            <Field label="Theme / Customisation Style" required
                                error={tried && themes.length === 0 ? 'Select at least one.' : undefined}>
                                <div className="ef-chips">
                                    {THEME_OPTIONS.map(t => (
                                        <button key={t} type="button"
                                            className={`ef-chip ${themes.includes(t) ? 'ef-chip--on' : ''}`}
                                            onClick={() => setThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {/* Destination Preference */}
                            <Field label="Preferred Destination Type" required
                                error={tried && !dest ? 'Required.' : undefined}>
                                <div className="ef-dest">
                                    {DESTINATION_OPTIONS.map(d => (
                                        <button key={d} type="button"
                                            className={`ef-dest-btn ${dest === d ? 'ef-dest-btn--on' : ''}`}
                                            onClick={() => setDest(d)}>
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        </>
                    )}

                    {/* ── Package Selection ── */}
                    <div className="ef-divider-line" />

                    <Field label="How would you like to plan?">
                        <div className="ef-row">
                            <button type="button"
                                className={`ef-pkg ${pkg === 'custom' ? 'ef-pkg--on' : ''}`}
                                onClick={() => setPkg('custom')} aria-pressed={pkg === 'custom'}>
                                <strong>Build Custom Package</strong>
                                <span>Choose vendors and services individually.</span>
                            </button>
                            <button type="button"
                                className={`ef-pkg ${pkg === 'designed' ? 'ef-pkg--on' : ''}`}
                                onClick={() => setPkg('designed')} aria-pressed={pkg === 'designed'}>
                                <strong>Choose Designed Package</strong>
                                <span>Select from curated packages by our team.</span>
                            </button>
                        </div>
                        {tried && !pkg && <span className="ef-err" role="alert">Please choose a planning option.</span>}
                    </Field>

                    {/* ── Submit ── */}
                    <div className="ef-submit-row">
                        <button className={`ef-submit ${valid ? 'ef-submit--on' : ''}`} onClick={submit}>
                            Continue
                        </button>
                        {tried && !valid && <p className="ef-submit-hint">Please complete all required fields above.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostEventForm;
