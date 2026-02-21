import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

// ── Local assets (same as HeroCarousel) ──────────────────────────────────────
import weddingImg from '../assets/carousel/wedding.jpg';
import conferenceImg from '../assets/carousel/conference.jpg';
import meetingImg from '../assets/carousel/meeting.jpg';
import concertImg from '../assets/carousel/concert.jpg';

// ── Data ──────────────────────────────────────────────────────────────────────
const EXPERIENCE_TILES = [
    {
        id: 1,
        tag: 'Weddings',
        title: 'Grand Wedding Celebrations',
        image: weddingImg,
        link: '/category/wedding',
    },
    {
        id: 2,
        tag: 'Intimate',
        title: 'Intimate Celebrations',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=900',
        link: '/category/events',
    },
    {
        id: 3,
        tag: 'Corporate',
        title: 'Corporate Excellence',
        image: conferenceImg,
        link: '/category/conferences',
    },
    {
        id: 4,
        tag: 'Music & Culture',
        title: 'Music & Festivals',
        image: concertImg,
        link: '/category/events',
    },
];

const FEATURED_PACKAGES = [
    {
        id: 1,
        badge: 'Most Popular',
        title: 'Royal Garden Wedding',
        sub: 'Complete venue, décor, catering & photography',
        price: '₹2,00,000',
        image: weddingImg,
        link: '/category/wedding',
        large: true,
    },
    {
        id: 2,
        badge: 'Conference',
        title: 'Annual Tech Innovators Summit',
        sub: 'Grand Convention Center · Full AV Setup',
        price: '$3,500',
        image: conferenceImg,
        link: '/category/conferences',
        large: false,
    },
    {
        id: 3,
        badge: 'Festival',
        title: 'Beats & Lights Music Festival',
        sub: 'Open Air Arena · Professional Stage',
        price: '$8,000',
        image: concertImg,
        link: '/category/events',
        large: false,
    },
];



const STATS = [
    { end: 1000, suffix: '+', label: 'Events Hosted' },
    { end: 500, suffix: '+', label: 'Happy Clients' },
    { end: 300, suffix: '+', label: 'Premium Venues' },
    { end: 50, suffix: '+', label: 'Expert Planners' },
];

// ── Planner state types ────────────────────────────────────────────────────────
type PlannerState = { type: string; budget: string; location: string };
const EVENT_TYPES = ['Wedding', 'Corporate', 'Festival', 'Meeting'];
const BUDGETS = ['Under ₹1L', '₹1L–3L', '₹3L–10L', '₹10L+'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Any'];

// ── Scroll-fade hook ──────────────────────────────────────────────────────────
function useScrollReveal(rootRef: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const items = el.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) {
                    (e.target as HTMLElement).classList.add('visible');
                    obs.unobserve(e.target);
                }
            }),
            { threshold: 0.12 }
        );
        items.forEach(i => obs.observe(i));
        return () => obs.disconnect();
    }, []);
}

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(end: number, active: boolean) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const duration = 1800;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [active, end]);
    return count;
}

