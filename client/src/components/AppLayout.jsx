import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import { useAppUser } from '../hooks/useAppUser.js';

export default function AppLayout() {
    const { user } = useAppUser();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
            <Sidebar user={user} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Navbar user={user} />
                <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
