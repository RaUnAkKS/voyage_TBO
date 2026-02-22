import { Search, Filter } from 'lucide-react';
import { EventType } from '../../../mockData/inventoryData';
import { ActiveEventStatus } from '../../../mockData/activeEventsData';
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

const STATUS_OPTIONS: DropdownOption<ActiveEventStatus | 'ALL'>[] = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PREPARATION', label: 'Preparation' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'NEAR_COMPLETION', label: 'Near Completion' },
];

interface Props {
    query: string;
    setQuery: (v: string) => void;
    type: EventType | 'ALL';
    setType: (v: EventType | 'ALL') => void;
    status: ActiveEventStatus | 'ALL';
    setStatus: (v: ActiveEventStatus | 'ALL') => void;
    resultCount: number;
}

const ActiveEventFilters = ({
    query, setQuery, type, setType, status, setStatus, resultCount,
}: Props) => (
    <div className="ae-filters">
        {/* Search */}
        <div className="ae-search-wrap">
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
            minWidth="168px"
        />

        {/* Live count */}
        <span className="ae-result-count">
            <Filter size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {resultCount} event{resultCount !== 1 ? 's' : ''}
        </span>
    </div>
);

export default ActiveEventFilters;
