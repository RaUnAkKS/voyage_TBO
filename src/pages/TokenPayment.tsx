
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VENDOR_PACKAGES } from '../mockData/vendors';
import { CheckCircle, Copy } from 'lucide-react';

const TokenPayment = () => {
    const { packageId } = useParams<{ packageId: string }>();
    const navigate = useNavigate();
    const pkg = VENDOR_PACKAGES.find(p => p.id === packageId);

    const [isPaid, setIsPaid] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock payment processing
        setTimeout(() => {
            const code = `WED-${Math.floor(10000 + Math.random() * 90000)}-XZ`;
            setGeneratedCode(code);
            setIsPaid(true);
        }, 1500);
    };

    if (!pkg) return <div>Package not found</div>;

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            {!isPaid ? (
                <div className="payment-layout">
                    <div className="payment-summary card">
                        <div className="pkg-image" style={{ backgroundImage: `url(${pkg.image})` }}></div>
                        <div className="p-4">
                            <h2>{pkg.name}</h2>
                            <p className="text-secondary mb-4">{pkg.description}</p>
                            <div className="price-row">
                                <span>Total Price</span>
                                <span className="text-xl font-bold">${pkg.price.toLocaleString()}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="price-row">
                                <span>Token Amount (10%)</span>
                                <span className="text-xl font-bold text-primary">${(pkg.price * 0.1).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="payment-form card">
                        <div className="p-6">
                            <h2 className="mb-4">Secure Payment</h2>
                            <form onSubmit={handlePayment}>
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="input-field" required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry</label>
                                        <input type="text" placeholder="MM/YY" className="input-field" required />
                                    </div>
                                    <div className="form-group">
                                        <label>CVC</label>
                                        <input type="text" placeholder="123" className="input-field" required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full mt-4">Pay Token Amount</button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="success-screen card p-8 text-center">
                    <div className="success-icon mb-4">
                        <CheckCircle size={64} color="var(--success-color)" />
                    </div>
                    <h1 className="mb-2">Payment Successful!</h1>
                    <p className="text-secondary mb-6">Your event has been created. Share this code with your guests.</p>

                    <div className="code-display mb-6">
                        <span className="code-text">{generatedCode}</span>
                        <button className="copy-btn"><Copy size={18} /></button>
                    </div>

                    <div className="action-buttons flex justify-center gap-4">
                        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back Home</button>
                        <button className="btn btn-primary" onClick={() => navigate(`/host/dashboard?code=${generatedCode}`)}>Go to Dashboard</button>
                    </div>
                </div>
            )}

            <style>{`
                .payment-layout {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 2rem;
                }
                .pkg-image {
                    height: 150px;
                    background-size: cover;
                    background-position: center;
                }
                .p-4 { padding: 1rem; }
                .p-6 { padding: 1.5rem; }
                .p-8 { padding: 2rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .text-xl { font-size: 1.25rem; }
                .font-bold { font-weight: 700; }
                .price-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                .divider {
                    height: 1px;
                    background: var(--border-color);
                    margin: 1rem 0;
                }
                .input-field {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    margin-top: 0.25rem;
                }
                .form-group { margin-bottom: 1rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .mt-4 { margin-top: 1rem; }
                
                .success-screen {
                    max-width: 500px;
                    margin: 0 auto;
                }
                .success-icon { display: flex; justify-content: center; }
                .code-display {
                    background: var(--background-light);
                    padding: 1rem;
                    border-radius: 8px;
                    border: 2px dashed var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    font-family: monospace;
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                }
                .copy-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                }
                .copy-btn:hover { color: var(--primary-color); }

                 @media (max-width: 768px) {
                    .payment-layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default TokenPayment;
