'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(/plano_fundo.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

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

      {/* Hero Content - Grid layout */}
      <section className="relative z-10 min-h-[calc(100vh-180px)] px-8 lg:px-16 flex flex-col justify-between py-8">
        {/* Top area - Title on left */}
        <div className="flex items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <h1>
              <span className="block text-4xl md:text-6xl lg:text-7xl font-light italic text-gray-200 tracking-wide mb-3">
                A New
              </span>
              <span className="block text-6xl md:text-8xl lg:text-[10rem] font-extrabold tracking-tight leading-[0.85]">
                WORLD
              </span>
              <span className="block text-3xl md:text-5xl lg:text-6xl font-light italic text-gray-300 tracking-wide mt-2">
                Waiting You
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Bottom area - Description and Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-auto"
        >
          <div className="max-w-xl">
            <p className="text-base md:text-lg font-semibold tracking-[4px] uppercase text-white mb-4">
              Explore Your Dream..
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-8">
              Connect with gamers who share your taste in games, music,
              movies, and anime. Match based on what you actually play and watch.
            </p>

            <Link href="/auth/register" className="btn-primary text-base px-10 py-5">
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 px-8 lg:px-16 py-4 border-t border-white/10">
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
