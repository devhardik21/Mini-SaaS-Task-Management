import { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import { Users, Shield, CheckCircle, Clock, Trash2, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/users');
            setUsers(data.users);
        } catch (err) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Are you sure you want to change this user to ${newRole}?`)) return;

        setUpdatingId(userId);
        try {
            await api.patch(`/api/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success(`User updated to ${newRole}`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800 }}>Admin Control Panel</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Manage users, roles, and global system metrics.
                </p>
            </div>

            {/* User Management Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={18} color="var(--color-primary-light)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>User Directory</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Total Users: {users.length}
                    </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <th style={{ padding: '14px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>User</th>
                                <th style={{ padding: '14px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
                                <th style={{ padding: '14px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Task Stats</th>
                                <th style={{ padding: '14px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joined</th>
                                <th style={{ padding: '14px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i}><td colSpan="5" style={{ padding: '20px 24px' }}>
                                        <div className="shimmer" style={{ height: 40, borderRadius: 8 }} />
                                    </td></tr>
                                ))
                            ) : users.map((u) => (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-hover)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                            }}>
                                                {u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: '100%', height: '100%' }} /> : <Users size={18} />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.name || 'Anonymous'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Mail size={10} /> {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99,
                                            background: u.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(34,197,94,0.15)',
                                            color: u.role === 'admin' ? '#818cf8' : '#22c55e',
                                            border: `1px solid ${u.role === 'admin' ? 'rgba(99,102,241,0.3)' : 'rgba(34,197,94,0.3)'}`,
                                            textTransform: 'uppercase'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Clock size={12} color="var(--text-muted)" /> {u.task_count || 0}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <CheckCircle size={12} color="#22c55e" /> {u.completed_count || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Calendar size={12} />
                                            {format(new Date(u.created_at), 'MMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button
                                            className="btn-ghost"
                                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                            onClick={() => handleToggleRole(u.id, u.role)}
                                            disabled={updatingId === u.id}
                                        >
                                            {updatingId === u.id ? 'Updating...' : u.role === 'admin' ? 'Demote' : 'Promote'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
