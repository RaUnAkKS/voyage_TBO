
import { useParams, useNavigate } from 'react-router-dom';
import { VENDOR_PACKAGES } from '../mockData/vendors';
import { Star, Check } from 'lucide-react';

const HostMarketplace = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    // URL param may be plural ('events', 'conferences', 'meetings') while
    // VENDOR_PACKAGES uses singular keys ('event', 'conference', 'meeting')
    const categoryMap: Record<string, string> = {
        weddings: 'wedding', wedding: 'wedding',
        events: 'event', event: 'event',
        conferences: 'conference', conference: 'conference',
        meetings: 'meeting', meeting: 'meeting',
    };
    const normalisedCat = categoryMap[category ?? ''] ?? category ?? '';
    const filteredPackages = VENDOR_PACKAGES.filter(p => p.category === normalisedCat);

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
                        fontFamily: 'var(--font-family-serif)',
                        fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        letterSpacing: '-0.3px',
                        marginBottom: '0.5rem',
                    }}>
                        {displayName} Packages
                    </h1>
                    <p style={{ color: '#B5B5B5', fontSize: '0.95rem' }}>
                        Select a curated package to start planning your event.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="marketplace-grid">
                    {filteredPackages.length === 0 && (
                        <p style={{ color: '#B5B5B5', gridColumn: '1 / -1', padding: '2rem 0' }}>
                            No packages available for this category yet.
                        </p>
                    )}
                    {filteredPackages.map((pkg) => (
                        <div key={pkg.id} className="vendor-card">
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
                                    {pkg.services.map((service, idx) => (
                                        <div key={idx} className="service-item">
                                            <Check size={11} color="#C6A75E" strokeWidth={3} />
                                            {service}
                                        </div>
                                    ))}
                                </div>

                                <div className="vendor-price">${pkg.price.toLocaleString()}</div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
                                    onClick={() => handleSelect(pkg.id)}
                                >
                                    Select Package
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
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
                }
                .vendor-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,167,94,0.45);
                    border-color: rgba(198,167,94,0.45);
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
                .vendor-content { padding: 1.5rem; }
                .vendor-title {
                    font-family: var(--font-family-serif);
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: #FFFFFF;
                    line-height: 1.3;
                    flex: 1;
                }
                .vendor-description {
                    font-size: 0.875rem;
                    color: #B5B5B5;
                    line-height: 1.55;
                    margin-bottom: 1rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .services-list { margin-bottom: 1.25rem; }
                .service-item {
                    font-size: 0.82rem;
                    display: flex;
                    align-items: center;
                    gap: 0.45rem;
                    margin-bottom: 0.3rem;
                    color: #B5B5B5;
                }
                .vendor-price {
                    font-family: var(--font-family-serif);
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #C6A75E;
                    margin-bottom: 1rem;
                    letter-spacing: -0.5px;
                }
                @media (max-width: 640px) {
                    .marketplace-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default HostMarketplace;
