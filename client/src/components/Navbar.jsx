import { useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Bell } from 'lucide-react';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/tasks': 'My Tasks',
    '/activity': 'Activity Log',
    '/admin': 'Admin Panel',
};

export default function Navbar({ user }) {
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'TaskFlow';

    return (
        <header style={{
            height: 60,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
        }}>
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {user?.role === 'admin' && (
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
                        background: 'rgba(99,102,241,0.2)', color: '#818cf8',
                        padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(99,102,241,0.3)',
                    }}>
                        ADMIN
                    </span>
                )}
                <button style={{
                    background: 'transparent', border: '1px solid var(--border-muted)',
                    borderRadius: 10, padding: '7px', cursor: 'pointer', color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center',
                }}>
                    <Bell size={16} />
                </button>
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    );
}
