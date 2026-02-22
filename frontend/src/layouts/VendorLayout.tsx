import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, Package, BarChart2,
    Settings, LogOut, Menu, X, Archive, Activity, Wallet,
} from 'lucide-react';
import '../styles/VendorLayout.css';

const NAV_ITEMS = [
    { to: '/vendor/overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
    { to: '/vendor/inventory', icon: <Package size={16} />, label: 'Inventory' },
    { to: '/vendor/active-events', icon: <Activity size={16} />, label: 'Active Events' },
    { to: '/vendor/analytics', icon: <BarChart2 size={16} />, label: 'Analytics' },
    { to: '/vendor/payments', icon: <Wallet size={16} />, label: 'Payments & Cashflow' },
    { to: '/vendor/archive', icon: <Archive size={16} />, label: 'Event Archive' },
];

const VendorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="vl-shell">
            {/* ── Sidebar ── */}
            <aside className={`vl-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <NavLink to="/vendor/overview" className="vl-logo" onClick={closeSidebar}>
                    <div className="vl-logo-icon">V</div>
                    <span className="vl-logo-name">VendorPortal</span>
                </NavLink>

                <span className="vl-nav-label">Navigation</span>
                <nav className="vl-nav">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `vl-navlink${isActive ? ' active' : ''}`}
                            onClick={closeSidebar}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <span className="vl-nav-label">Account</span>
                <div className="vl-sidebar-bottom">
                    <NavLink
                        to="/vendor/settings"
                        className={({ isActive }) => `vl-navlink${isActive ? ' active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <Settings size={16} /> Settings
                    </NavLink>
                    <button className="vl-navlink" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className="vl-main">
                {/* Mobile top strip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--vl-border)', background: 'var(--vl-sidebar)' }} className="vl-mobile-strip">
                    <button className="vl-mob-toggle" onClick={() => setSidebarOpen(s => !s)}>
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--vl-text)' }}>VendorPortal</span>
                    <div style={{ width: 36 }} /> {/* spacer */}
                </div>

                {/* Route outlet with page transition */}
                <div className="vl-outlet">
                    <Outlet />
                </div>
            </main>

            {/* Backdrop on mobile when sidebar is open */}
            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        zIndex: 99, backdropFilter: 'blur(3px)',
                    }}
                />
            )}
        </div>
    );
};

export default VendorLayout;
