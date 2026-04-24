import { Navigate, Outlet } from 'react-router-dom';
import { useAppUser } from '../hooks/useAppUser.js';

export default function AdminRoute() {
    const { user, loading } = useAppUser();

    if (loading) return null;
    if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}
