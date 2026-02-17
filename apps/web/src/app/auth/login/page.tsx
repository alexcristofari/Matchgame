'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/auth';

// Gradient orb component
const GradientOrb = ({ className }: { className?: string }) => (
    <motion.div
        className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    />
);

// Input component with floating label
const FormInput = ({
    label,
    type,
    value,
    onChange,
    required = true,
    placeholder = ''
}: {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <label
                className={`
          block text-sm font-medium mb-3 transition-colors duration-300
          ${isFocused ? 'text-pink-400' : 'text-gray-400'}
        `}
            >
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                    placeholder={placeholder}
                    className={`
            w-full px-5 py-4 
            bg-zinc-900/80 backdrop-blur-sm
            border-2 rounded-xl
            text-white text-base
            placeholder:text-gray-600
            transition-all duration-300
            focus:outline-none
            ${isFocused
                            ? 'border-pink-500/50 shadow-lg shadow-pink-500/10'
                            : 'border-zinc-800 hover:border-zinc-700'
                        }
          `}
                />
                {/* Focus glow effect */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-xl blur-xl"
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Gradient button component
const GradientButton = ({
    children,
    loading = false,
    type = 'submit'
}: {
    children: React.ReactNode;
    loading?: boolean;
    type?: 'submit' | 'button';
}) => (
    <motion.button
        type={type}
        disabled={loading}
        className="
      relative w-full py-4 rounded-full
      font-semibold text-white text-base
      overflow-hidden
      disabled:opacity-50 disabled:cursor-not-allowed
      group
    "
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
    >
        {/* Gradient background */}
        <div
            className="absolute inset-0 transition-all duration-500"
            style={{
                background: 'linear-gradient(90deg, #ec4899 0%, #f97316 50%, #ec4899 100%)',
                backgroundSize: '200% 100%',
            }}
        />

        {/* Hover shine effect */}
        <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            }}
            animate={{
                x: ['-100%', '100%'],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
            }}
        />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-3">
            {loading && (
                <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            )}
            {children}
        </span>
    </motion.button>
);

// Main Login Page Component
export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                setError(response.error || 'Falha no login');
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Falha no login');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 bg-black flex items-center justify-center px-8 py-12 relative overflow-hidden">
                {/* Background gradient orbs */}
                <GradientOrb className="w-96 h-96 -left-48 -top-48 bg-pink-600" />
                <GradientOrb className="w-64 h-64 -right-32 bottom-1/4 bg-orange-600" />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px'
                    }}
                />

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-md"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:shadow-pink-500/40 transition-shadow">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                MatchGame
                            </span>
                        </Link>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 flex items-center gap-3">
                            Faça o seu login
                            <motion.span
                                className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [1, 0.8, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity
                                }}
                            />
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Entre para encontrar seu squad perfeito
                        </p>
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6"
                            >
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl text-sm flex items-center gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(value) => setFormData({ ...formData, email: value })}
                        />

                        <FormInput
                            label="Senha"
                            type="password"
                            value={formData.password}
                            onChange={(value) => setFormData({ ...formData, password: value })}
                        />

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="pt-4"
                        >
                            <GradientButton loading={loading}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </GradientButton>
                        </motion.div>
                    </form>

                    {/* Register Link */}
                    <motion.p
                        className="text-center text-gray-500 mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        ainda não tem uma conta?{' '}
                        <Link
                            href="/auth/register"
                            className="text-white font-medium hover:text-pink-400 transition-colors underline underline-offset-4"
                        >
                            criar conta
                        </Link>
                    </motion.p>
                </motion.div>
            </div>

            {/* Right Side - Image/Visual */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(/pxfuel1.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black" />

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Floating text */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute bottom-16 left-16 right-16"
                >
                    <blockquote className="text-2xl font-light text-white mb-4 italic font-serif leading-relaxed">
                        "O encontro de duas personalidades assemelha-se ao contato de duas substâncias químicas: se houver alguma reação, ambas são transformadas."
                    </blockquote>
                    <cite className="text-gray-400 text-sm block font-mono uppercase tracking-widest">
                        — Carl Jung
                    </cite>
                </motion.div>
            </div>
        </main>
    );
}
