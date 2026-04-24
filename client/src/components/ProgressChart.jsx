import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)',
            borderRadius: 10, padding: '10px 14px', fontSize: '0.83rem',
        }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                {label ? format(parseISO(label), 'MMM d') : ''}
            </div>
            <div style={{ color: '#818cf8', fontWeight: 700 }}>
                {payload[0].value} completed
            </div>
        </div>
    );
};

export default function ProgressChart({ data, loading }) {
    if (loading) {
        return <div className="shimmer" style={{ height: 200, borderRadius: 12 }} />;
    }

    const hasData = data?.some((d) => d.completed > 0);

    return (
        <div style={{ width: '100%', height: 200 }}>
            {!hasData ? (
                <div style={{
                    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', flexDirection: 'column', gap: 6, fontSize: '0.85rem',
                }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <TrendingUp size={20} color="var(--text-muted)" />
                    </div>
                    Complete tasks to see your progress here
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(v) => format(parseISO(v), 'MMM d')}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            interval={6}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="completed"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            fill="url(#colorCompleted)"
                            dot={false}
                            activeDot={{ r: 5, fill: '#818cf8', strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
