'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login(formData);
            if (response.success) {
                localStorage.setItem('accessToken', response.data.tokens.accessToken);
                localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
                setUser(response.data.user);
                router.push('/dashboard');
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
                {/* Large geometric circle */}
                <motion.div
                    className="geo-circle w-[600px] h-[600px] -left-48"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Content overlay */}
                <div className="relative z-10 px-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link href="/" className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                <span className="text-black font-bold">M</span>
                            </div>
                            <span className="font-semibold tracking-wide">MATCHGAME</span>
                        </Link>

                        <h1 className="heading-display-bold mb-4">
                            Welcome<br />Back
                        </h1>
                        <p className="body-text max-w-sm">
                            Sign in to continue matching with gamers who share your interests.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-[#0a0a0a]">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Mobile logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-3 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-black font-bold text-sm">M</span>
                        </div>
                        <span className="font-semibold tracking-wide text-sm">MATCHGAME</span>
                    </Link>

                    <div className="card p-8">
                        <h2 className="heading-lg mb-2">Sign In</h2>
                        <p className="body-text mb-8">Enter your credentials to continue</p>

                        {error && <div className="error-message mb-6">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-filled w-full justify-center mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="divider my-8" />

                        <p className="text-center body-text">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/register" className="text-white font-medium hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
