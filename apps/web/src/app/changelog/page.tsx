'use client';

import Link from 'next/link';

export default function ChangelogPage() {
    const versions = [
        {
            version: "v0.5.1",
            date: "16 de Fevereiro, 2026",
            tag: "UI/UX Polish",
            features: [
                "Redesign completo da Landing Page — paleta escura premium com gradientes animados, ícones de marca (Steam, Spotify, MAL, TMDB, Livros) e seções de Integrações, Como Funciona, Manifesto e CTA",
                "Redesign das páginas de Login e Registro — remoção de animações pesadas (StarField), paleta visual consistente com gradientes e glow effects",
                "Componentes de autenticação compartilhados (FormInput, GradientButton, ErrorMessage) para eliminar duplicação",
                "Redesign da página de Perfil — componente PosterCard unificado, badge 'Favorito' no item #1, layouts específicos por mídia",
                "Dashboard — status de integrações preciso com chamadas diretas às APIs, cálculo de progresso em 8 critérios (5 integrações + bio + localização + foto)",
                "Dashboard — card de estatísticas com contadores de favoritos por plataforma e total (X/25)",
                "Correção de bug: dados de perfil (bio, localização, foto) não apareciam no dashboard por erro de extração de dados",
                "Integração com Google Books adicionada ao perfil e dashboard",
                "Seção de citações inspiracionais nas páginas de autenticação (Carl Jung, C.S. Lewis)"
            ]
        },
        {
            version: "v0.5.0",
            date: "14 de Fevereiro, 2026",
            tag: "Beta Release",
            features: [
                "Lançamento Inicial do MVP",
                "Integração com Supabase (Banco de Dados + Storage)",
                "Upload de Fotos de Perfil (Hospedagem em Nuvem)",
                "Integração Steam (Biblioteca e Playtime)",
                "Integração Spotify (Top Artistas e Músicas)",
                "Edição Completa de Perfil",
                "Interface traduzida para Português (pt-BR)"
            ]
        },
        {
            version: "v0.4.0",
            date: "Janeiro 2026",
            tag: "Alpha",
            features: [
                "Migração para Banco de Dados na Nuvem",
                "Sistema de Chat em Tempo Real (Socket.io)",
                "Dashboard com Cards de Match",
                "Autenticação JWT Segura"
            ]
        },
        {
            version: "v0.3.0",
            date: "Dezembro 2025",
            tag: "Development",
            features: [
                "Integração Local com PostgreSQL",
                "Estrutura Inicial do Banco de Dados (Prisma)",
                "Configuração do Ambiente Monorepo (Turborepo)",
                "Componentes Base (Botões, Inputs, Modais)"
            ]
        },
        {
            version: "v0.2.0",
            date: "Novembro 2025",
            tag: "Concept",
            features: [
                "Prototipação das Telas de Match e Perfil",
                "Definição da Arquitetura do Backend",
                "Escolha das Tecnologias (Next.js, Node.js)"
            ]
        },
        {
            version: "v0.1.0",
            date: "Outubro 2025",
            tag: "Inception",
            features: [
                "Concepção da Ideia (Frustração com apps atuais)",
                "Levantamento de Requisitos",
                "Esqueleto Inicial do Site"
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white selection:bg-green-500 selection:text-white">
            <header className="px-6 md:px-12 py-6 border-b border-white/5">
                <Link href="/" className="text-xl font-bold tracking-tighter hover:text-gray-300 transition-colors">
                    MATCHGAME
                </Link>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold mb-2">Changelog</h1>
                <p className="text-gray-400 mb-12">Acompanhe a evolução do projeto.</p>

                <div className="space-y-12">
                    {versions.map((ver, i) => (
                        <div key={i} className="relative pl-8 border-l border-white/10">
                            {/* Dot */}
                            <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`} />

                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-2xl font-bold text-white">{ver.version}</h2>
                                <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300">
                                    {ver.tag}
                                </span>
                                <span className="text-sm text-gray-500 ml-auto">{ver.date}</span>
                            </div>

                            <ul className="space-y-4">
                                {ver.features.map((feat, j) => (
                                    <li key={j} className="text-gray-300 font-light flex items-start gap-4">
                                        <span className="mt-2 w-1 h-1 rounded-full bg-white/40 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5 text-center">
                    <h3 className="text-xl font-bold mb-2">O que vem por aí?</h3>
                    <p className="text-gray-400 mb-4">
                        Estamos trabalhando em recomendações por Inteligência Artificial e modos de jogo Co-op.
                    </p>
                    <a href="mailto:alexcristofari2@gmail.com" className="text-blue-400 hover:text-blue-300 hover:underline">
                        Tem uma sugestão? Mande um email!
                    </a>
                </div>
            </div>
        </main>
    );
}
