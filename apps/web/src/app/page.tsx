'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        backgroundImage: 'url(/pxfuel1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* Navigation */}
      <header className="relative z-10 flex items-center justify-between px-8 lg:px-16 py-6">
        <div className="flex items-center gap-12">
          <button className="w-6 h-6 flex flex-col justify-center gap-1.5">
            <span className="w-full h-0.5 bg-white" />
            <span className="w-4 h-0.5 bg-white" />
          </button>

          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="nav-link active">Home</Link>
            <Link href="#about" className="nav-link">About Us</Link>
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#contact" className="nav-link">Contact</Link>
          </nav>
        </div>

        <Link href="/auth/login" className="nav-link">
          Login →
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex">
        {/* LEFT - Title */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-1/3 flex items-center pl-8 lg:pl-16"
        >
          <h1 className="leading-none">
            <span className="block text-4xl md:text-6xl lg:text-7xl font-light italic text-gray-200 tracking-wide">
              A New
            </span>
            <span className="block text-6xl md:text-8xl lg:text-[12rem] font-black tracking-tighter" style={{ lineHeight: '0.85' }}>
              WORLD
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl font-light italic text-gray-300 tracking-wide mt-2">
              Waiting You
            </span>
          </h1>
        </motion.div>

        {/* CENTER - Empty space for dragon */}
        <div className="w-1/3" />

        {/* RIGHT - Description */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-1/3 flex items-center justify-end pr-8 lg:pr-16"
        >
          <div className="text-right max-w-sm">
            <p className="text-lg md:text-xl font-semibold tracking-[3px] uppercase text-white mb-4">
              Explore Your Dream..
            </p>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Connect with gamers who share your taste in games, music,
              movies, and anime. Match based on what you actually play and watch.
            </p>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM - Get Started Button (centered below dragon) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 flex justify-center pb-28"
      >
        <Link href="/auth/register" className="btn-primary text-base px-10 py-4">
          Get Started
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 px-8 lg:px-16 py-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl">🎮</span>
            <p className="text-sm text-gray-400 hidden sm:block">
              Match with gamers who share your interests
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © MatchGame 2026
          </p>

          <div className="hidden sm:flex items-center gap-3">
            <a href="#" className="social-icon">f</a>
            <a href="#" className="social-icon">X</a>
            <a href="#" className="social-icon">in</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