// ── StatCard (uses counter) ───────────────────────────────────────────────────
function StatCard({ end, suffix, label, active }: { end: number; suffix: string; label: string; active: boolean }) {
    const count = useCountUp(end, active);
    return (
        <div className="stat-card">
            <div className="stat-number">{count.toLocaleString()}{suffix}</div>
            <div className="stat-desc">{label}</div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const Landing = () => {
    // Planner selections
    const [planner, setPlanner] = useState<PlannerState>({ type: '', budget: '', location: '' });

    // Stats counter activation
    const statsRef = useRef<HTMLDivElement>(null);
    const [statsActive, setStatsActive] = useState(false);

    // Section refs for scroll reveal
    const plannerRef = useRef<HTMLDivElement>(null);
    const experienceRef = useRef<HTMLDivElement>(null);
    const packagesRef = useRef<HTMLDivElement>(null);
    const howRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    useScrollReveal(plannerRef as React.RefObject<HTMLElement>);
    useScrollReveal(experienceRef as React.RefObject<HTMLElement>);
    useScrollReveal(packagesRef as React.RefObject<HTMLElement>);
    useScrollReveal(howRef as React.RefObject<HTMLElement>);
    useScrollReveal(ctaRef as React.RefObject<HTMLElement>);


    // Activate stats counter when section enters view
    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setStatsActive(true); obs.disconnect(); }
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const handlePlannerSelect = useCallback((key: keyof PlannerState, val: string) => {
        setPlanner(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
    }, []);

    return (
        <div className="landing-page" style={{ background: '#0B1E33' }}>

            {/* ═══════════ 1. CINEMATIC HERO ═══════════ */}
            <section className="hero-section">
                <div
                    className="hero-bg"
                    style={{ backgroundImage: `url(${weddingImg})` }}
                />
                <div className="hero-overlay" />
                <div className="hero-content container">
                    <span className="hero-eyebrow">The Art of Celebration</span>
                    <h1 className="hero-headline">
                        Create Moments<br />
                        That Last <span>Forever</span>
                    </h1>
                    <div className="hero-gold-line" />
                    <p className="hero-tagline">
                        Plan weddings, conferences, and events with curated vendors,
                        expert coordinators, and premium venues — all in one place.
                    </p>
                    <div className="hero-cta-group">
                        <Link to="/category/wedding" className="hero-btn-primary">Start Planning</Link>
                        <Link to="/category/events" className="hero-btn-secondary">Explore Events</Link>
                    </div>
                    <div className="hero-tabs">
                        <Link to="/category/wedding" className="hero-tab">✦ Weddings</Link>
                        <Link to="/category/events" className="hero-tab">✦ Events</Link>
                        <Link to="/category/conferences" className="hero-tab">✦ Conferences</Link>
                        <Link to="/category/meetings" className="hero-tab">✦ Meetings</Link>
                    </div>
                </div>
                <div className="hero-scroll-indicator">
                    <span>Scroll</span>
                    <div className="scroll-arrow" />
                </div>
            </section>

            {/* ═══════════ 2. PLAN YOUR EVENT STRIP ═══════════ */}
            <section className="planner-strip" ref={plannerRef}>
                <div className="container">
                    {/* Section header */}
                    <div className="planner-header fade-in-up">
                        <span className="section-label">Plan Your Event</span>
                        <p className="planner-header-sub">Tell us what you're looking for and we'll find the perfect match.</p>
                    </div>

                    <div className="planner-card fade-in-up delay-1">
                        {/* Step 1 */}
                        <div className="planner-step">
                            <div className="planner-step-badge">
                                <span className="planner-step-circle">01</span>
                                <span className="planner-step-label">Event Type</span>
                            </div>
                            <div className="planner-options">
                                {EVENT_TYPES.map(t => (
                                    <span
                                        key={t}
                                        className={`planner-option ${planner.type === t ? 'selected' : ''}`}
                                        onClick={() => handlePlannerSelect('type', t)}
                                    >{t}</span>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="planner-divider"><div className="planner-divider-line" /><span className="planner-divider-arrow">›</span></div>

                        {/* Step 2 */}
                        <div className="planner-step">
                            <div className="planner-step-badge">
                                <span className="planner-step-circle">02</span>
                                <span className="planner-step-label">Budget Range</span>
                            </div>
                            <div className="planner-options">
                                {BUDGETS.map(b => (
                                    <span
                                        key={b}
                                        className={`planner-option ${planner.budget === b ? 'selected' : ''}`}
                                        onClick={() => handlePlannerSelect('budget', b)}
                                    >{b}</span>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="planner-divider"><div className="planner-divider-line" /><span className="planner-divider-arrow">›</span></div>

                        {/* Step 3 */}
                        <div className="planner-step">
                            <div className="planner-step-badge">
                                <span className="planner-step-circle">03</span>
                                <span className="planner-step-label">Location</span>
                            </div>
                            <div className="planner-options">
                                {LOCATIONS.map(l => (
                                    <span
                                        key={l}
                                        className={`planner-option ${planner.location === l ? 'selected' : ''}`}
                                        onClick={() => handlePlannerSelect('location', l)}
                                    >{l}</span>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="planner-cta">
                            <Link
                                to={planner.type ? `/category/${planner.type.toLowerCase()}` : '/category/wedding'}
                                className="planner-find-btn"
                            >
                                <span>Find Packages</span>
                                <span className="planner-btn-arrow">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ 3. EXPLORE BY EXPERIENCE ═══════════ */}
            <section className="experience-section" ref={experienceRef}>
                <div className="container">
                    <div className="section-header-row">
                        <div>
                            <span className="section-label fade-in-up">Experience</span>
                            <h2 className="section-heading fade-in-up delay-1">Explore by Experience</h2>
                            <p className="section-sub fade-in-up delay-2">
                                Every event deserves its own identity — find yours.
                            </p>
                        </div>
                        <Link to="/category/events" className="hero-btn-secondary fade-in-up delay-3" style={{ fontSize: '0.8rem', padding: '0.65rem 1.5rem' }}>
                            View All →
                        </Link>
                    </div>

                    <div className="experience-grid">
                        {EXPERIENCE_TILES.map((tile, i) => (
                            <Link key={tile.id} to={tile.link} className={`exp-tile fade-in-up delay-${i + 1}`} style={{ textDecoration: 'none' }}>
                                <div className="exp-tile-img" style={{ backgroundImage: `url(${tile.image})` }} />
                                <div className="exp-tile-overlay" />
                                <div className="exp-tile-content">
                                    <div className="exp-tile-tag">{tile.tag}</div>
                                    <div className="exp-tile-title">{tile.title}</div>
                                    <span className="exp-tile-link">Explore → </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ 4. FEATURED PACKAGES — MAGAZINE ═══════════ */}
            <section className="packages-section" ref={packagesRef}>
                <div className="container">
                    <div className="section-header-row">
                        <div>
                            <span className="section-label fade-in-up">Curated</span>
                            <h2 className="section-heading fade-in-up delay-1">Featured Packages</h2>
                            <p className="section-sub fade-in-up delay-2">Hand-picked packages for unforgettable occasions.</p>
                        </div>
                    </div>

                    <div className="magazine-layout">
                        {FEATURED_PACKAGES.map((pkg, i) => (
                            pkg.large ? (
                                <div key={pkg.id} className={`pkg-card-large fade-in-left delay-${i + 1}`}>
                                    <div
                                        className="pkg-img"
                                        style={{ backgroundImage: `url(${pkg.image})`, flexBasis: '60%' }}
                                    />
                                    <div className="pkg-card-body">
                                        <span className="pkg-badge">{pkg.badge}</span>
                                        <div className="pkg-title">{pkg.title}</div>
                                        <div className="pkg-sub">{pkg.sub}</div>
                                        <div className="pkg-footer">
                                            <div className="pkg-price">{pkg.price}</div>
                                            <Link to={pkg.link} className="pkg-book-btn">Book Now</Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div key={pkg.id} className={`pkg-card-sm fade-in-right delay-${i}`}>
                                    <div
                                        className="pkg-img"
                                        style={{ backgroundImage: `url(${pkg.image})`, flexBasis: '55%' }}
                                    />
                                    <div className="pkg-card-body">
                                        <span className="pkg-badge">{pkg.badge}</span>
                                        <div className="pkg-title">{pkg.title}</div>
                                        <div className="pkg-sub">{pkg.sub}</div>
                                        <div className="pkg-footer">
                                            <div className="pkg-price">{pkg.price}</div>
                                            <Link to={pkg.link} className="pkg-book-btn">Book</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ 5. HOW IT WORKS ═══════════ */}
            <section className="how-section" ref={howRef}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 0 }}>
                        <span className="section-label fade-in-up">Simple Process</span>
                        <h2 className="section-heading fade-in-up delay-1" style={{ textAlign: 'center' }}>How It Works</h2>
                        <p className="section-sub fade-in-up delay-2" style={{ margin: '0 auto', textAlign: 'center' }}>
                            From vision to celebration — in three effortless steps.
                        </p>
                    </div>
                    <div className="how-steps">
                        {[
                            { icon: '✦', title: 'Share Your Vision', desc: 'Tell us about your event type, budget, and dream vibe. We listen to every detail.' },
                            { icon: '◈', title: 'We Curate the Best', desc: 'Our experts hand-pick the finest vendors, venues, and packages to match your vision.' },
                            { icon: '✿', title: 'Celebrate Stress-Free', desc: 'Sit back, relax, and immerse yourself while we handle every last detail.' },
                        ].map((step, i) => (
                            <div key={i} className={`how-step fade-in-up delay-${i + 1}`}>
                                <div className="how-step-icon">
                                    {step.icon}
                                    <span className="how-step-num">{i + 1}</span>
                                </div>
                                <div className="how-step-title">{step.title}</div>
                                <div className="how-step-desc">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ 6. STATS ═══════════ */}
            <section className="stats-section" ref={statsRef}>
                <div className="container">
                    <div className="stats-grid">
                        {STATS.map((stat) => (
                            <StatCard key={stat.label} {...stat} active={statsActive} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ 8. FINAL CTA ═══════════ */}
            <section className="cta-section" ref={ctaRef}>
                <div className="cta-bg" style={{ backgroundImage: `url(${meetingImg})` }} />
                <div className="cta-overlay" />
                <div className="cta-content">
                    <span className="cta-eyebrow fade-in-up">Begin Your Journey</span>
                    <h2 className="cta-headline fade-in-up delay-1">
                        Ready to Plan Your<br />Perfect Event?
                    </h2>
                    <p className="cta-sub fade-in-up delay-2">
                        Join thousands of hosts who trusted us to make their celebrations unforgettable.
                    </p>
                    <div className="fade-in-up delay-3">
                        <Link to="/category/wedding" className="hero-btn-primary" style={{ fontSize: '0.92rem', padding: '1rem 2.75rem', marginRight: '1rem' }}>
                            Get Started →
                        </Link>
                        <Link to="/category/events" className="hero-btn-secondary" style={{ fontSize: '0.92rem', padding: '1rem 2rem' }}>
                            Browse Packages
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════ 9. FOOTER ═══════════ */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand */}
                        <div>
                            <span className="footer-brand-name">EventHub</span>
                            <p className="footer-brand-desc">
                                Crafting unforgettable moments for weddings, corporate events, conferences, and celebrations across India.
                            </p>
                            <div className="footer-socials">
                                {['in', 'tw', 'ig', 'fb'].map(s => (
                                    <a key={s} href="#" className="footer-social-link" aria-label={s}>
                                        {s === 'in' ? '𝕃' : s === 'tw' ? '𝕏' : s === 'ig' ? '◉' : '◈'}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <div className="footer-col-title">Quick Links</div>
                            <ul className="footer-links">
                                <li><Link to="/category/wedding">Weddings</Link></li>
                                <li><Link to="/category/events">Events</Link></li>
                                <li><Link to="/category/conferences">Conferences</Link></li>
                                <li><Link to="/category/meetings">Meetings</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <div className="footer-col-title">Services</div>
                            <ul className="footer-links">
                                <li><a href="#">Venue Booking</a></li>
                                <li><a href="#">Vendor Marketplace</a></li>
                                <li><a href="#">Event Planning</a></li>
                                <li><a href="#">Premium Packages</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <div className="footer-col-title">Contact</div>
                            <ul className="footer-links">
                                <li><a href="mailto:hello@eventhub.in">hello@eventhub.in</a></li>
                                <li><a href="tel:+919876543210">+91 98765 43210</a></li>
                                <li><a href="#">Mumbai · Delhi · Bangalore</a></li>
                                <li><a href="#">Mon–Sat, 9am–7pm</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copyright">© 2026 EventHub. Crafted with care for unforgettable celebrations.</p>
                        <div className="footer-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
