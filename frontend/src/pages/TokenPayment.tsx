import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VENDOR_PACKAGES } from '../mockData/vendors';
import { CheckCircle, Copy, ShieldCheck } from 'lucide-react';

const TokenPayment = () => {
    const { packageId } = useParams<{ packageId: string }>();
    const navigate = useNavigate();
    
    // Find the package, OR create a dummy one if they came from the "Custom Package" builder
    let pkg = VENDOR_PACKAGES.find(p => p.id === packageId);
    
    if (packageId === 'custom-package') {
        pkg = {
            id: 'custom-package',
            category: 'event', // Fixed TypeScript error here
            name: 'Bespoke Event Package',
            description: 'Your beautifully tailored selection of premium vendors and services.',
            price: 450000, // Mock total for the custom package
            rating: 5.0,
            services: ['Venue', 'Catering', 'Decor', 'Photography'],
            image: 'https://images.unsplash.com/photo-1519225421980-6f03b7a1cd1d?auto=format&fit=crop&q=80&w=800'
        };
    }

    const [isPaid, setIsPaid] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Mock payment processing
        setTimeout(() => {
            const code = `WED-${Math.floor(10000 + Math.random() * 90000)}-XZ`;
            setGeneratedCode(code);
            setIsPaid(true);
            setIsProcessing(false);
        }, 2000);
    };

    if (!pkg) return (
        <div className="payment-container flex items-center justify-center">
            <h2 style={{ color: 'var(--ef-text)' }}>Package not found</h2>
        </div>
    );

    return (
        <div className="payment-container">
            <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
                {!isPaid ? (
                    <div className="payment-layout">
                        {/* Left Side: Summary */}
                        <div className="payment-summary ef-card">
                            <div className="pkg-image" style={{ backgroundImage: `url(${pkg.image})` }}></div>
                            <div className="p-6">
                                <span className="ef-cat">{pkg.category} Package</span>
                                <h2>{pkg.name}</h2>
                                <p className="text-secondary mb-4">{pkg.description}</p>
                                
                                <div className="price-row mt-4">
                                    <span>Total Price</span>
                                    <span className="text-xl font-bold">₹{pkg.price.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="ef-divider-line"></div>
                                <div className="price-row token-row">
                                    <span>Token Amount (10%)</span>
                                    <span className="text-xl font-bold text-gold">₹{(pkg.price * 0.1).toLocaleString('en-IN')}</span>
                                </div>
                                <p className="ef-hint mt-4 text-center">
                                    <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/>
                                    Secure Escrow Payment
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="payment-form ef-card">
                            <div className="p-6">
                                <h2 className="mb-4" style={{ fontFamily: 'var(--ef-serif)', fontSize: '1.8rem' }}>Complete Booking</h2>
                                <p className="text-secondary mb-6">Enter your details to secure your dates and generate your event code.</p>
                                
                                <form onSubmit={handlePayment}>
                                    <div className="ef-field mb-4">
                                        <label className="ef-label">Cardholder Name</label>
                                        <input type="text" placeholder="John Doe" className="ef-input" required />
                                    </div>
                                    <div className="ef-field mb-4">
                                        <label className="ef-label">Card Number</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" className="ef-input" required maxLength={16} />
                                    </div>
                                    <div className="form-row mb-6">
                                        <div className="ef-field">
                                            <label className="ef-label">Expiry (MM/YY)</label>
                                            <input type="text" placeholder="12/25" className="ef-input" required maxLength={5} />
                                        </div>
                                        <div className="ef-field">
                                            <label className="ef-label">CVC</label>
                                            <input type="password" placeholder="***" className="ef-input" required maxLength={3} />
                                        </div>
                                    </div>
                                    
                                    <button type="submit" className={`ef-submit ef-submit--on w-full`} disabled={isProcessing}>
                                        {isProcessing ? 'Processing...' : `Pay ₹${(pkg.price * 0.1).toLocaleString('en-IN')} Token`}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Success Screen */
                    <div className="success-screen ef-card p-8 text-center">
                        <div className="success-icon mb-4">
                            <CheckCircle size={72} color="var(--ef-gold)" />
                        </div>
                        <h1 className="mb-2" style={{ fontFamily: 'var(--ef-serif)', color: 'var(--ef-gold)' }}>Payment Successful!</h1>
                        <p className="text-secondary mb-6" style={{ fontSize: '1.1rem' }}>
                            Your event has been successfully created and your vendors are secured. 
                            Share this code with your guests to let them RSVP and view details.
                        </p>

                        <div className="code-display mb-8">
                            <span className="code-text">{generatedCode}</span>
                            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(generatedCode)}>
                                <Copy size={20} />
                            </button>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-secondary" onClick={() => navigate('/')}>Back Home</button>
                            <button className="ef-submit ef-submit--on" onClick={() => navigate(`/host/dashboard?code=${generatedCode}`)}>
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                /* Tokens to match the luxury dark theme */
                :root {
                    --ef-bg: #121212;
                    --ef-card: #1A1A1D;
                    --ef-text: #F5F5F5;
                    --ef-muted: #B5B5B5;
                    --ef-hint: #727272;
                    --ef-gold: #C6A75E;
                    --ef-gold-hover: #D4B76A;
                    --ef-font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    --ef-serif: 'Playfair Display', Georgia, serif;
                }

                .payment-container {
                    background-color: var(--ef-bg);
                    min-height: calc(100vh - 80px); /* Adjust based on navbar */
                    color: var(--ef-text);
                    font-family: var(--ef-font);
                }

                .payment-layout {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 2.5rem;
                    align-items: flex-start;
                }

                .ef-card {
                    background: var(--ef-card);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.6);
                }

                .pkg-image {
                    height: 220px;
                    background-size: cover;
                    background-position: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                }

                .p-6 { padding: 2rem; }
                .p-8 { padding: 3.5rem 2rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2.5rem; }
                .mt-4 { margin-top: 1rem; }
                
                .ef-cat {
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: var(--ef-gold);
                    margin-bottom: 0.5rem;
                    display: block;
                }

                .payment-summary h2 {
                    font-family: var(--ef-serif);
                    font-size: 2rem;
                    font-weight: 400;
                    margin-bottom: 0.5rem;
                    color: var(--ef-text);
                }

                .text-secondary { color: var(--ef-muted); line-height: 1.6; }
                .text-xl { font-size: 1.25rem; }
                .font-bold { font-weight: 700; }
                .text-gold { color: var(--ef-gold); }
                .text-center { text-align: center; }

                .price-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .token-row {
                    padding: 1rem;
                    background: rgba(198, 167, 94, 0.08);
                    border: 1px solid rgba(198, 167, 94, 0.2);
                    border-radius: 8px;
                    margin-top: 1rem;
                }

                .ef-divider-line {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.06);
                    margin: 1.5rem 0;
                }

                /* Form Styles */
                .ef-field { display: flex; flex-direction: column; gap: 0.5rem; }
                .ef-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: var(--ef-muted);
                }
                .ef-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 6px;
                    font-size: 0.95rem;
                    color: var(--ef-text);
                    background: #121212;
                    outline: none;
                    transition: all 0.2s;
                }
                .ef-input:focus {
                    border-color: var(--ef-gold);
                    box-shadow: 0 0 0 2px rgba(198, 167, 94, 0.15);
                }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                
                .ef-submit {
                    padding: 1.1rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .ef-submit--on {
                    background: var(--ef-gold);
                    color: #0A0A0A;
                    box-shadow: 0 4px 20px rgba(198, 167, 94, 0.25);
                }
                .ef-submit--on:hover:not(:disabled) {
                    background: var(--ef-gold-hover);
                    transform: translateY(-2px);
                }
                .ef-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .w-full { width: 100%; }

                /* Success Screen */
                .success-screen {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .success-icon { display: flex; justify-content: center; }
                
                .code-display {
                    background: #121212;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid rgba(198, 167, 94, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                }
                .code-text {
                    font-family: monospace;
                    font-size: 2rem;
                    font-weight: 700;
                    letter-spacing: 4px;
                    color: var(--ef-text);
                }
                .copy-btn {
                    background: rgba(198, 167, 94, 0.1);
                    border: 1px solid rgba(198, 167, 94, 0.3);
                    color: var(--ef-gold);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .copy-btn:hover { 
                    background: rgba(198, 167, 94, 0.2);
                    transform: scale(1.05);
                }

                .action-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                }
                .btn-secondary {
                    padding: 1.1rem 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 8px;
                    background: transparent;
                    color: var(--ef-text);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover {
                    border-color: var(--ef-text);
                    background: rgba(255, 255, 255, 0.05);
                }

                @media (max-width: 800px) {
                    .payment-layout { grid-template-columns: 1fr; }
                    .action-buttons { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

export default TokenPayment;