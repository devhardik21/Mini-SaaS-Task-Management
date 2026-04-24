import { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import StatsWidget from '../components/StatsWidget.jsx';
import ProgressChart from '../components/ProgressChart.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { useAppUser } from '../hooks/useAppUser.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import { BarChart3, Zap, ClipboardList, CheckCircle2, Sparkles } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAppUser();
    const { tasks, loading: tasksLoading, fetchTasks, updateTask, deleteTask, createTask } = useTasks();
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        fetchTasks();

        api.get('/api/tasks/stats').then(({ data }) => setStats(data)).finally(() => setStatsLoading(false));
        api.get('/api/tasks/chart').then(({ data }) => setChartData(data.chart)).finally(() => setChartLoading(false));
        api.get('/api/activity').then(({ data }) => setActivities(data.activities)).finally(() => setActivityLoading(false));
    }, [fetchTasks]);

    const refreshStats = () => {
        api.get('/api/tasks/stats').then(({ data }) => setStats(data));
        api.get('/api/tasks/chart').then(({ data }) => setChartData(data.chart));
        api.get('/api/activity').then(({ data }) => setActivities(data.activities));
    };

    const handleCreate = async (data) => {
        await createTask(data);
        refreshStats();
    };

    const handleUpdate = async (id, data) => {
        await updateTask(id, data);
        refreshStats();
        return data;
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
        refreshStats();
    };

    const recentTasks = tasks.slice(0, 4);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Welcome header */}
            <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                    Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! <Sparkles size={20} color="#f59e0b" />
                </h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Here's what's happening with your tasks today.
                </p>
            </div>

            {/* Stats */}
            <StatsWidget data={stats} loading={statsLoading} />

            {/* Chart + Activity side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                <div className="card" style={{ padding: '20px 20px 12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <BarChart3 size={16} color="var(--color-primary)" /> Completion Over 30 Days
                    </div>
                    <ProgressChart data={chartData} loading={chartLoading} />
                </div>

                <div className="card" style={{ padding: '20px', overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Zap size={16} color="#f59e0b" /> Recent Activity
                    </div>
                    <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                        <ActivityFeed activities={activities.slice(0, 8)} loading={activityLoading} />
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <ClipboardList size={16} color="#10b981" /> Recent Tasks
                    </div>
                    <button className="btn-primary" onClick={() => { setEditTask(null); setModalOpen(true); }}>
                        + New Task
                    </button>
                </div>

                {tasksLoading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                        {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 140, borderRadius: 14 }} />)}
                    </div>
                ) : recentTasks.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <CheckCircle2 size={24} color="#10b981" />
                        </div>
                        <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>No tasks yet!</div>
                        <div style={{ fontSize: '0.85rem' }}>Create your first task to get started.</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                        {recentTasks.map((task) => (
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
            </div>

            <TaskModal
                isOpen={modalOpen}
                task={editTask}
                onClose={() => { setModalOpen(false); setEditTask(null); }}
                onSubmit={editTask ? (data) => handleUpdate(editTask.id, data) : handleCreate}
            />
        </div>
    );
}

