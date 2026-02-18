
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';

const CategoryRoleSelection = () => {
    const { category } = useParams<{ category: string }>();

    return (
        <div className="role-selection-container">
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'capitalize' }}>
                    {category} Planning
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    How are you attending this event?
                </p>

                <div className="role-cards">
                    <Link to={`/host/marketplace/${category}`} className="role-card">
                        <div className="icon-wrapper host-icon">
                            <Calendar size={48} />
                        </div>
                        <h2>I am a Host</h2>
                        <p>I want to plan and book vendors for my {category}.</p>
                    </Link>

                    <Link to="/guest" className="role-card">
                        <div className="icon-wrapper guest-icon">
                            <User size={48} />
                        </div>
                        <h2>I am a Guest</h2>
                        <p>I have an access code and need to view event details.</p>
                    </Link>
                </div>
            </div>
            <style>{`
        .role-cards {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .role-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 3rem 2rem;
          width: 300px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .role-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }
        .icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .host-icon {
          background-color: rgba(240, 85, 55, 0.1);
          color: var(--primary-color);
        }
        .guest-icon {
          background-color: rgba(61, 2, 64, 0.1);
          color: var(--secondary-color);
        }
        .role-card h2 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .role-card p {
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default CategoryRoleSelection;
