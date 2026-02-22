
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">
                    <p>© 2024 EventHub. All rights reserved.</p>
                </div>
            </footer>
            <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .main-content {
          flex: 1;
        }
        .footer {
          background: var(--text-primary);
          color: white;
          padding: 2rem 0;
          margin-top: auto;
          text-align: center;
        }
      `}</style>
        </div>
    );
};

export default MainLayout;
