import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Activity, ShieldCheck, Zap } from 'lucide-react';

const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/activity', label: 'Activity', icon: Activity },
];

export default function Sidebar({ user }) {
    return (
        <aside className="glass" style={{
            width: 260,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 16px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            borderRight: '1px solid var(--border-subtle)',
            zIndex: 40,
        }}>
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 32px' }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)',
                }}>
                    <Zap size={22} color="#fff" fill="#fff" />
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>TaskFlow</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Management Suite</div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px 8px' }}>
                    Main Menu
                </div>
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        <Icon size={18} strokeWidth={2.2} />
                        <span>{label}</span>
                    </NavLink>
                ))}

                {user?.role === 'admin' && (
                    <>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '24px 12px 8px' }}>
                            Administration
                        </div>
                        <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                            <ShieldCheck size={18} strokeWidth={2.2} />
                            <span>Admin Panel</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div style={{ flex: 1 }} />

            {/* User Profile Section */}
            {user && (
                <div style={{
                    marginTop: 'auto',
                    padding: '16px',
                    borderRadius: 16,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-muted)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'var(--bg-hover)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-light)'
                        }}>
                            {user.name?.[0] || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                {user.name || 'User'}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Workspace Access</div>
                        </div>
                    </div>

                    <span style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: user.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(16, 185, 129, 0.1)',
                        color: user.role === 'admin' ? '#818cf8' : '#10b981',
                        border: `1px solid ${user.role === 'admin' ? 'rgba(99,102,241,0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        width: '100%',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                    }}>
                        {user.role === 'admin' ? <ShieldCheck size={12} /> : <Zap size={12} />}
                        {user.role === 'admin' ? 'Administrator' : 'Premium Member'}
                    </span>
                </div>
            )}
        </aside>
    );
}
