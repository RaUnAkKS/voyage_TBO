
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GuestCodeEntry = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock validation: Code must be at least 5 chars
        if (code.length > 5) {
            navigate('/guest/dashboard?code=' + code);
        } else {
            setError('Invalid event code. Please try again.');
        }
    };

    return (
        <div className="guest-entry-container">
            <div className="entry-card card">
                <h1>Welcome Guest</h1>
                <p>Please enter the event access code provided by your host.</p>

                <form onSubmit={handleSubmit} className="entry-form">
                    <input
                        type="text"
                        placeholder="Enter Event Code (e.g. WED-1234)"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="code-input"
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn btn-primary w-full">Access Event</button>
                </form>
            </div>

            <style>{`
                .guest-entry-container {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--background-light);
                }
                .entry-card {
                    padding: 3rem;
                    text-align: center;
                    width: 100%;
                    max-width: 450px;
                }
                .entry-card h1 { margin-bottom: 1rem; }
                .entry-card p {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }
                .code-input {
                    font-size: 1.25rem;
                    padding: 1rem;
                    text-align: center;
                    letter-spacing: 2px;
                    width: 100%;
                    margin-bottom: 1rem;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    text-transform: uppercase;
                }
                .error-message {
                    color: var(--error-color);
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
};

export default GuestCodeEntry;
