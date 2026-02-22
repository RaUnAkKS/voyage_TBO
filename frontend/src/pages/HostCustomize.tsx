import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Plus, ShoppingCart, Sparkles, Star } from 'lucide-react';
import '../styles/HostCustomize.css'; // Importing your new CSS file

// --- MOCK INDIVIDUAL VENDORS ---
const INDIVIDUAL_SERVICES = [
    { id: 'v1', type: 'Venue', name: 'Grand Royal Palace', price: 150000, rating: 4.8, img: 'https://images.unsplash.com/photo-1519225421980-6f03b7a1cd1d?auto=format&fit=crop&q=80&w=600' },
    { id: 'v2', type: 'Venue', name: 'Sunset Beach Resort', price: 200000, rating: 4.9, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600' },
    { id: 'c1', type: 'Catering', name: 'Spice & Savor Catering', price: 80000, rating: 4.7, img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600' },
    { id: 'c2', type: 'Catering', name: 'Global Fusion Feasts', price: 120000, rating: 4.9, img: 'https://images.unsplash.com/photo-1414235077428-33898ed1e829?auto=format&fit=crop&q=80&w=600' },
    { id: 'p1', type: 'Photography', name: 'Lens & Light Studios', price: 50000, rating: 4.8, img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600' },
    { id: 'p2', type: 'Photography', name: 'Candid Moments', price: 35000, rating: 4.6, img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600' },
    { id: 'd1', type: 'Decor', name: 'Floral Fantasy Decorators', price: 60000, rating: 4.7, img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600' },
    { id: 'd2', type: 'Decor', name: 'Elite Event Design', price: 90000, rating: 4.9, img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600' },
];

const HostCustomize = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData; // Catch the data passed from the Questionnaire

    // Keep track of which vendor IDs the user has added to their custom package
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

    const toggleVendor = (id: string) => {
        setSelectedVendors(prev => 
            prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
        );
    };

    // Calculate total price of selected vendors
    const currentTotal = INDIVIDUAL_SERVICES
        .filter(service => selectedVendors.includes(service.id))
        .reduce((sum, service) => sum + service.price, 0);

    const handleCheckout = () => {
        if (selectedVendors.length === 0) return;
        // In a real app, you'd pass the array of selected IDs. For now, we use a generic custom payment route.
        navigate('/payment/custom-package');
    };

    // Group services by type for the UI
    const serviceCategories = ['Venue', 'Decor', 'Catering', 'Photography'];

    return (
        <div className="custom-builder-container">
            <div className="container" style={{ padding: '2rem 1.5rem' }}>
                <header className="builder-header">
                    <h1>Build Your Custom Package</h1>
                    {formData && (
                        <p className="subtitle">
                            <Sparkles size={16} className="text-primary"/> 
                            Tailoring for your <strong>{formData.category}</strong> {formData.location ? `in ${formData.location}` : ''}
                        </p>
                    )}
                </header>

                {serviceCategories.map(category => (
                    <div key={category} className="service-section">
                        <h2 className="section-title">{category} Vendors</h2>
                        <div className="vendor-grid">
                            {INDIVIDUAL_SERVICES.filter(s => s.type === category).map(vendor => {
                                const isSelected = selectedVendors.includes(vendor.id);
                                return (
                                    <div key={vendor.id} className={`vendor-card ${isSelected ? 'selected' : ''}`}>
                                        <div className="vendor-img" style={{ backgroundImage: `url(${vendor.img})` }}></div>
                                        <div className="vendor-info">
                                            <div className="flex justify-between items-start">
                                                <h4>{vendor.name}</h4>
                                                <div className="rating">
                                                    <Star size={12} fill="#FFD700" color="#FFD700" />
                                                    <span>{vendor.rating}</span>
                                                </div>
                                            </div>
                                            <p className="price">₹{vendor.price.toLocaleString('en-IN')}</p>
                                            <button 
                                                className={`btn-toggle ${isSelected ? 'remove' : 'add'}`}
                                                onClick={() => toggleVendor(vendor.id)}
                                            >
                                                {isSelected ? <><Check size={16}/> Added</> : <><Plus size={16}/> Add to Package</>}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky Bottom Bar for Cart/Budget Tracking */}
            <div className="sticky-cart-bar">
                <div className="cart-content">
                    <div className="cart-details">
                        <div className="cart-icon-wrapper">
                            <ShoppingCart size={24} />
                            <span className="cart-badge">{selectedVendors.length}</span>
                        </div>
                        <div className="total-wrapper">
                            <span className="total-label">Estimated Total</span>
                            <span className="total-amount">₹{currentTotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <button 
                        className="btn btn-primary" 
                        disabled={selectedVendors.length === 0}
                        onClick={handleCheckout}
                    >
                        Review & Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HostCustomize;