
import React from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import '../styles/Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Replaced static hero with Carousel */}
            <HeroCarousel />

            <div className="container">
                <div className="category-row">
                    <Link to="/category/wedding" className="category-chip">Weddings</Link>
                    <Link to="/category/event" className="category-chip">Events</Link>
                    <Link to="/category/conference" className="category-chip">Conferences</Link>
                    <Link to="/category/meeting" className="category-chip">Meetings</Link>
                </div>

                <h2 className="section-title">Trending Events</h2>
                <div className="events-grid">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="event-card">
                            <div className="event-image" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400)` }}></div>
                            <div className="event-details">
                                <div className="event-date">SAT, SEP 20 • 7:00 PM</div>
                                <h3 className="event-title">Annual Tech Innovators Summit</h3>
                                <div className="event-location">Grand Convention Center</div>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="section-title">Popular Wedding Packages</h2>
                <div className="events-grid">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="event-card">
                            <div className="event-image" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400)` }}></div>
                            <div className="event-details">
                                <div className="event-date">Starting from $2,000</div>
                                <h3 className="event-title">Royal Garden Wedding</h3>
                                <div className="event-location">Includes Venue & Decor</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                /* Additional landing adjustments if specific to this page but not in main CSS */
                .category-chip {
                    border: 1px solid var(--border-color);
                    background: white; 
                    box-shadow: var(--shadow-sm);
                }
                .category-chip:hover {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                    box-shadow: var(--shadow-md);
                }
            `}</style>
        </div>
    );
};

export default Landing;
