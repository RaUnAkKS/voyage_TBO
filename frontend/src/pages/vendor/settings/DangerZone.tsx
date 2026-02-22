import { AlertTriangle, X } from 'lucide-react';
import { useSettingsCtx } from './SettingsLayout';
import '../../../styles/VendorSettings.css';

const DangerZone = () => {
    const { setModal } = useSettingsCtx();

    return (
        <div>
            <div className="vs-danger-card">
                <div className="vs-danger-row">
                    <div className="vs-danger-info">
                        <h4>Deactivate Account</h4>
                        <p>Temporarily disable your vendor account. Your data will be preserved and you can reactivate anytime by contacting support.</p>
                    </div>
                    <button className="vs-btn-danger" onClick={() => setModal('deactivate')}>
                        <AlertTriangle size={15} /> Deactivate
                    </button>
                </div>
            </div>
            <div className="vs-danger-card">
                <div className="vs-danger-row">
                    <div className="vs-danger-info">
                        <h4>Delete Account Permanently</h4>
                        <p>Permanently delete all your data, inventory records, and event allocations. This action <strong>cannot be undone</strong>.</p>
                    </div>
                    <button className="vs-btn-danger" onClick={() => setModal('delete')}>
                        <X size={15} /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DangerZone;
