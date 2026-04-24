import { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import ActivityFeed from '../components/ActivityFeed.jsx';
import { RefreshCw, History } from 'lucide-react';

export default function ActivityPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/activity');
            setActivities(data.activities);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800 }}>Activity Log</h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        A detailed history of all actions performed in the system.
                    </p>
                </div>
                <button
                    className="btn-ghost"
                    onClick={fetchActivity}
                    disabled={loading}
                    style={{ padding: '8px 12px' }}
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="card" style={{ padding: '0 24px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0',
                    borderBottom: '1px solid var(--border-subtle)', marginBottom: 8
                }}>
                    <History size={18} color="var(--color-primary-light)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Timeline</span>
                </div>
                <div style={{ paddingBottom: 24 }}>
                    <ActivityFeed activities={activities} loading={loading} />
                </div>
            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
        </div>
    );
}
