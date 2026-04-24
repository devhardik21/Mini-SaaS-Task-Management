import { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import StatsWidget from '../components/StatsWidget.jsx';
import ProgressChart from '../components/ProgressChart.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { useAppUser } from '../hooks/useAppUser.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';

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
                <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800 }}>
                    Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
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
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>📈 Completion Over 30 Days</div>
                    <ProgressChart data={chartData} loading={chartLoading} />
                </div>

                <div className="card" style={{ padding: '20px', overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>⚡ Recent Activity</div>
                    <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                        <ActivityFeed activities={activities.slice(0, 8)} loading={activityLoading} />
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>📋 Recent Tasks</div>
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
                        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>✅</div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>No tasks yet!</div>
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
