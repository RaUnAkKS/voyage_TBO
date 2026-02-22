import { CheckCircle, Circle } from 'lucide-react';
import { EventPerf } from './analyticsData';

interface Props { data: EventPerf[]; }

const utilColor = (pct: number) => {
    if (pct >= 85) return 'linear-gradient(90deg, #E05C5C, #FF8080)';
    if (pct >= 55) return 'linear-gradient(90deg, #C6A75E, #E8C97A)';
    return 'linear-gradient(90deg, #4CAF82, #70D6A3)';
};

const EventPerformanceTable = ({ data }: Props) => {
    if (data.length === 0) {
        return (
            <div className="va-empty">
                <Circle size={40} />
                <p>No event allocations match the current filter.</p>
            </div>
        );
    }

    return (
        <div className="va-table-card" style={{ overflowX: 'auto' }}>
            <table className="va-table">
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Type</th>
                        <th>Allocated Units</th>
                        <th>Utilization</th>
                        <th>Revenue</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(evt => (
                        <tr key={evt.id}>
                            <td><strong>{evt.name}</strong></td>
                            <td><span className="va-type-badge">{evt.type}</span></td>
                            <td style={{ color: 'var(--va-text)' }}>{evt.totalAllocated.toLocaleString()}</td>
                            <td>
                                <div className="va-util-wrap">
                                    <div className="va-util-track">
                                        <div
                                            className="va-util-fill"
                                            style={{
                                                width: `${Math.min(evt.utilPct, 100)}%`,
                                                background: utilColor(evt.utilPct),
                                            }}
                                        />
                                    </div>
                                    <span className="va-util-val">{evt.utilPct}%</span>
                                </div>
                            </td>
                            <td style={{ color: 'var(--va-gold)', fontWeight: 600 }}>₹{evt.revenueLakh}L</td>
                            <td>
                                <span className={`va-status ${evt.isActive ? 'active' : 'completed'}`}>
                                    {evt.isActive
                                        ? <><CheckCircle size={11} /> Active</>
                                        : <><Circle size={11} /> Completed</>}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventPerformanceTable;
