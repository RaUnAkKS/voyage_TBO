import { MapPin, Search, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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
          {!user ? (
            <><Link to="/login" className="nav-link"><LogIn size={16} />Log In</Link>
            <Link to="/signup" className="nav-link btn-signup">Sign Up</Link></>
          ) : ( 
            <><span className="nav-link">{user.fullName}</span>
            <button onClick={logout} className="nav-link">Logout</button></>
          )}
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
          background: #181818;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0,0,0,0.55);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 72px;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
        }
        .logo {
          font-family: var(--font-family-serif);
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--primary-color);
          letter-spacing: -0.5px;
          text-transform: uppercase;
          text-decoration: none;
        }
        .search-bar {
          background: #1A1A1A;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.55rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 300px;
          transition: all 0.25s;
        }
        .search-bar:focus-within {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(198,167,94,0.12);
        }
        .search-bar input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
          color: #fff;
          font-family: var(--font-family);
        }
        .search-bar input::placeholder { color: #727272; }
        .search-icon { color: #727272; flex-shrink: 0; }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .nav-link {
          font-size: 0.875rem;
          color: #B5B5B5;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: color 0.2s;
          font-family: var(--font-family);
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--primary-color); }

        .btn-signup {
          background: var(--primary-color);
          color: #0A0A0A !important;
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.82rem;
          letter-spacing: 0.5px;
          transition: all 0.22s ease;
          text-decoration: none;
        }
        .btn-signup:hover {
          background: #D4B76A;
          color: #0A0A0A !important;
          box-shadow: 0 4px 16px rgba(198,167,94,0.28);
          transform: translateY(-1px);
        }

        .category-strip {
          border-top: 1px solid rgba(255,255,255,0.05);
          background: #141414;
          padding: 0.85rem 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .category-strip::-webkit-scrollbar { display: none; }
        .category-strip .container {
          display: flex;
          gap: 3rem;
          justify-content: center;
        }
        .category-item {
          font-weight: 600;
          color: #B5B5B5;
          white-space: nowrap;
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 1.2px;
          position: relative;
          padding-bottom: 2px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .category-item:after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: var(--primary-color);
          transition: width 0.28s ease;
          border-radius: 2px;
        }
        .category-item:hover { color: var(--primary-color); }
        .category-item:hover:after { width: 100%; }

        .mobile-only { display: none; }
        .icon-btn { background: none; border: none; padding: 0.5rem; cursor: pointer; }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          .search-bar { display: none; }
          .nav-container { height: 64px; }
          .category-strip .container { justify-content: flex-start; gap: 2rem; padding-left: 1rem; }

          .mobile-menu {
            position: absolute;
            top: 64px;
            left: 0;
            width: 100%;
            background: #181818;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 1.25rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            box-shadow: 0 12px 32px rgba(0,0,0,0.6);
            animation: slideDown 0.25s ease;
          }
          .mobile-link {
            font-size: 0.95rem;
            font-weight: 500;
            color: #B5B5B5;
            text-decoration: none;
            padding-bottom: 0.65rem;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .mobile-link:hover { color: var(--primary-color); }
          .mobile-link:last-child { border-bottom: none; }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
    </nav>
  );
}