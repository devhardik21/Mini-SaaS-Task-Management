import { Tag, Search, X } from 'lucide-react';

export default function FilterBar({ filters, onChange }) {
    const update = (key, val) => onChange({ ...filters, [key]: val });

    const select = (key, options, placeholder) => (
        <select
            className="select"
            style={{ width: 'auto', minWidth: 140 }}
            value={filters[key] || ''}
            onChange={(e) => update(key, e.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    );

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {select('status', [
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
            ], 'All Status')}

            {select('priority', [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
            ], 'All Priority')}

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Tag size={14} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
                <input
                    className="input"
                    style={{ width: 'auto', minWidth: 180, paddingLeft: 34 }}
                    type="text"
                    placeholder="Filter by label..."
                    value={filters.label || ''}
                    onChange={(e) => update('label', e.target.value)}
                />
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
                <input
                    className="input"
                    style={{ width: 'auto', minWidth: 200, paddingLeft: 34 }}
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search || ''}
                    onChange={(e) => update('search', e.target.value)}
                />
            </div>

            {(filters.status || filters.priority || filters.label || filters.search) && (
                <button className="btn-ghost" onClick={() => onChange({})} style={{ border: 'none', background: 'var(--bg-hover)', color: 'var(--text-primary)', padding: '8px 12px' }}>
                    <X size={14} /> Clear
                </button>
            )}
        </div>
    );
}

