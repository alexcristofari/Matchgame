'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Minimal Form Input ── */
export const FormInput = ({
    label,
    type,
    value,
    onChange,
    required = true,
    placeholder = '',
    hint = ''
}: {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    hint?: string;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative">
            <label className={`block text-xs uppercase tracking-widest mb-2 transition-colors duration-300 ${isFocused ? 'text-white' : 'text-gray-500'}`}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-3.5
                    bg-transparent
                    border-b-2 rounded-none
                    text-white text-base
                    placeholder:text-gray-700
                    transition-all duration-300
                    focus:outline-none
                    ${isFocused
                        ? 'border-white'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }
                `}
            />
            {hint && (
                <p className="text-gray-600 text-xs mt-2">{hint}</p>
            )}
        </div>
    );
};

/* ── Minimal Button ── */
export const MinimalButton = ({
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
            relative w-full py-4
            bg-white text-black
            font-semibold text-sm uppercase tracking-widest
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-200
            transition-colors duration-300
        "
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.99 }}
    >
        <span className="flex items-center justify-center gap-3">
            {loading && (
                <motion.div
                    className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            )}
            {children}
        </span>
    </motion.button>
);

/* ── Error Message ── */
export const ErrorMessage = ({ error }: { error: string }) => (
    <AnimatePresence>
        {error && (
            <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6"
            >
                <div className="border-l-2 border-red-500 bg-red-500/5 text-red-400 px-4 py-3 text-sm">
                    {error}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

/* ── Password Strength Checks ── */
export const PasswordChecks = ({ password }: { password: string }) => {
    const checks = [
        { label: 'Mínimo 6 caracteres', done: password.length >= 6 },
        { label: 'Uma letra maiúscula', done: /[A-Z]/.test(password) },
        { label: 'Um número', done: /[0-9]/.test(password) },
    ];

    if (!password) return null;

    return (
        <motion.div
            className="mt-3 space-y-1.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
        >
            {checks.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${c.done ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-600'}`}>
                        {c.done ? '✓' : ''}
                    </span>
                    <span className={c.done ? 'text-gray-400' : 'text-gray-600'}>{c.label}</span>
                </div>
            ))}
        </motion.div>
    );
};
