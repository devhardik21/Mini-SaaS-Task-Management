import { useState } from 'react';
import { Calendar, Tag, Trash2, Edit2, CheckCircle, Clock, Loader } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

const PRIORITY_CONFIG = {
    low: { label: 'Low', className: 'badge-low', dot: '#22c55e' },
    medium: { label: 'Medium', className: 'badge-medium', dot: '#f59e0b' },
    high: { label: 'High', className: 'badge-high', dot: '#ef4444' },
};

const STATUS_CONFIG = {
    pending: { label: 'Pending', className: 'badge-pending', next: 'in_progress' },
    in_progress: { label: 'In Progress', className: 'badge-in_progress', next: 'completed' },
    completed: { label: 'Completed', className: 'badge-completed', next: null },
};

export default function TaskCard({ task, onUpdate, onDelete, onEdit, isAdmin }) {
    const [updating, setUpdating] = useState(false);

    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
    const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

    const isOverdue = task.due_date &&
        task.status !== 'completed' &&
        isPast(new Date(task.due_date + 'T23:59:59'));

    const handleAdvanceStatus = async () => {
        if (!status.next || updating) return;
        setUpdating(true);
        try {
            await onUpdate(task.id, { status: status.next });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="card animate-fade-up" style={{
            borderLeft: `3px solid ${priority.dot}`,
            position: 'relative',
            opacity: task.status === 'completed' ? 0.75 : 1,
        }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                        margin: '0 0 6px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p style={{
                            margin: '0 0 10px', fontSize: '0.82rem', color: 'var(--text-secondary)',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                            {task.description}
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                        className="btn-ghost"
                        style={{ padding: '6px 8px', borderRadius: 8 }}
                        onClick={() => onEdit(task)}
                        title="Edit"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        className="btn-danger"
                        style={{ padding: '6px 8px' }}
                        onClick={() => onDelete(task.id)}
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Badges row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                <span className={`${priority.className}`} style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: 99, letterSpacing: '0.02em',
                }}>
                    ▲ {priority.label}
                </span>
                <span className={`${status.className}`} style={{
                    fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                }}>
                    {status.label}
                </span>
                {task.label && (
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: '0.72rem', color: 'var(--text-muted)',
                        background: 'var(--bg-hover)', padding: '3px 10px', borderRadius: 99,
                    }}>
                        <Tag size={10} /> {task.label}
                    </span>
                )}
                {isOverdue && (
                    <span style={{
                        fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px',
                        borderRadius: 99, background: 'rgba(239,68,68,0.15)',
                        color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
                    }}>
                        ⚠ Overdue
                    </span>
                )}
            </div>

            {/* Footer row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {task.due_date && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: isOverdue ? '#ef4444' : 'var(--text-muted)' }}>
                            <Calendar size={12} />
                            {format(parseISO(task.due_date), 'MMM d, yyyy')}
                        </span>
                    )}
                    {isAdmin && task.user_name && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            👤 {task.user_name}
                        </span>
                    )}
                </div>

                {/* Status advance button */}
                {status.next && (
                    <button
                        onClick={handleAdvanceStatus}
                        disabled={updating}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            background: 'rgba(99,102,241,0.12)', color: '#818cf8',
                            border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8,
                            padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600,
                            cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.7 : 1,
                        }}
                    >
                        {updating ? <Loader size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <CheckCircle size={12} />}
                        {status.next === 'in_progress' ? 'Start' : 'Complete'}
                    </button>
                )}
            </div>
        </div>
    );
}
