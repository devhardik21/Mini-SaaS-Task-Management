import { formatDistanceToNow } from 'date-fns';
import { ClipboardList } from 'lucide-react';

export default function ActivityFeed({ activities, loading }) {
    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="shimmer" style={{ height: 52, borderRadius: 10 }} />
                ))}
            </div>
        );
    }

    if (!activities?.length) {
        return (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <ClipboardList size={20} color="var(--text-muted)" />
                </div>
                <div style={{ fontSize: '0.85rem' }}>No activity yet.</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activities.map((a, i) => (
                <div key={a.id} className="animate-slide-in" style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: i < activities.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    animationDelay: `${i * 30}ms`,
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, color: '#fff',
                        overflow: 'hidden',
                    }}>
                        {a.user_avatar
                            ? <img src={a.user_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (a.user_name?.[0] || '?').toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 2 }}>
                            {a.action}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {a.user_name && <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{a.user_name} · </span>}
                            {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

