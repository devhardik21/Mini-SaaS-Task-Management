import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Activity, ShieldCheck, Zap } from 'lucide-react';

const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/activity', label: 'Activity', icon: Activity },
];

export default function Sidebar({ user }) {
    return (
        <aside style={{
            width: 240,
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 12px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px 24px' }}>
                <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Zap size={18} color="#fff" />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>TaskFlow</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mini SaaS</div>
                </div>
            </div>

            {/* Nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        <Icon size={17} />
                        {label}
                    </NavLink>
                ))}
                {user?.role === 'admin' && (
                    <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        <ShieldCheck size={17} />
                        Admin Panel
                    </NavLink>
                )}
            </nav>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* User role badge */}
            {user && (
                <div style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                }}>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>
                        {user.name || 'User'}
                    </div>
                    <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 10px',
                        borderRadius: 99,
                        background: user.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(16, 185, 129, 0.1)',
                        color: user.role === 'admin' ? '#818cf8' : '#10b981',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        width: 'fit-content'
                    }}>
                        {user.role === 'admin' && <Zap size={10} />}
                        {user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                </div>
            )}
        </aside>
    );
}
