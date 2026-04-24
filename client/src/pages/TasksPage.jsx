import { useEffect, useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks.js';
import { useAppUser } from '../hooks/useAppUser.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { Plus, Search, Filter } from 'lucide-react';
import api from '../lib/axios.js';

export default function TasksPage() {
    const { user } = useAppUser();
    const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
    const [filters, setFilters] = useState({ status: '', priority: '', label: '', search: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        fetchTasks(filters);
    }, [fetchTasks, filters]);

    const handleCreate = async (data) => {
        await createTask(data);
    };

    const handleUpdate = async (id, data) => {
        await updateTask(id, data);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(id);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800 }}>My Tasks</h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Manage and track all your tasks in one place.
                    </p>
                </div>
                <button className="btn-primary" onClick={() => { setEditTask(null); setModalOpen(true); }}>
                    <Plus size={18} />
                    New Task
                </button>
            </div>

            {/* Filter section */}
            <div className="card" style={{ padding: '16px' }}>
                <FilterBar filters={filters} onChange={setFilters} />
            </div>

            {/* Stats brief */}
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {['pending', 'in_progress', 'completed'].map(s => {
                    const count = tasks.filter(t => t.status === s).length;
                    return (
                        <div key={s} style={{
                            padding: '8px 16px', borderRadius: 10, background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)', fontSize: '0.85rem', display: 'flex', gap: 8, whiteSpace: 'nowrap'
                        }}>
                            <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{s.replace('_', ' ')}:</span>
                            <span style={{ fontWeight: 700 }}>{count}</span>
                        </div>
                    );
                })}
            </div>

            {/* Task List */}
            {loading && tasks.length === 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {[...Array(6)].map((_, i) => <div key={i} className="shimmer" style={{ height: 160, borderRadius: 14 }} />)}
                </div>
            ) : tasks.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎯</div>
                    <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>No tasks found</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                        Try adjusting your filters or create a new task to get started.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            onEdit={(t) => { setEditTask(t); setModalOpen(true); }}
                            isAdmin={user?.role === 'admin'}
                        />
                    ))}
                </div>
            )}

            <TaskModal
                isOpen={modalOpen}
                task={editTask}
                onClose={() => { setModalOpen(false); setEditTask(null); }}
                onSubmit={editTask ? (data) => handleUpdate(editTask.id, data) : handleCreate}
            />
        </div>
    );
}
