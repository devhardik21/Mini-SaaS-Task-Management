import { useNavigate } from 'react-router-dom';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { CheckCircle, Zap, Shield, BarChart2, Users, Tag } from 'lucide-react';
import { useEffect } from 'react';

const features = [
    { icon: CheckCircle, title: 'Smart Task Management', desc: 'Create, track and complete tasks with priorities, labels and due dates.' },
    { icon: Shield, title: 'Secure by Default', desc: 'Google OAuth via Clerk, JWT tokens, rate limiting and role-based access.' },
    { icon: BarChart2, title: 'Progress Analytics', desc: 'Visual charts, completion rates and overdue tracking at a glance.' },
    { icon: Users, title: 'Multi-User SaaS', desc: 'Each user sees only their tasks. Admins get a global view across all users.' },
    { icon: Tag, title: 'Labels & Priorities', desc: 'Color-coded priorities (Low / Medium / High) and custom labels for any workflow.' },
    { icon: Zap, title: 'Activity Log', desc: 'Every action is tracked. See exactly what happened and when.' },
];

export default function LandingPage() {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSignedIn) navigate('/dashboard', { replace: true });
    }, [isSignedIn, navigate]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
            {/* Top nav */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 48px', borderBottom: '1px solid var(--border-subtle)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Zap size={18} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>TaskFlow</span>
                </div>
                <SignInButton mode="modal">
                    <button className="btn-primary">Sign In</button>
                </SignInButton>
            </nav>

            {/* Hero */}
            <section style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center',
                padding: '80px 32px 60px', flex: 1,
            }}>
                <div style={{
                    display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                    background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                    border: '1px solid rgba(99,102,241,0.3)', borderRadius: 99,
                    padding: '5px 16px', marginBottom: 24,
                }}>
                    ⚡ PRODUCTION-READY MINI SAAS
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                    fontWeight: 900, lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #f1f1f5, #94a3b8)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    margin: '0 0 20px', maxWidth: 700,
                }}>
                    Manage Tasks.
                    <br />
                    <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Ship Faster.
                    </span>
                </h1>

                <p style={{
                    fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                    maxWidth: 540, margin: '0 0 40px',
                }}>
                    A full-stack SaaS task manager with Google OAuth, role-based access,
                    real-time stats, and activity tracking — built with Node.js, PostgreSQL & React.
                </p>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <SignInButton mode="modal">
                        <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                            Get Started Free →
                        </button>
                    </SignInButton>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: '12px 24px', fontSize: '1rem', textDecoration: 'none' }}>
                        View Code
                    </a>
                </div>

                {/* Trust badges */}
                <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['JWT Auth', 'Rate Limited', 'RBAC', 'PostgreSQL', 'React 19'].map((badge) => (
                        <span key={badge} style={{
                            fontSize: '0.78rem', color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                            {badge}
                        </span>
                    ))}
                </div>
            </section>

            {/* Features grid */}
            <section style={{ padding: '40px 48px 80px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, marginBottom: 32, color: 'var(--text-primary)' }}>
                    Everything you need
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: 'rgba(99,102,241,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon size={20} color="#818cf8" />
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
