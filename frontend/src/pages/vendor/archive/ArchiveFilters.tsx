import { Search, Filter } from 'lucide-react';
import { EventType } from '../../../mockData/inventoryData';
import { ArchiveStatus } from '../../../mockData/archiveData';
import CustomDropdown, { DropdownOption } from '../../../components/vendor/CustomDropdown';
import '../../../styles/CustomDropdown.css';

const TYPE_OPTIONS: DropdownOption<EventType | 'ALL'>[] = [
    { value: 'ALL', label: 'All Types' },
    { value: 'WEDDING', label: 'Wedding' },
    { value: 'MEETING', label: 'Meeting' },
    { value: 'INCENTIVE', label: 'Incentive' },
    { value: 'CONFERENCE', label: 'Conference' },
    { value: 'EXHIBITION', label: 'Exhibition' },
];

const STATUS_OPTIONS: DropdownOption<ArchiveStatus | 'ALL'>[] = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'ARCHIVED', label: 'Archived' },
];

interface Props {
    query: string;
    setQuery: (v: string) => void;
    type: EventType | 'ALL';
    setType: (v: EventType | 'ALL') => void;
    status: ArchiveStatus | 'ALL';
    setStatus: (v: ArchiveStatus | 'ALL') => void;
    resultCount: number;
}

const ArchiveFilters = ({ query, setQuery, type, setType, status, setStatus, resultCount }: Props) => (
    <div className="ea-filters">
        {/* Search */}
        <div className="ea-search-wrap">
            <Search size={14} />
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by event name, code, or client…"
            />
        </div>

        {/* Type filter */}
        <CustomDropdown
            options={TYPE_OPTIONS}
            value={type}
            onChange={setType}
            minWidth="150px"
        />

        {/* Status filter */}
        <CustomDropdown
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            minWidth="150px"
        />

        {/* Result count */}
        <span className="ea-result-count">
            <Filter size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {resultCount} event{resultCount !== 1 ? 's' : ''}
        </span>
    </div>
);

export default ArchiveFilters;
