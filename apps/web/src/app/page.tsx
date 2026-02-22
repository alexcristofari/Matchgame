'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';

const BG = '#08090a';
const SURFACE = '#0f1011';
const BORDER = 'rgba(255,255,255,0.07)';
const T1 = '#f7f8f8';
const T2 = '#d0d6e0';
const T3 = '#6a737d';
const GRAD = 'linear-gradient(90deg, #ec4899, #f97316)';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});
const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease },
});

const LogoMark = ({ size = 20 }: { size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: GRAD, boxShadow: '0 0 12px rgba(236,72,153,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span style={{ color: '#fff', fontWeight: 700, fontSize: size * 0.55, lineHeight: 1 }}>M</span>
  </div>
);

/* grid lines SVG pattern */
const GridPattern = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}>
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

export default function Home() {
  return (
    <main style={{ backgroundColor: BG, color: T1, minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── Global ambient glow ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.06) 0%, rgba(249,115,22,0.03) 40%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── Navbar: Logo+Socials LEFT | Nav+Auth RIGHT ── */}
      <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, backgroundColor: 'rgba(8,9,10,0.85)', borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center' }}>

          {/* LEFT: Logo + Socials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <LogoMark size={22} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: T1, letterSpacing: '-0.01em' }}>MatchGame</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: `1px solid ${BORDER}` }} className="hidden md:flex">
              {[
                { icon: <FaEnvelope size={12} />, href: 'mailto:alexcristofari2@gmail.com', label: 'Email' },
                { icon: <FaLinkedin size={12} />, href: 'https://www.linkedin.com/in/alexsandercristofari/', label: 'LinkedIn' },
                { icon: <FaInstagram size={12} />, href: 'https://www.instagram.com/alex.cristofari/', label: 'Instagram' },
                { icon: <FaGithub size={12} />, href: 'https://github.com/alexcristofari', label: 'GitHub' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ color: T3, transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T2)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T3)}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* SPACER */}
          <div style={{ flex: 1 }} />

          {/* RIGHT: Nav links + Auth — all together */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">
            {[{ label: 'Sobre', href: '/about' }, { label: 'Versões', href: '/changelog' }].map((n) => (
              <Link key={n.href} href={n.href}
                style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: T3, textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = T1; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = T3; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {n.label}
              </Link>
            ))}

            {/* Divider */}
            <div style={{ width: '1px', height: '20px', backgroundColor: BORDER, margin: '0 8px' }} />

            <Link href="/auth/login"
              style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: T3, textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T1; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T3; e.currentTarget.style.backgroundColor = 'transparent'; }}>
              Entrar
            </Link>
            <Link href="/auth/register"
              style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', textDecoration: 'none', background: GRAD, boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)', marginLeft: '4px' }}>
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ──────────────────────────────────────
            HERO — Full visual, minimal text
        ────────────────────────────────────── */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

          {/* Grid lines */}
          <GridPattern />

          {/* Large orb left */}
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.40, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '5%', left: '-10%', width: '650px', height: '650px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%)', pointerEvents: 'none' }}
          />
          {/* Large orb right */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.30, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
            style={{ position: 'absolute', bottom: '0%', right: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 65%)', pointerEvents: 'none' }}
          />
          {/* Center soft glow */}
          <motion.div
            animate={{ opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(236,72,153,0.25) 0%, transparent 70%)', pointerEvents: 'none' }}
          />

          {/* Floating particles — possible people, possible connections
              Drift: slow (12-20s), large path (±100-300px)
              Pulse: heartbeat 72bpm = 0.83s period (scale+opacity) */}
          {[
            { x: '5%', y: '15%', s: 3, c: 'rgba(236,72,153,1)', drift: 14, dy: -240, dx: 80, d: 0.0 },
            { x: '12%', y: '40%', s: 2, c: 'rgba(249,115,22,1)', drift: 18, dy: -180, dx: -70, d: 0.28 },
            { x: '8%', y: '70%', s: 4, c: 'rgba(236,72,153,1)', drift: 16, dy: -280, dx: 110, d: 0.55 },
            { x: '18%', y: '88%', s: 2, c: 'rgba(249,115,22,1)', drift: 20, dy: -200, dx: -50, d: 0.12 },
            { x: '25%', y: '12%', s: 3, c: 'rgba(249,115,22,1)', drift: 13, dy: -160, dx: 90, d: 0.40 },
            { x: '32%', y: '55%', s: 2, c: 'rgba(236,72,153,1)', drift: 17, dy: -220, dx: -80, d: 0.68 },
            { x: '38%', y: '80%', s: 3, c: 'rgba(249,115,22,1)', drift: 15, dy: -260, dx: 60, d: 0.22 },
            { x: '44%', y: '25%', s: 2, c: 'rgba(236,72,153,1)', drift: 19, dy: -190, dx: -95, d: 0.50 },
            { x: '50%', y: '8%', s: 4, c: 'rgba(249,115,22,1)', drift: 12, dy: -300, dx: 40, d: 0.77 },
            { x: '56%', y: '62%', s: 2, c: 'rgba(236,72,153,1)', drift: 16, dy: -170, dx: -60, d: 0.05 },
            { x: '62%', y: '35%', s: 3, c: 'rgba(249,115,22,1)', drift: 20, dy: -250, dx: 75, d: 0.33 },
            { x: '68%', y: '78%', s: 2, c: 'rgba(236,72,153,1)', drift: 14, dy: -210, dx: -110, d: 0.61 },
            { x: '74%', y: '18%', s: 4, c: 'rgba(249,115,22,1)', drift: 18, dy: -290, dx: 55, d: 0.17 },
            { x: '80%', y: '50%', s: 2, c: 'rgba(236,72,153,1)', drift: 13, dy: -150, dx: -45, d: 0.44 },
            { x: '86%', y: '72%', s: 3, c: 'rgba(249,115,22,1)', drift: 17, dy: -230, dx: 95, d: 0.72 },
            { x: '92%', y: '30%', s: 2, c: 'rgba(236,72,153,1)', drift: 15, dy: -175, dx: -85, d: 0.08 },
            { x: '96%', y: '60%', s: 3, c: 'rgba(249,115,22,1)', drift: 19, dy: -265, dx: 35, d: 0.36 },
            { x: '15%', y: '55%', s: 2, c: 'rgba(236,72,153,1)', drift: 16, dy: -195, dx: 120, d: 0.64 },
            { x: '42%', y: '45%', s: 3, c: 'rgba(249,115,22,1)', drift: 14, dy: -245, dx: -90, d: 0.20 },
            { x: '58%', y: '90%', s: 2, c: 'rgba(236,72,153,1)', drift: 20, dy: -135, dx: 65, d: 0.48 },
            { x: '72%', y: '5%', s: 4, c: 'rgba(249,115,22,1)', drift: 12, dy: -310, dx: -55, d: 0.75 },
            { x: '88%', y: '85%', s: 2, c: 'rgba(236,72,153,1)', drift: 18, dy: -155, dx: 80, d: 0.03 },
            { x: '3%', y: '35%', s: 3, c: 'rgba(249,115,22,1)', drift: 15, dy: -215, dx: -40, d: 0.31 },
            { x: '28%', y: '20%', s: 2, c: 'rgba(236,72,153,1)', drift: 17, dy: -270, dx: 100, d: 0.58 },
            { x: '48%', y: '75%', s: 3, c: 'rgba(249,115,22,1)', drift: 13, dy: -185, dx: -75, d: 0.14 },
            { x: '65%', y: '48%', s: 2, c: 'rgba(236,72,153,1)', drift: 19, dy: -235, dx: 55, d: 0.42 },
            { x: '78%', y: '92%', s: 4, c: 'rgba(249,115,22,1)', drift: 16, dy: -145, dx: -105, d: 0.69 },
            { x: '35%', y: '65%', s: 2, c: 'rgba(236,72,153,1)', drift: 14, dy: -205, dx: 45, d: 0.25 },
            { x: '54%', y: '30%', s: 3, c: 'rgba(249,115,22,1)', drift: 20, dy: -255, dx: -60, d: 0.53 },
            { x: '82%', y: '15%', s: 2, c: 'rgba(236,72,153,1)', drift: 15, dy: -180, dx: 85, d: 0.80 },
          ].map((p, i) => (
            /* Outer: slow, wide drift */
            <motion.div key={i}
              animate={{
                y: [0, p.dy * 0.4, p.dy * 0.8, p.dy * 0.55, p.dy, p.dy * 0.7, 0],
                x: [0, p.dx * 0.3, p.dx * 0.7, p.dx * 0.45, p.dx, p.dx * 0.6, 0],
              }}
              transition={{ duration: p.drift, repeat: Infinity, ease: 'easeInOut', delay: p.d }}
              style={{ position: 'absolute', left: p.x, top: p.y, pointerEvents: 'none' }}
            >
              {/* Inner: heartbeat pulse — 72bpm ≈ 0.83s */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1.05, 1],
                  opacity: [0.25, 0.85, 0.5, 0.25],
                }}
                transition={{ duration: 0.83, repeat: Infinity, ease: 'easeInOut', delay: p.d % 0.83 }}
                style={{ width: p.s, height: p.s, borderRadius: '50%', backgroundColor: p.c, filter: 'blur(0.4px)' }}
              />
            </motion.div>
          ))}

          {/* Ring decorations */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', border: '1px solid rgba(236,72,153,0.06)', borderRadius: '50%', pointerEvents: 'none' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', border: '1px solid rgba(249,115,22,0.05)', borderRadius: '50%', pointerEvents: 'none' }}
          />

          {/* Hero text */}
          <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
            <motion.h1 {...fadeUp(0.05)} style={{ fontSize: 'clamp(56px, 9vw, 108px)', fontWeight: 600, lineHeight: 1.02, letterSpacing: '-0.045em', color: T1, marginBottom: '28px' }}>
              Conexões reais<br />
              através do{' '}
              <span style={{ backgroundImage: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                seu gosto.
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.18)} style={{ fontSize: '20px', lineHeight: 1.75, color: T2, maxWidth: '520px', margin: '0 auto 48px', fontWeight: 300 }}>
              Jogos, músicas, filmes, animes e livros —<br />
              encontre quem vibra na mesma frequência.
            </motion.p>


          </div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.25))' }} />
          </motion.div>

          {/* Bottom gradient fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px', background: `linear-gradient(to top, ${BG}, transparent)`, pointerEvents: 'none' }} />
        </section>

        {/* ── Scrolled content ── */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ height: '1px', backgroundColor: BORDER }} />

          {/* Integrações */}
          <section style={{ padding: '96px 0' }}>
            <motion.div {...fadeUpView()}>
              <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T3, marginBottom: '16px' }}>Integrações</p>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: T1, marginBottom: '12px' }}>Cinco dimensões. Uma essência.</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.75, color: T3, maxWidth: '480px', marginBottom: '56px' }}>
                Cada plataforma revela uma faceta diferente de quem você é. Juntas, formam o retrato que usamos para encontrar quem realmente combina.
              </p>
            </motion.div>
            <div>
              {[
                { name: 'Steam', color: '#a78bfa', desc: 'Sua biblioteca e horas jogadas definem seu perfil. Do competitivo ao cozy game, encontramos quem joga o que você joga.' },
                { name: 'Spotify', color: '#4ade80', desc: 'A trilha sonora da sua vida diz muito sobre sua alma. Conecte-se com quem vibra na mesma frequência musical.' },
                { name: 'MyAnimeList', color: '#f472b6', desc: 'Seus animes e notas revelam sua visão de mundo. Encontre alguém que entenda suas referências mais obscuras.' },
                { name: 'TMDB', color: '#f87171', desc: 'Filmes e séries moldam nossas narrativas. Compartilhe o que ama com quem sabe apreciar um bom roteiro.' },
                { name: 'Livros', color: '#fbbf24', desc: 'As páginas que você leu construíram quem você é. Leitores se reconhecem em cada parágrafo.' },
              ].map((item, i) => (
                <motion.div key={item.name} {...fadeUpView(i * 0.06)}
                  style={{ display: 'flex', alignItems: 'baseline', gap: '24px', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: item.color, width: '120px', flexShrink: 0 }}>{item.name}</span>
                  <p style={{ fontSize: '15px', lineHeight: 1.8, color: T3, flex: 1, textAlign: 'justify', margin: 0 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <div style={{ height: '1px', backgroundColor: BORDER }} />

          {/* Como funciona */}
          <section style={{ padding: '96px 0' }}>
            <motion.div {...fadeUpView()}>
              <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T3, marginBottom: '16px' }}>Como funciona</p>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: T1, marginBottom: '56px' }}>Simples por design.</h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {[
                { num: '01', title: 'Conecte', text: 'Vincule suas contas. Rápido e seguro — seus dados existem apenas para calcular compatibilidade real.' },
                { num: '02', title: 'Descubra', text: 'Nosso algoritmo cruza bibliotecas, artistas e gêneros para encontrar quem pensa e sente parecido com você.' },
                { num: '03', title: 'Converse', text: 'Dê match e inicie uma conversa que já tem conteúdo. Fale sobre o que importa desde o primeiro momento.' },
              ].map((step, i) => (
                <motion.div key={step.num} {...fadeUpView(i * 0.1)}
                  style={{ padding: '24px', borderRadius: '12px', backgroundColor: SURFACE, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3a3a45' }}>{step.num}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: T1, letterSpacing: '-0.01em', margin: 0 }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.75, color: T3, margin: 0 }}>{step.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <div style={{ height: '1px', backgroundColor: BORDER }} />

          {/* Manifesto */}
          <section style={{ padding: '96px 0' }}>
            <motion.div {...fadeUpView()}>
              <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T3, marginBottom: '16px' }}>Manifesto</p>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: T1, marginBottom: '48px' }}>
                Pessoas. Sentimentos.<br />Conexões de verdade.
              </h2>
            </motion.div>
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {[
                'Acreditamos que as melhores relações nascem de afinidades reais. Quando você descobre alguém que chorou no mesmo final de anime, que ouve as mesmas músicas às três da manhã — algo genuíno acontece. Uma faísca que nenhum algoritmo de aparência é capaz de criar.',
                'O MatchGame nasceu da frustração com plataformas que julgam por foto de perfil. Aqui, sua essência vem primeiro. Seus gostos, suas paixões, seu universo cultural — isso é o que te conecta com pessoas que realmente entendem quem você é.',
                'Construímos para quem sente profundamente. Para quem se apega a personagens de ficção, tem uma playlist pra cada humor, debate teorias e recomenda filmes com paixão.',
              ].map((p, i) => (
                <motion.p key={i} {...fadeUpView(i * 0.1)}
                  style={{ fontSize: '17px', lineHeight: 1.85, color: T2, margin: 0, textAlign: 'justify', fontWeight: 300 }}>
                  {p}
                </motion.p>
              ))}
              <motion.blockquote {...fadeUpView(0.35)}
                style={{ margin: '12px 0 0', paddingLeft: '20px', borderLeft: '2px solid rgba(236,72,153,0.4)' }}>
                <p style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: 1.7, color: T2, margin: 0 }}>
                  &ldquo;Se você se reconhece nisso — este lugar foi feito para você.&rdquo;
                </p>
              </motion.blockquote>
            </div>
          </section>

        </div>

        {/* CTA */}
        <section style={{ borderTop: `1px solid ${BORDER}`, padding: '80px 24px', textAlign: 'center' }}>
          <motion.div {...fadeUpView()} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.02em', color: T1, marginBottom: '12px' }}>Pronto para começar?</h2>
            <p style={{ fontSize: '15px', color: T3, marginBottom: '36px', lineHeight: 1.6 }}>Gratuito. Sem anúncios. Feito com cuidado.</p>
            <Link href="/auth/register"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#fff', textDecoration: 'none', background: GRAD, boxShadow: '0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(236,72,153,0.2)' }}>
              Criar Conta Grátis <span style={{ color: '#fda4af' }}>→</span>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, padding: '32px 32px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogoMark size={16} />
              <span style={{ fontSize: '12px', color: '#3a3a45', fontWeight: 500 }}>MatchGame © 2026</span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[{ label: 'Sobre', href: '/about' }, { label: 'Versões', href: '/changelog' }, { label: 'Contato', href: 'mailto:alexcristofari2@gmail.com' }].map((l) => (
                <Link key={l.label} href={l.href}
                  style={{ fontSize: '12px', color: '#3a3a45', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T3)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a45')}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
