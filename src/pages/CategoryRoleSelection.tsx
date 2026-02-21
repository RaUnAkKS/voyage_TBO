import { useParams, Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';

const CategoryRoleSelection = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <div className="role-selection-wrapper">
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <span className="role-eyebrow">Onboarding</span>
        <h1 className="role-heading">
          {category} Planning
        </h1>
        <p className="role-subheading">
          Select your journey. How are you attending this event?
        </p>

                <div className="role-cards">
                    {/* UPDATED: This now points to the questionnaire instead of the marketplace */}
                    <Link to={`/host/questionnaire/${category}`} className="role-card">
                        <div className="icon-wrapper host-icon">
                            <Calendar size={48} />
                        </div>
                        <h2>I am a Host</h2>
                        <p>I want to plan and book vendors for my {category}.</p>
                    </Link>

          <Link to="/guest" className="role-card">
            <div className="role-icon-outer">
              <div className="role-icon-inner">
                <User size={32} strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="role-card-title">I am a Guest</h2>
            <p className="role-card-desc">I have an access code and need to view event details and schedule.</p>
            <div className="role-card-cta">View Event →</div>
          </Link>
        </div>
      </div>
      <style>{`
        .role-selection-wrapper {
          background-color: #121212;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .role-eyebrow {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C6A75E;
          margin-bottom: 1rem;
        }
        .role-heading {
          font-family: var(--font-family-serif);
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: 0.75rem;
          text-transform: capitalize;
          color: #F5F5F5;
        }
        .role-subheading {
          font-size: 1.1rem;
          color: #B5B5B5;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .role-cards {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .role-card {
          background: #1E1E1E;
          border: 1px solid rgba(198, 167, 94, 0.15);
          border-radius: 20px;
          padding: 3.5rem 2.5rem;
          width: 320px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          position: relative;
          overflow: hidden;
        }
        .role-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(198, 167, 94, 0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .role-card:hover {
          transform: translateY(-10px);
          background: #252525;
          border-color: rgba(198, 167, 94, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(198, 167, 94, 0.1);
        }
        .role-card:hover::before {
          opacity: 1;
        }
        .role-icon-outer {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(198, 167, 94, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(198, 167, 94, 0.1);
        }
        .role-card:hover .role-icon-outer {
          background: rgba(198, 167, 94, 0.1);
          transform: scale(1.05);
          border-color: rgba(198, 167, 94, 0.3);
        }
        .role-icon-inner {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #C6A75E;
          color: #0A0A0A;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(198, 167, 94, 0.3);
        }
        .role-card-title {
          font-family: var(--font-family-serif);
          font-size: 1.75rem;
          margin-bottom: 1rem;
          color: #F5F5F5;
          letter-spacing: -0.5px;
        }
        .role-card-desc {
          color: #B5B5B5;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .role-card-cta {
          font-size: 0.85rem;
          font-weight: 700;
          color: #C6A75E;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s ease;
        }
        .role-card:hover .role-card-cta {
          letter-spacing: 2px;
          color: #D4B76A;
        }
        @media (max-width: 640px) {
          .role-cards {
            gap: 1.5rem;
          }
          .role-card {
            width: 100%;
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryRoleSelection;