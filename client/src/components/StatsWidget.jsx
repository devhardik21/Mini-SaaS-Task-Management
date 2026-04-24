import { TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const stats = [
    { key: 'total', label: 'Total Tasks', icon: TrendingUp, accent: 'indigo', format: (v) => v },
    { key: 'completion_rate', label: 'Completion Rate', icon: CheckCircle, accent: 'green', format: (v) => `${v}%` },
    { key: 'in_progress', label: 'In Progress', icon: Clock, accent: 'amber', format: (v) => v },
    { key: 'overdue', label: 'Overdue', icon: AlertTriangle, accent: 'red', format: (v) => v },
];

const ICON_COLORS = { indigo: '#818cf8', green: '#22c55e', amber: '#f59e0b', red: '#ef4444' };

export default function StatsWidget({ data, loading }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 16 }}>
            {stats.map(({ key, label, icon: Icon, accent, format }) => (
                <div key={key} className={`card stat-card-${accent}`} style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {label}
                        </span>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: `${ICON_COLORS[accent]}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Icon size={16} color={ICON_COLORS[accent]} />
                        </div>
                    </div>
                    {loading ? (
                        <div className="shimmer" style={{ height: 28, borderRadius: 6, width: '60%' }} />
                    ) : (
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {data ? format(data[key] ?? 0) : '—'}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
