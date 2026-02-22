'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060606] text-gray-200 selection:bg-pink-500/30 selection:text-white overflow-x-hidden font-sans">

      {/* ── Animated Background (Visible mostly in Hero) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#060606]" />
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-pink-900/15 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[100px]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* ── Nav (Restored Full) ── */}
      <header className="fixed top-0 w-full z-50 bg-[#060606]/60 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group">
              <span className="text-sm font-bold tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">MATCHGAME</span>
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-white/[0.06] hidden md:flex">
              <a href="mailto:alexcristofari2@gmail.com" className="text-gray-500 hover:text-white transition-colors text-sm"><FaEnvelope /></a>
              <a href="https://www.linkedin.com/in/alexsandercristofari/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm"><FaLinkedin /></a>
              <a href="https://www.instagram.com/alex.cristofari/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm"><FaInstagram /></a>
              <a href="https://github.com/alexcristofari" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm"><FaGithub /></a>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-xs font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
              Sobre
            </Link>
            <Link href="/changelog" className="text-xs font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
              Versões
            </Link>
            <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block" />
            <Link href="/auth/login" className="text-xs font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
              Entrar
            </Link>
            <Link href="/auth/register" className="px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Criar Conta
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <div className="relative z-10 w-full">

        {/* ── Hero (Chapter 1: Modern & Flashy) ── */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8 inline-block"
            >
              <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] uppercase tracking-[0.3em] text-pink-200/80 font-semibold shadow-lg shadow-pink-500/10">
                Capítulo I • A Conexão
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-9xl font-light tracking-tighter leading-[0.95] mb-8 text-white mix-blend-overlay">
              CONEXÕES<br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                REAIS.
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-xl md:text-2xl font-light leading-relaxed text-gray-300/90 mb-12"
            >
              Sua <span className="text-pink-400 font-medium">playlist</span>, seus <span className="text-purple-400 font-medium">jogos</span>, seus <span className="text-amber-400 font-medium">livros</span>.<br />
              O algoritmo que encontra quem vibes na mesma frequência.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/auth/register" className="group relative px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase overflow-hidden bg-white text-black hover:scale-105 transition-transform duration-300">
                <span className="relative z-10">Criar Perfil Grátis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 opacity-0 group-hover:opacity-30 transition-opacity" />
              </Link>
              <Link href="/about" className="text-sm font-medium tracking-widest uppercase text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                Ler Manifesto <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Decorative Elements */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060606] to-transparent z-10" />
        </section>


        {/* ── Content Wrapper (Chapter 2+: Minimalist Book-like) ── */}
        <div className="max-w-4xl mx-auto px-6 pb-32">

          {/* ── Integrações ── */}
          <section className="mb-40 pt-20 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium opacity-70">
                Capítulo II • Dimensões
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-16 text-white/90">
              Cinco dimensões.<br />Uma essência.
            </h2>

            <div className="space-y-16">
              {[
                {
                  name: 'Steam',
                  desc: 'Sua biblioteca e horas jogadas definem seu perfil de jogador. Do competitivo ao cozy game, encontramos quem joga o que você joga.',
                  color: 'text-purple-400',
                },
                {
                  name: 'Spotify',
                  desc: 'A trilha sonora da sua vida diz muito sobre sua alma. Conecte-se com quem vibra na mesma frequência musical.',
                  color: 'text-green-400',
                },
                {
                  name: 'MyAnimeList',
                  desc: 'Seus animes favoritos e notas revelam sua visão de mundo. Encontre alguém que entenda suas referências mais obscuras.',
                  color: 'text-pink-400',
                },
                {
                  name: 'TMDB',
                  desc: 'Filmes e séries moldam nossas narrativas. Compartilhe suas histórias favoritas com quem sabe apreciar um bom roteiro.',
                  color: 'text-red-400',
                },
                {
                  name: 'Livros',
                  desc: 'As páginas que você leu construíram quem você é. Leitores se reconhecem em cada parágrafo.',
                  color: 'text-amber-400',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="group pl-8 border-l border-white/10 hover:border-white/30 transition-colors"
                >
                  <div className="flex flex-col gap-4">
                    <h3 className={`text-xl font-medium ${item.color} tracking-wide`}>{item.name}</h3>
                    <p className="text-gray-400 text-lg font-light leading-relaxed text-justify group-hover:text-gray-300 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Como funciona ── */}
          <section className="mb-40 pt-20 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium opacity-70">
                Capítulo III • Simplificação
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-16 text-white/90">
              Três passos.<br />Zero complicação.
            </h2>

            <div className="space-y-20">
              {[
                {
                  num: 'I',
                  title: 'Conecte',
                  text: 'Vincule suas contas favoritas. O processo é rápido e seguro. Usamos seus dados apenas para calcular a compatibilidade real.',
                },
                {
                  num: 'II',
                  title: 'Descubra',
                  text: 'Nosso algoritmo analisa os dados. Cruzamos bibliotecas, artistas e gêneros para encontrar quem tem o gosto mais parecido com o seu.',
                },
                {
                  num: 'III',
                  title: 'Converse',
                  text: 'Dê match e inicie uma conversa que já começa com conteúdo. Nada de "oi, tudo bem?". Fale sobre o que importa.',
                },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="relative"
                >
                  <span className="absolute -left-12 -top-8 text-8xl font-serif text-white/[0.03] select-none">{step.num}</span>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-medium mb-4 text-white tracking-wide">{step.title}</h3>
                    <p className="text-gray-400 text-lg font-light leading-relaxed text-justify">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Manifesto ── */}
          <section className="mb-32 pt-20 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium opacity-70">
                Epílogo • Sentimento
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-16 text-white/90">
              Pessoas. Sentimentos.<br />
              Conexões de verdade.
            </h2>

            <div className="space-y-10 text-xl font-light leading-[1.8] text-gray-300 text-justify">
              <p>
                Acreditamos que as melhores relações nascem de afinidades reais. Quando você
                descobre alguém que chorou no mesmo final de anime, que ouve as mesmas músicas
                às três da manhã, ou que zera os mesmos jogos no hardest — algo genuíno acontece.
              </p>
              <p>
                O MatchGame nasceu da frustração com plataformas que julgam por foto de perfil.
                Aqui, sua essência vem primeiro. Seus gostos, suas paixões, seu universo cultural —
                isso é o que te conecta com pessoas que realmente entendem quem você é.
              </p>
              <div className="py-10 flex justify-center">
                <p className="text-2xl italic text-white/80 font-serif text-center max-w-2xl">
                  &ldquo;Não queremos likes vazios. Queremos aquela sensação de 'nossa, você também ama isso?'.&rdquo;
                </p>
              </div>
              <p>
                Se você se reconhece nisso — este lugar foi feito para você.
              </p>
            </div>

            <div className="mt-24 text-center">
              <Link href="/auth/register" className="inline-block px-12 py-5 bg-white text-black font-bold text-xs tracking-[0.25em] uppercase hover:bg-gray-200 transition-colors shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] duration-500">
                Iniciar Jornada
              </Link>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="pt-20 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-gray-600">
            <p>MatchGame © 2026</p>
            <div className="flex gap-6">
              <a href="mailto:alexcristofari2@gmail.com" className="hover:text-white transition-colors">Contato</a>
              <a href="https://github.com/alexcristofari" target="_blank" className="hover:text-white transition-colors">Github</a>
              <a href="https://linkedin.com/in/alexsandercristofari" target="_blank" className="hover:text-white transition-colors">Linkedin</a>
            </div>
          </footer>

        </div>

      </div>
    </main>
  );
}
