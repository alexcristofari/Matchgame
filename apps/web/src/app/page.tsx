'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SteamIcon, SpotifyIcon, AnimeIcon, MovieIcon } from '@/components/Icons';

export default function Home() {
  const features = [
    {
      icon: <SteamIcon className="w-8 h-8 md:w-10 md:h-10 text-[#a855f7]" />,
      title: "Steam Library",
      desc: "Connect your library to find players who own the same games.",
      color: "border-[#a855f7]/20 hover:border-[#a855f7]/50 shadow-[#a855f7]/10"
    },
    {
      icon: <SpotifyIcon className="w-8 h-8 md:w-10 md:h-10 text-[#22c55e]" />,
      title: "Music Taste",
      desc: "Match based on top artists and genres you actually listen to.",
      color: "border-[#22c55e]/20 hover:border-[#22c55e]/50 shadow-[#22c55e]/10"
    },
    {
      icon: <AnimeIcon className="w-8 h-8 md:w-10 md:h-10 text-[#ec4899]" />,
      title: "Anime Sync",
      desc: "Find watch buddies with compatible taste in anime genres.",
      color: "border-[#ec4899]/20 hover:border-[#ec4899]/50 shadow-[#ec4899]/10"
    },
    {
      icon: <MovieIcon className="w-8 h-8 md:w-10 md:h-10 text-[#ef4444]" />,
      title: "Movie Nights",
      desc: "Discover people who love the same movies and directors.",
      color: "border-[#ef4444]/20 hover:border-[#ef4444]/50 shadow-[#ef4444]/10"
    }
  ];

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white selection:bg-white selection:text-black overflow-x-hidden relative">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Navigation */}
      <header className="relative z-50 px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tighter">MATCHGAME</div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            LOGIN
          </Link>
          <Link href="/auth/register" className="px-5 py-2 rounded-full border border-white/20 text-sm font-medium hover:bg-white hover:text-black transition-all">
            JOIN NOW
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent to-white/50"
          />

          <h1 className="flex flex-col items-center leading-none tracking-tighter mb-8">
            <span className="text-[12vw] md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              CONNECT.
            </span>
            <span className="text-[12vw] md:text-[8rem] font-light italic text-white/80 -mt-[2vw] md:-mt-8 z-10">
              VIBE.
            </span>
            <span className="text-[12vw] md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 -mt-[2vw] md:-mt-8">
              MATCH.
            </span>
          </h1>

          <p className="max-w-md mx-auto text-gray-400 text-lg md:text-xl font-light mb-10 leading-relaxed">
            The ultimate matchmaking platform for gamers, audiophiles, and binge-watchers.
          </p>

          <Link href="/auth/register" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold tracking-wide hover:scale-105 transition-transform">
            <span>START YOUR JOURNEY</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-6 md:px-12 bg-[#0d0d0d]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border bg-[#141414] ${feature.color} transition-all hover:shadow-2xl hover:-translate-y-1 group cursor-default`}
              >
                <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300 origin-left">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <p className="text-sm text-gray-500 font-mono">
          © 2026 MATCHGAME. ALL RIGHTS RESERVED.
        </p>
      </footer>

    </main>
  );
}
