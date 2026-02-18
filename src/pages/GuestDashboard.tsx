
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';

const GuestDashboard = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    return (
        <div className="container" style={{ padding: '2rem' }}>
            {/* Header Banner */}
            <div className="event-banner mb-4">
                <div className="banner-content">
                    <span className="event-tag">Wedding</span>
                    <h1>Sarah & John's Wedding</h1>
                    <div className="event-meta">
                        <span><Calendar size={16} /> September 20, 2024</span>
                        <span><Clock size={16} /> 4:00 PM - 11:00 PM</span>
                        <span><MapPin size={16} /> The Grand Palace, New York</span>
                    </div>
                </div>
            </div>

            <div className="guest-grid">
                <div className="main-info">
                    <div className="card p-6 mb-4">
                        <h2>Event Schedule</h2>
                        <ul className="timeline">
                            <li className="timeline-item">
                                <span className="time">4:00 PM</span>
                                <div className="details">
                                    <h4>Ceremony</h4>
                                    <p>Main Garden Area</p>
                                </div>
                            </li>
                            <li className="timeline-item">
                                <span className="time">5:30 PM</span>
                                <div className="details">
                                    <h4>Cocktail Hour</h4>
                                    <p>Terrace Lounge</p>
                                </div>
                            </li>
                            <li className="timeline-item">
                                <span className="time">7:00 PM</span>
                                <div className="details">
                                    <h4>Reception Dinner</h4>
                                    <p>Grand Ballroom</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="card p-6">
                        <h2>Message to Host</h2>
                        <textarea className="msg-input" placeholder="Send a message or wish to the couple..."></textarea>
                        <button className="btn btn-primary mt-2">Send Message</button>
                    </div>
                </div>

                <div className="sidebar-info">
                    <div className="card p-6 mb-4">
                        <h3>Your RSVP Status</h3>
                        <div className="status-box confirmed">
                            Confirmed
                        </div>
                        <button className="btn btn-secondary w-full mt-2">Update RSVP</button>
                    </div>

                    <div className="card p-6">
                        <h3>Venue Details</h3>
                        <div className="map-placeholder">
                            Map View
                        </div>
                        <p className="mt-2 text-sm text-secondary">
                            123 Wedding Lane, New York, NY 10001
                        </p>
                        <button className="btn text-primary mt-2">Get Directions</button>
                    </div>
                </div>
            </div>

            <style>{`
                .event-banner {
                    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1519225421980-6f03b7a1cd1d?auto=format&fit=crop&q=80&w=1600');
                    background-size: cover;
                    background-position: center;
                    color: white;
                    padding: 4rem 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }
                .banner-content h1 { font-size: 3rem; margin-bottom: 1rem; }
                .event-tag {
                    background: var(--primary-color);
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    display: inline-block;
                }
                .event-meta {
                    display: flex;
                    gap: 1.5rem;
                    font-size: 1.1rem;
                }
                .event-meta span { display: flex; align-items: center; gap: 0.5rem; }
                
                .guest-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }
                .p-6 { padding: 1.5rem; }
                .mb-4 { margin-bottom: 1.5rem; }
                .timeline {
                    list-style: none;
                    margin-top: 1rem;
                }
                .timeline-item {
                    display: flex;
                    gap: 2rem;
                    padding-bottom: 1.5rem;
                    border-left: 2px solid var(--border-color);
                    padding-left: 1.5rem;
                    position: relative;
                }
                .timeline-item::before {
                    content: '';
                    position: absolute;
                    left: -6px;
                    top: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: var(--primary-color);
                }
                .time { font-weight: 700; color: var(--primary-color); width: 80px; }
                .details h4 { margin-bottom: 0.25rem; }
                .details p { color: var(--text-secondary); margin: 0; }
                
                .msg-input {
                    width: 100%;
                    height: 100px;
                    padding: 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    margin-top: 1rem;
                    resize: none;
                }
                .status-box {
                    padding: 1rem;
                    text-align: center;
                    background: #e6fffa;
                    color: #00bfa5;
                    font-weight: 700;
                    border-radius: 4px;
                    margin: 1rem 0;
                }
                .map-placeholder {
                    background: #eee;
                    height: 150px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                }
                .text-sm { font-size: 0.85rem; }
                
                @media (max-width: 768px) {
                    .guest-grid { grid-template-columns: 1fr; }
                    .event-banner { padding: 2rem 1rem; }
                    .banner-content h1 { font-size: 2rem; }
                    .event-meta { flex-direction: column; gap: 0.5rem; }
                }
            `}</style>
        </div>
    );
};

export default GuestDashboard;
