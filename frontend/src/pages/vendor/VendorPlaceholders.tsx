import '../../styles/VendorLayout.css';

const placeholder = (title: string, icon: string, desc: string) => () => (
    <div>
        <div className="vl-topbar">
            <div className="vl-topbar-title">
                <h1>{title}</h1>
                <p>{desc}</p>
            </div>
        </div>
        <div className="vl-content">
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '40vh', color: 'var(--vl-hint)', gap: '1rem',
                border: '1px dashed var(--vl-border)', borderRadius: '12px', padding: '3rem',
            }}>
                <span style={{ fontSize: '3rem' }}>{icon}</span>
                <h3 style={{ margin: 0, color: 'var(--vl-muted)', fontWeight: 500 }}>{title} — Coming Soon</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center' }}>
                    This section is under construction and will be available soon.
                </p>
            </div>
        </div>
    </div>
);

export const VendorCalendarPage = placeholder('Calendar', '📅', 'View and manage all your event dates and scheduling.');
export const VendorAnalyticsPage = placeholder('Analytics', '📊', 'Deep-dive into revenue, utilization, and performance metrics.');
export const VendorTeamPage = placeholder('Team', '👥', 'Manage your team members, roles, and permissions.');
