
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VENDOR_PACKAGES } from '../mockData/vendors';
import { Star, Check } from 'lucide-react';

const HostMarketplace = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

    const filteredPackages = VENDOR_PACKAGES.filter(p => p.category === category || (category === 'event' && p.category === 'wedding')); // Mock filtering

    const handleSelect = (pkgId: string) => {
        navigate(`/payment/${pkgId}`);
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>Find {category} Packages</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Select a package to start planning your event.</p>

            <div className="marketplace-grid">
                {filteredPackages.map((pkg) => (
                    <div key={pkg.id} className="vendor-card">
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
                                {pkg.services.map((service, idx) => (
                                    <div key={idx} className="service-item">
                                        <Check size={12} className="text-primary" /> {service}
                                    </div>
                                ))}
                            </div>

                            <div className="price-tag">${pkg.price.toLocaleString()}</div>

                            <button
                                className="btn btn-primary w-full"
                                onClick={() => handleSelect(pkg.id)}
                            >
                                Select Package
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
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
                    transition: transform 0.2s;
                }
                .vendor-card:hover {
                    box-shadow: var(--shadow-lg);
                    transform: translateY(-2px);
                }
                .vendor-img {
                    height: 200px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
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
                .vendor-content {
                    padding: 1.5rem;
                }
                .vendor-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                }
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
                .services-list {
                    margin-bottom: 1.5rem;
                }
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
            `}</style>
        </div>
    );
};

export default HostMarketplace;
