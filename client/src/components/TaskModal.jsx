import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

const DEFAULT_FORM = {
    title: '', description: '', status: 'pending',
    priority: 'medium', label: '', due_date: '',
};

export default function TaskModal({ isOpen, onClose, onSubmit, task }) {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [saving, setSaving] = useState(false);

    const isEdit = !!task;

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending',
                priority: task.priority || 'medium',
                label: task.label || '',
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
            });
        } else {
            setForm(DEFAULT_FORM);
        }
    }, [task, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        setSaving(true);
        try {
            await onSubmit({ ...form, due_date: form.due_date || null });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {isEdit ? 'Edit Task' : 'New Task'}
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {isEdit ? 'Update your task details below.' : 'Add a new task to your list.'}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, borderRadius: 10, display: 'flex' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Title */}
                    <div>
                        <label className="label">Task Title</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="What needs to be done?"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            maxLength={255}
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">Description</label>
                        <textarea
                            className="input"
                            placeholder="Add more details (optional)..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            style={{ resize: 'vertical', minHeight: 80 }}
                        />
                    </div>

                    {/* Priority + Status row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="label">Priority</label>
                            <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Status</label>
                            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Label + Due Date row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="label">Label</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="e.g. Frontend, Bug..."
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                maxLength={100}
                            />
                        </div>
                        <div>
                            <label className="label">Due Date</label>
                            <input
                                className="input"
                                type="date"
                                value={form.due_date}
                                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                        <button type="button" className="btn-ghost" onClick={onClose} style={{ border: 'none' }}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving} style={{ minWidth: 120, justifyContent: 'center' }}>
                            {saving ? <Loader size={16} className="animate-spin" /> : (isEdit ? 'Save Changes' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

