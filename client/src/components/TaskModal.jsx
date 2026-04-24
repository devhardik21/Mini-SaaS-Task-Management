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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                        {isEdit ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Title */}
                    <div>
                        <label className="label">Task Title *</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="What needs to be done?"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            maxLength={255}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">Description</label>
                        <textarea
                            className="input"
                            placeholder="Add more details..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            style={{ resize: 'vertical', minHeight: 80 }}
                        />
                    </div>

                    {/* Priority + Status row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label className="label">Priority</label>
                            <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
                            {isEdit ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
