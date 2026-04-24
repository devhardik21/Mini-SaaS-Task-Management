import { useState, useCallback } from 'react';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
            const { data } = await api.get(`/api/tasks?${params}`);
            setTasks(data.tasks || []);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = useCallback(async (taskData) => {
        try {
            const { data } = await api.post('/api/tasks', taskData);
            setTasks((prev) => [data.task, ...prev]);
            toast.success('Task created!');
            return data.task;
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    }, []);

    const updateTask = useCallback(async (id, updates) => {
        try {
            const { data } = await api.patch(`/api/tasks/${id}`, updates);
            setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
            toast.success('Task updated!');
            return data.task;
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    }, []);

    const deleteTask = useCallback(async (id) => {
        try {
            await api.delete(`/api/tasks/${id}`);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            toast.success('Task deleted');
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    }, []);

    return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
};
