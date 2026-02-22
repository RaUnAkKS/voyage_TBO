import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { VENDOR_PACKAGES } from '../mockData/vendors';
import { Star, Check, Sparkles } from 'lucide-react';

const HostMarketplace = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Catch the data passed from the Questionnaire
    const formData = location.state?.formData;

    // Fix plural URLs ('events', 'weddings') matching singular data ('event', 'wedding')
    const categoryMap: Record<string, string> = {
        weddings: 'wedding', wedding: 'wedding',
        events: 'event', event: 'event',
        conferences: 'conference', conference: 'conference',
        meetings: 'meeting', meeting: 'meeting',
    };
    const normalisedCat = categoryMap[category?.toLowerCase() ?? ''] ?? category ?? 'event';

    // 1. Base Filter - Fallback included to prevent crashes
    let processedPackages = (VENDOR_PACKAGES || []).filter(p => 
        p && p.category.toLowerCase() === normalisedCat
    );

    // 2. Recommendation Engine (if formData exists)
    if (formData) {
        processedPackages = processedPackages.map(pkg => {
            let score = 0;
            const price = pkg.price || 0; // Safety net for missing price

            // Budget Matcher 
            if (formData.budget === '50k-1L' && price < 100000) score += 5;
            if (formData.budget === '1L-3L' && price >= 100000 && price <= 300000) score += 5;
            if (formData.budget === '3L-5L' && price >= 300000 && price <= 500000) score += 5;
            if (formData.budget === '5L+' && price > 500000) score += 5;

            // Theme Matcher
            if (Array.isArray(formData.themes) && formData.themes.length > 0) {
                const safeDescription = pkg.description || "";
                const safeServices = Array.isArray(pkg.services) ? pkg.services.join(" ") : "";
                const pkgText = (safeDescription + " " + safeServices).toLowerCase();
                
                formData.themes.forEach((theme: string) => {
                    const themeKeywords = theme.toLowerCase().split(' ');
                    themeKeywords.forEach(word => {
                        if (word.length > 3 && pkgText.includes(word)) score += 2;
                    });
                });
            }

            return { ...pkg, score };
        })
        // Sort highest scores first
        .sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    const handleSelect = (pkgId: string) => {
        navigate(`/payment/${pkgId}`);
    };

    const displayName = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : 'Event';

    return (
        <div style={{ background: '#121212', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div style={{
                background: '#1A1A1D',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '3rem 0 2.5rem',
                marginBottom: '2.5rem',
            }}>
                <div className="container">
                    <p style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#C6A75E',
                        marginBottom: '0.5rem',
                    }}>
                        Designed Packages
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-family-serif, serif)',
                        fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        letterSpacing: '-0.3px',
                        marginBottom: '0.5rem',
                    }}>
                        {formData ? `Your Personalized ${displayName} Packages` : `${displayName} Packages`}
                    </h1>
                    
                    {formData ? (
                        <div className="personalized-banner mt-4">
                            <Sparkles size={18} color="#C6A75E" />
                            <p style={{ color: '#F5F5F5', margin: 0, fontSize: '0.95rem' }}>
                                Based on your budget and <strong>{Array.isArray(formData.themes) ? formData.themes.join(', ') : 'event'}</strong> theme, we've found these top matches for your {formData.guests ? `${formData.guests} guests` : 'event'}.
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: '#B5B5B5', fontSize: '0.95rem' }}>
                            Select a curated package to start planning your event.
                        </p>
                    )}
                </div>
            </div>

            <div className="container">
                <div className="marketplace-grid">
                    {processedPackages.length === 0 && (
                        <p style={{ color: '#B5B5B5', gridColumn: '1 / -1', padding: '2rem 0', textAlign: 'center' }}>
                            No packages available for this category yet.
                        </p>
                    )}
                    
                    {processedPackages.map((pkg, index) => {
                        // Give a recommendation badge to the top 2 scoring packages if we have form data
                        const isRecommended = formData && (pkg as any).score >= 5 && index < 2;

                        return (
                            <div key={pkg.id} className={`vendor-card ${isRecommended ? 'recommended-card' : ''}`}>
                                {/* Recommendation Badge */}
                                {isRecommended && (
                                    <div className="recommended-badge">
                                        <Sparkles size={12} /> Recommended for You
                                    </div>
                                )}

                                {/* Image */}
                                <div className="vendor-img-wrap">
                                    <div
                                        className="vendor-img"
                                        style={{ backgroundImage: `url(${pkg.image})` }}
                                    />
                                    <span className="vendor-badge">{pkg.category}</span>
                                </div>

                                {/* Content */}
                                <div className="vendor-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                                        <h3 className="vendor-title">{pkg.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                                            <Star size={13} fill="#C6A75E" color="#C6A75E" />
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#B5B5B5' }}>{pkg.rating}</span>
                                        </div>
                                    </div>

                                    <p className="vendor-description">{pkg.description}</p>

                                    <div className="services-list">
                                        {Array.isArray(pkg.services) && pkg.services.map((service, idx) => (
                                            <div key={idx} className="service-item">
                                                <Check size={11} color="#C6A75E" strokeWidth={3} />
                                                {service}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="vendor-price">₹{(pkg.price || 0).toLocaleString('en-IN')}</div>

                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                                        onClick={() => handleSelect(pkg.id)}
                                    >
                                        Select Package
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .personalized-banner {
                    background-color: rgba(198, 167, 94, 0.08);
                    border: 1px solid rgba(198, 167, 94, 0.3);
                    border-radius: 8px;
                    padding: 1rem 1.5rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .marketplace-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }
                
                .vendor-card {
                    background: #1E1E1E;
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                
                .vendor-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,167,94,0.45);
                    border-color: rgba(198,167,94,0.45);
                }

                .recommended-card {
                    border: 1px solid #C6A75E;
                    box-shadow: 0 4px 20px rgba(198, 167, 94, 0.15);
                }

                .recommended-badge {
                    background: #C6A75E;
                    color: #121212;
                    text-align: center;
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 0.35rem 0;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.35rem;
                    letter-spacing: 1px;
                }

                .vendor-img-wrap {
                    height: 240px;
                    overflow: hidden;
                    position: relative;
                }
                
                .vendor-img {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s ease;
                }
                
                .vendor-card:hover .vendor-img {
                    transform: scale(1.06);
                    filter: brightness(1.08) saturate(1.1);
                }
                
                .vendor-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: rgba(10,10,10,0.75);
                    backdrop-filter: blur(6px);
                    color: #C6A75E;
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    padding: 0.25rem 0.65rem;
                    border-radius: 20px;
                    border: 1px solid rgba(198,167,94,0.35);
                }
                
                .vendor-content { 
                    padding: 1.5rem; 
                    display: flex; 
                    flex-direction: column; 
                    flex: 1; 
                }
                
                .vendor-title {
                    font-family: var(--font-family-serif, serif);
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #FFFFFF;
                    line-height: 1.3;
                    margin: 0;
                }
                
                .vendor-description {
                    font-size: 0.875rem;
                    color: #B5B5B5;
                    line-height: 1.55;
                    margin-bottom: 1.25rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .services-list { margin-bottom: 1.5rem; }
                
                .service-item {
                    font-size: 0.82rem;
                    display: flex;
                    align-items: center;
                    gap: 0.45rem;
                    margin-bottom: 0.35rem;
                    color: #B5B5B5;
                }
                
                .vendor-price {
                    font-family: var(--font-family-serif, serif);
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #C6A75E;
                    margin-bottom: 1.25rem;
                    letter-spacing: -0.5px;
                }
                
                .mt-4 { margin-top: 1rem; }

                @media (max-width: 640px) {
                    .marketplace-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default HostMarketplace;