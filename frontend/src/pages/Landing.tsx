import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import '../styles/Landing.css';

const Landing = () => {
    // Mock data for display
    const trendingEvents = [1, 2, 3, 4];
    const weddingPackages = [1, 2, 3, 4];

    return (
        <div className="landing-page">
            {/* Main Hero Component */}
            <HeroCarousel />

            <div className="container">
                {/* 4 Category Blocks - Now using dark backgrounds and visible text */}
                <div className="category-row">
                    <Link to="/category/wedding" className="category-chip">Weddings</Link>
                    <Link to="/category/event" className="category-chip">Events</Link>
                    <Link to="/category/conference" className="category-chip">Conferences</Link>
                    <Link to="/category/meeting" className="category-chip">Meetings</Link>
                </div>

                {/* Trending Events Section */}
                <h2 className="section-title">Trending Events</h2>
                <div className="events-grid">
                    {trendingEvents.map((item) => (
                        <div key={`trend-${item}`} className="event-card">
                            <div 
                                className="event-image" 
                                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400)` }}
                            />
                            <div className="event-details">
                                <div className="event-date">SAT, SEP 20 • 7:00 PM</div>
                                <h3 className="event-title">Annual Tech Innovators Summit</h3>
                                <div className="event-location">Grand Convention Center</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Popular Wedding Packages Section */}
                <h2 className="section-title">Popular Wedding Packages</h2>
                <div className="events-grid">
                    {weddingPackages.map((item) => (
                        <div key={`wedding-${item}`} className="event-card">
                            <div 
                                className="event-image" 
                                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400)` }}
                            />
                            <div className="event-details">
                                <div className="event-date">Starting from ₹1,50,000</div>
                                <h3 className="event-title">Royal Garden Wedding</h3>
                                <div className="event-location">Includes Venue & Decor</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Landing;