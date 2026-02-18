
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Clock, CheckSquare, Settings, LogOut, LayoutDashboard, Share2, Plus, Calendar } from 'lucide-react';

const HostDashboard = () => {
    const [searchParams] = useSearchParams();
    const eventCode = searchParams.get('code') || 'WED-48291-XZ';

    const [activeTab, setActiveTab] = useState('overview');

    const checklistItems = [
        { id: 1, text: 'Confirm guest list', completed: true },
        { id: 2, text: 'Finalize menu with caterer', completed: false },
        { id: 3, text: 'Send invitations', completed: false },
        { id: 4, text: 'Pay remaining balance', completed: false },
    ];

    const guests = [
        { id: 1, name: 'Alice Smith', status: 'Confirmed', email: 'alice@example.com' },
        { id: 2, name: 'Bob Johnson', status: 'Pending', email: 'bob@example.com' },
        { id: 3, name: 'Charlie Brown', status: 'Declined', email: 'charlie@example.com' },
        { id: 4, name: 'Diana Prince', status: 'Confirmed', email: 'diana@example.com' },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Host Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <LayoutDashboard size={20} /> Overview
                    </button>
                    <button className={`nav-item ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => setActiveTab('guests')}>
                        <Users size={20} /> Guests
                    </button>
                    <button className={`nav-item ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
                        <Clock size={20} /> Timeline
                    </button>
                    <button className={`nav-item ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>
                        <CheckSquare size={20} /> Checklist
                    </button>
                    <div className="divider"></div>
                    <button className="nav-item">
                        <Settings size={20} /> Settings
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="nav-item logout">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <h1>Wedding Dashboard</h1>
                        <p className="text-secondary">Manage your event details and guests.</p>
                    </div>
                    <div className="header-actions">
                        <div className="event-code-badge">
                            Event Code: <strong>{eventCode}</strong>
                            <button className="icon-btn-sm"><Share2 size={14} /></button>
                        </div>
                        <div className="user-profile">
                            <div className="avatar">JD</div>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon bg-blue"><Users size={24} color="#007bff" /></div>
                            <div>
                                <div className="stat-value">124</div>
                                <div className="stat-label">Total Guests</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon bg-green"><CheckSquare size={24} color="#28a745" /></div>
                            <div>
                                <div className="stat-value">85%</div>
                                <div className="stat-label">Checklist Done</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon bg-purple"><Calendar size={24} color="#6f42c1" /></div>
                            <div>
                                <div className="stat-value">14 Days</div>
                                <div className="stat-label">Until Event</div>
                            </div>
                        </div>
                    </div>

                    <div className="content-row">
                        <div className="card flex-2">
                            <div className="card-header">
                                <h3>Guest List</h3>
                                <button className="btn btn-sm btn-ghost">View All</button>
                            </div>
                            <table className="guest-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guests.map(guest => (
                                        <tr key={guest.id}>
                                            <td>{guest.name}</td>
                                            <td>{guest.email}</td>
                                            <td>
                                                <span className={`status-badge ${guest.status.toLowerCase()}`}>
                                                    {guest.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="card flex-1">
                            <div className="card-header">
                                <h3>Checklist</h3>
                                <button className="btn btn-sm btn-ghost"><Plus size={16} /></button>
                            </div>
                            <ul className="checklist">
                                {checklistItems.map(item => (
                                    <li key={item.id} className="checklist-item">
                                        <input type="checkbox" checked={item.completed} readOnly />
                                        <span className={item.completed ? 'completed' : ''}>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .dashboard-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: var(--background-light);
                }
                .sidebar {
                    width: 250px;
                    background: white;
                    border-right: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                }
                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .sidebar-nav {
                    padding: 1rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 6px;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    color: var(--text-secondary);
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .nav-item:hover, .nav-item.active {
                    background-color: rgba(240, 85, 55, 0.1);
                    color: var(--primary-color);
                }
                .dashboard-main {
                    margin-left: 250px;
                    flex: 1;
                    padding: 2rem;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: var(--shadow-sm);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bg-blue { background-color: rgba(0, 123, 255, 0.1); }
                .bg-green { background-color: rgba(40, 167, 69, 0.1); }
                .bg-purple { background-color: rgba(111, 66, 193, 0.1); }
                .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
                .stat-label { color: var(--text-secondary); font-size: 0.9rem; }
                
                .content-row { display: flex; gap: 1.5rem; }
                .flex-2 { flex: 2; }
                .flex-1 { flex: 1; }
                
                .card-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .guest-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .guest-table th, .guest-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                }
                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .confirmed { background-color: rgba(40, 167, 69, 0.1); color: #28a745; }
                .pending { background-color: rgba(255, 193, 7, 0.1); color: #ffc107; }
                .declined { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; }
                
                .checklist { list-style: none; padding: 0; }
                .checklist-item {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .checklist-item .completed { text-decoration: line-through; color: var(--text-secondary); }
                
                .event-code-badge {
                    background: white;
                    border: 1px solid var(--border-color);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    margin-right: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .header-actions { display: flex; align-items: center; }
                .avatar {
                    width: 40px; 
                    height: 40px; 
                    background: var(--primary-color);
                    color: white; 
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }

                @media (max-width: 1024px) {
                    .dashboard-main { margin-left: 0; }
                    .sidebar { display: none; }
                    .content-row { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

export default HostDashboard;
