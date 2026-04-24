import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios.js';

let cachedUser = null;

export const useAppUser = () => {
    const [user, setUser] = useState(cachedUser);
    const [loading, setLoading] = useState(!cachedUser);

    const sync = useCallback(async () => {
        try {
            // Sync profile data from Clerk to our DB
            if (window.Clerk?.user) {
                const clerkUser = window.Clerk.user;
                await api.post('/api/users/sync', {
                    clerk_id: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress,
                    name: clerkUser.fullName || clerkUser.firstName,
                    avatar_url: clerkUser.imageUrl,
                });
            }
            const { data } = await api.get('/api/users/me');
            cachedUser = data.user;
            setUser(data.user);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!cachedUser) sync();
    }, [sync]);

    const invalidate = () => { cachedUser = null; sync(); };

    return { user, loading, invalidate };
};
