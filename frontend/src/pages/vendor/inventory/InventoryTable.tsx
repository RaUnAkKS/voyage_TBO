import { Package, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useInventoryCtx, CatBadge, getUtilPct, getAllocated, getAvailable, progressColor } from './InventoryLayout';

const InventoryTable = () => {
    const { items, onRowClick, onEdit, onAllocate } = useInventoryCtx();

    return (
        <div className="vi-table-card">
            <div className="vi-table-header">
                <h3>Inventory Items ({items.length})</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="vi-btn-ghost"><TrendingUp size={14} /> Export</button>
                </div>
            </div>
            {items.length === 0 ? (
                <div className="vi-empty">
                    <Package size={48} />
                    <p>No inventory items found.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="vi-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Total Qty</th>
                                <th>Allocated</th>
                                <th>Available</th>
                                <th>Utilization</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => {
                                const allocated = getAllocated(item);
                                const available = getAvailable(item);
                                const util = getUtilPct(item);
                                const isLow = available < Math.ceil(item.totalQuantity * 0.1);

                                return (
                                    <tr key={item.id} onClick={() => onRowClick(item)}>
                                        <td><strong>{item.name}</strong></td>
                                        <td><CatBadge cat={item.category} /></td>
                                        <td className="td-muted">{item.totalQuantity}</td>
                                        <td>{allocated}</td>
                                        <td style={{ color: isLow ? '#E05C5C' : 'var(--vi-green)' }}>
                                            {available}
                                        </td>
                                        <td>
                                            <div className="vi-progress-wrap">
                                                <div className="vi-progress-track">
                                                    <div className="vi-progress-fill" style={{
                                                        width: `${util}%`,
                                                        background: progressColor(util),
                                                    }} />
                                                </div>
                                                <div className="vi-progress-label">{util}% used</div>
                                            </div>
                                        </td>
                                        <td>
                                            {isLow ? (
                                                <span className="vi-badge-low"><AlertCircle size={10} /> Low Stock</span>
                                            ) : (
                                                <span style={{ fontSize: '0.78rem', color: 'var(--vi-green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <CheckCircle size={12} /> OK
                                                </span>
                                            )}
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <div className="vi-row-actions">
                                                <button className="vi-action-btn" onClick={() => onRowClick(item)}>View</button>
                                                <button
                                                    className="vi-action-btn vi-action-btn-primary"
                                                    onClick={() => onAllocate(item)}
                                                    disabled={available === 0}
                                                    style={{ opacity: available === 0 ? 0.5 : 1 }}
                                                >
                                                    Allocate
                                                </button>
                                                <button className="vi-action-btn" onClick={() => onEdit(item)}>Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InventoryTable;
