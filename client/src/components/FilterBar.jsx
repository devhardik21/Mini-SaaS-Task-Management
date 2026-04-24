export default function FilterBar({ filters, onChange }) {
    const update = (key, val) => onChange({ ...filters, [key]: val });

    const select = (key, options, placeholder) => (
        <select
            className="select"
            style={{ width: 'auto', minWidth: 130 }}
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            {select('status', [
                { value: 'pending', label: '⬜ Pending' },
                { value: 'in_progress', label: '🔵 In Progress' },
                { value: 'completed', label: '✅ Completed' },
            ], '⚪ All Status')}

            {select('priority', [
                { value: 'low', label: '🟢 Low' },
                { value: 'medium', label: '🟡 Medium' },
                { value: 'high', label: '🔴 High' },
            ], '▲ All Priority')}

            <input
                className="input"
                style={{ width: 'auto', minWidth: 180 }}
                type="text"
                placeholder="🏷 Filter by label..."
                value={filters.label || ''}
                onChange={(e) => update('label', e.target.value)}
            />

            <input
                className="input"
                style={{ width: 'auto', minWidth: 200 }}
                type="text"
                placeholder="🔍 Search tasks..."
                value={filters.search || ''}
                onChange={(e) => update('search', e.target.value)}
            />

            {(filters.status || filters.priority || filters.label || filters.search) && (
                <button className="btn-ghost" onClick={() => onChange({})}>
                    ✕ Clear Filters
                </button>
            )}
        </div>
    );
}
