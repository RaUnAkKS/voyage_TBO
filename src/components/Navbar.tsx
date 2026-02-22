import { MapPin, Search, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-left">
          <Link to="/" className="logo">
            EventHub
          </Link>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search events" />
          </div>
        </div>

        <div className="nav-right desktop-only">
          <button className="nav-link"><MapPin size={16} /> Location</button>
          <Link to="/find-events" className="nav-link">Find Events</Link>
          <Link to="/create-event" className="nav-link">Create Event</Link>
          <Link to="/tickets" className="nav-link">Find My Tickets</Link>
          <Link to="/login" className="nav-link"><LogIn size={16} /> Log In</Link>
          <Link to="/signup" className="nav-link btn-signup">Sign Up</Link>
        </div>

        <div className="mobile-only">
          <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X color="var(--primary-color)" /> : <Menu color="var(--primary-color)" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/find-events" className="mobile-link">Find Events</Link>
          <Link to="/create-event" className="mobile-link">Create Event</Link>
          <Link to="/tickets" className="mobile-link">Tickets</Link>
          <Link to="/login" className="mobile-link">Log In</Link>
        </div>
      )}

      {/* Category Strip */}
      <div className="category-strip">
        <div className="container">
          <Link to="/category/wedding" className="category-item">Wedding</Link>
          <Link to="/category/events" className="category-item">Events</Link>
          <Link to="/category/conference" className="category-item">Conferences</Link>
          <Link to="/category/meeting" className="category-item">Meetings</Link>
        </div>
      </div>

      <style>{`
        .navbar {
          background: var(--background-white); /* Now pulls #1A1A1D from index.css */
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
        }
        .logo {
          font-family: var(--font-family-serif);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary-color);
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        .search-bar {
          background: var(--background-light); /* Now pulls #121212 */
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 320px;
          transition: all 0.3s;
        }
        .search-bar:focus-within {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(197, 165, 114, 0.1);
        }
        .search-bar input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .search-icon { color: var(--text-secondary); }
        
        .nav-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--primary-color);
        }
        .btn-signup {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .category-strip {
          border-top: 1px solid var(--border-color);
          background: var(--background-white); /* Changed from 'white' to dark variable */
          padding: 1rem 0;
          overflow-x: auto;
        }
        .category-strip .container {
          display: flex;
          gap: 3rem;
          justify-content: center;
        }
        .category-item {
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
          position: relative;
        }
        .category-item:after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: var(--primary-color);
            transition: width 0.3s;
        }
        .category-item:hover {
          color: var(--primary-color);
        }
        .category-item:hover:after {
            width: 100%;
        }

        .mobile-only { display: none; }
        
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          .search-bar { display: none; }
          .category-strip .container { justify-content: flex-start; gap: 2rem; }
          .mobile-menu {
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background: var(--background-white); /* Dark background for mobile */
            border-bottom: 1px solid var(--border-color);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            box-shadow: var(--shadow-lg);
          }
          .mobile-link { color: var(--text-primary); }
          .icon-btn {
              background: none;
              border: none;
              padding: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
}