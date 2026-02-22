import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { VENDOR_PACKAGES } from '../mockData/vendors';
import { Star, Check, Sparkles } from 'lucide-react';

const HostMarketplace = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Catch the data passed from the Questionnaire
    const formData = location.state?.formData;

    // 1. Base Filter - Added fallback (VENDOR_PACKAGES || []) to prevent map/filter crashes
    let processedPackages = (VENDOR_PACKAGES || []).filter(p => 
        p && (p.category === category || ((category === 'event' || category === 'events') && p.category === 'wedding'))
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

            // Theme Matcher - Added safety nets for missing descriptions or services
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

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                {formData ? `Your Personalized ${category} Packages` : `Find ${category} Packages`}
            </h1>
            
            {formData ? (
                <div className="personalized-banner">
                    <Sparkles size={18} className="text-primary" />
                    <p>Based on your budget and <strong>{Array.isArray(formData.themes) ? formData.themes.join(', ') : 'event'}</strong> theme, we've found these top matches for your {formData.guests ? `${formData.guests} guests` : 'event'}.</p>
                </div>
            ) : (
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Select a package to start planning your event.</p>
            )}

            <div className="marketplace-grid">
                {processedPackages.map((pkg, index) => {
                    // Give a recommendation badge to the top 2 scoring packages if we have form data
                    const isRecommended = formData && (pkg as any).score >= 5 && index < 2;

                    return (
                        <div key={pkg.id} className={`vendor-card ${isRecommended ? 'recommended-card' : ''}`}>
                            {isRecommended && (
                                <div className="recommended-badge">
                                    <Sparkles size={12} /> Recommended for You
                                </div>
                            )}
                            <div className="vendor-img" style={{ backgroundImage: `url(${pkg.image})` }}>
                                <div className="badge">{pkg.category}</div>
                            </div>
                            <div className="vendor-content">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="vendor-title">{pkg.name}</h3>
                                    <div className="rating flex items-center gap-1">
                                        <Star size={14} fill="#FFD700" color="#FFD700" />
                                        <span>{pkg.rating}</span>
                                    </div>
                                </div>
                                <p className="description">{pkg.description}</p>

                                <div className="services-list">
                                    {Array.isArray(pkg.services) && pkg.services.map((service, idx) => (
                                        <div key={idx} className="service-item">
                                            <Check size={12} className="text-primary" /> {service}
                                        </div>
                                    ))}
                                </div>

                                <div className="price-tag">${(pkg.price || 0).toLocaleString()}</div>

                                <button
                                    className={`btn w-full ${isRecommended ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleSelect(pkg.id)}
                                >
                                    Select Package
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .personalized-banner {
                    background-color: rgba(197, 165, 114, 0.1);
                    border: 1px solid var(--primary-color);
                    border-radius: 8px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: var(--text-primary);
                }
                .personalized-banner p { margin: 0; }
                
                .marketplace-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .vendor-card {
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                }
                .vendor-card:hover {
                    box-shadow: var(--shadow-lg);
                    transform: translateY(-2px);
                }
                .recommended-card {
                    border: 2px solid var(--primary-color);
                    box-shadow: 0 4px 15px rgba(197, 165, 114, 0.2);
                }
                .recommended-badge {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background: var(--primary-color);
                    color: white;
                    text-align: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.25rem 0;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.25rem;
                    z-index: 10;
                }
                .vendor-img {
                    height: 200px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    margin-top: 24px;
                }
                .vendor-card:not(.recommended-card) .vendor-img {
                    margin-top: 0;
                }
                .badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .vendor-content { padding: 1.5rem; }
                .vendor-title { font-size: 1.25rem; font-weight: 700; }
                .mb-2 { margin-bottom: 0.5rem; }
                .description {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .services-list { margin-bottom: 1.5rem; }
                .service-item {
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.25rem;
                    color: var(--text-secondary);
                }
                .price-tag {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }
                .w-full { width: 100%; }
                
                .btn-secondary {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                }
                .btn-secondary:hover {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }
            `}</style>
        </div>
    );
};

export default HostMarketplace;