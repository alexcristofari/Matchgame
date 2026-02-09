'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/auth';

export default function RegisterPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError('Password needs an uppercase letter');
            return;
        }
        if (!/[0-9]/.test(formData.password)) {
            setError('Password needs a number');
            return;
        }

        setLoading(true);

        try {
            const response = await authApi.register(formData);
            if (response.success) {
                localStorage.setItem('accessToken', response.data.tokens.accessToken);
                localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
                setUser(response.data.user);
                router.push('/dashboard');
            } else {
                setError(response.error || 'Registration failed');
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden flex">
            {/* Left side - Form */}
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
                        <h2 className="heading-lg mb-2">Create Account</h2>
                        <p className="body-text mb-8">Start your journey to find your squad</p>

                        {error && <div className="error-message mb-6">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label">Your Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    minLength={2}
                                />
                            </div>

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
                                    placeholder="Min 6 chars, 1 uppercase, 1 number"
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
                                        Creating...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="divider my-8" />

                        <p className="text-center body-text">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-white font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
                {/* Large geometric circle */}
                <motion.div
                    className="geo-circle w-[600px] h-[600px] -right-48"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Dot pattern */}
                <div className="dot-pattern absolute left-20 top-1/3 w-24 h-32 opacity-30" />

                {/* Content overlay */}
                <div className="relative z-10 px-16 text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link href="/" className="flex items-center justify-end gap-3 mb-12">
                            <span className="font-semibold tracking-wide">MATCHGAME</span>
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                <span className="text-black font-bold">M</span>
                            </div>
                        </Link>

                        <h1 className="heading-display-bold mb-4">
                            Join<br />Today
                        </h1>
                        <p className="body-text max-w-sm ml-auto">
                            Connect your Steam, Spotify, and more. Find gamers who share your taste.
                        </p>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
