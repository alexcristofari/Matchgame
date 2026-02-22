'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const BG = '#08090a';
const SURFACE = '#0f1011';
const BORDER = 'rgba(255,255,255,0.07)';
const T1 = '#f7f8f8';
const T2 = '#d0d6e0';
const T3 = '#6a737d';
const GRAD = 'linear-gradient(90deg, #ec4899, #f97316)';

const LogoMark = ({ size = 20 }: { size?: number }) => (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: GRAD, boxShadow: '0 0 10px rgba(236,72,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: size * 0.55, lineHeight: 1 }}>M</span>
    </div>
);

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease },
});

export default function ChangelogPage() {
    const versions = [
        {
            version: 'v0.5.2',
            date: '21 de Fevereiro, 2026',
            tag: 'Design System',
            latest: true,
            features: [
                'Design System unificado — paleta Linear-inspired (#08090a background, gradiente pink→orange #ec4899→#f97316) aplicada em todas as páginas',
                'Homepage reformulada: hero imersivo com orbs, grid, partículas flutuantes e anéis rotativos; badge de badge inicial removido; headline maior',
                'Navbar reposicionada: LogoMark "M" gradient + ícones sociais fixos à esquerda; Nav links + Auth todos agrupados à direita',
                '/about e /changelog migrados para o novo Design System com LogoMark, gradiente e tipografia unificados',
                'v0.5.2 adicionada ao Changelog documentando as mudanças de design',
            ],
        },
        {
            version: 'v0.5.1',
            date: '16 de Fevereiro, 2026',
            tag: 'UI/UX Polish',
            latest: false,
            features: [
                'Redesign completo da Landing Page — paleta escura premium com gradientes animados, ícones de marca (Steam, Spotify, MAL, TMDB, Livros) e seções de Integrações, Como Funciona, Manifesto e CTA',
                'Redesign das páginas de Login e Registro — remoção de animações pesadas (StarField), paleta visual consistente com gradientes e glow effects',
                'Componentes de autenticação compartilhados (FormInput, GradientButton, ErrorMessage) para eliminar duplicação',
                'Redesign da página de Perfil — componente PosterCard unificado, badge "Favorito" no item #1, layouts específicos por mídia',
                'Dashboard — status de integrações preciso com chamadas diretas às APIs, cálculo de progresso em 8 critérios (5 integrações + bio + localização + foto)',
                'Dashboard — card de estatísticas com contadores de favoritos por plataforma e total (X/25)',
                'Correção de bug: dados de perfil (bio, localização, foto) não apareciam no dashboard por erro de extração de dados',
                'Integração com Google Books adicionada ao perfil e dashboard',
                'Seção de citações inspiracionais nas páginas de autenticação (Carl Jung, C.S. Lewis)',
            ],
        },
        {
            version: 'v0.5.0',
            date: '14 de Fevereiro, 2026',
            tag: 'Beta Release',
            latest: false,
            features: [
                'Lançamento Inicial do MVP',
                'Integração com Supabase (Banco de Dados + Storage)',
                'Upload de Fotos de Perfil (Hospedagem em Nuvem)',
                'Integração Steam (Biblioteca e Playtime)',
                'Integração Spotify (Top Artistas e Músicas)',
                'Edição Completa de Perfil',
                'Interface traduzida para Português (pt-BR)',
            ],
        },
        {
            version: 'v0.4.0',
            date: 'Janeiro 2026',
            tag: 'Alpha',
            latest: false,
            features: [
                'Migração para Banco de Dados na Nuvem',
                'Sistema de Chat em Tempo Real (Socket.io)',
                'Dashboard com Cards de Match',
                'Autenticação JWT Segura',
            ],
        },
        {
            version: 'v0.3.0',
            date: 'Dezembro 2025',
            tag: 'Development',
            latest: false,
            features: [
                'Integração Local com PostgreSQL',
                'Estrutura Inicial do Banco de Dados (Prisma)',
                'Configuração do Ambiente Monorepo (Turborepo)',
                'Componentes Base (Botões, Inputs, Modais)',
            ],
        },
        {
            version: 'v0.2.0',
            date: 'Novembro 2025',
            tag: 'Concept',
            latest: false,
            features: [
                'Prototipação das Telas de Match e Perfil',
                'Definição da Arquitetura do Backend',
                'Escolha das Tecnologias (Next.js, Node.js)',
            ],
        },
        {
            version: 'v0.1.0',
            date: 'Outubro 2025',
            tag: 'Inception',
            latest: false,
            features: [
                'Concepção da Ideia (Frustração com apps atuais)',
                'Levantamento de Requisitos',
                'Esqueleto Inicial do Site',
            ],
        },
    ];

    return (
        <main style={{ backgroundColor: BG, color: T1, minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

            {/* Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(8,9,10,0.85)', borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <LogoMark size={22} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: T1, letterSpacing: '-0.01em' }}>MatchGame</span>
                    </Link>
                    <Link href="/auth/register"
                        style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', textDecoration: 'none', background: GRAD }}>
                        Criar Conta
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px 120px' }}>

                <motion.div {...fadeUp()} style={{ marginBottom: '64px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T3, marginBottom: '16px' }}>Histórico de Versões</p>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, color: T1, marginBottom: '12px' }}>Changelog</h1>
                    <p style={{ fontSize: '16px', color: T3, lineHeight: 1.6, margin: 0 }}>Acompanhe a evolução do projeto.</p>
                </motion.div>

                {/* Timeline */}
                <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: `1px solid ${BORDER}` }}>
                    {versions.map((ver, i) => (
                        <motion.div key={i} {...fadeUp(i * 0.05)}
                            style={{ position: 'relative', marginBottom: i < versions.length - 1 ? '56px' : 0 }}>

                            {/* Dot */}
                            <div style={{ position: 'absolute', left: '-35px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: ver.latest ? GRAD : SURFACE, border: `2px solid ${ver.latest ? 'rgba(236,72,153,0.5)' : BORDER}`, boxShadow: ver.latest ? '0 0 12px rgba(236,72,153,0.4)' : 'none' }} />

                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 700, color: T1, letterSpacing: '-0.02em', margin: 0 }}>{ver.version}</h2>
                                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', backgroundColor: ver.latest ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.05)', color: ver.latest ? '#f9a8d4' : T3, border: `1px solid ${ver.latest ? 'rgba(236,72,153,0.25)' : BORDER}` }}>
                                    {ver.tag}
                                </span>
                                <span style={{ fontSize: '12px', color: T3, marginLeft: 'auto' }}>{ver.date}</span>
                            </div>

                            {/* Features */}
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {ver.features.map((feat, j) => (
                                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: 1.7, color: T2, fontWeight: 300 }}>
                                        <span style={{ marginTop: '8px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* What's next */}
                <motion.div {...fadeUp(0.1)}
                    style={{ marginTop: '80px', padding: '32px', borderRadius: '14px', backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: T1, marginBottom: '10px', letterSpacing: '-0.01em' }}>O que vem por aí?</h3>
                    <p style={{ fontSize: '14px', color: T3, lineHeight: 1.7, margin: '0 0 16px' }}>
                        Algoritmo de matching por IA, notificações push, perfis públicos compartilháveis e integração OAuth com Spotify e Steam.
                    </p>
                    <a href="mailto:alexcristofari2@gmail.com"
                        style={{ fontSize: '13px', fontWeight: 500, backgroundImage: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textDecoration: 'none' }}>
                        Tem uma sugestão? Me manda um email →
                    </a>
                </motion.div>
            </div>
        </main>
    );
}
