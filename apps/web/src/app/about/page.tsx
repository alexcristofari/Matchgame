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

export default function AboutPage() {
    return (
        <main style={{ backgroundColor: BG, color: T1, minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-5%', left: '30%', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(236,72,153,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
            </div>

            {/* Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(8,9,10,0.85)', borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <LogoMark size={22} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: T1, letterSpacing: '-0.01em' }}>MatchGame</span>
                    </Link>
                    <Link href="/auth/register"
                        style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', textDecoration: 'none', background: GRAD, boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        Criar Conta
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto', padding: '80px 24px 120px' }}>

                {/* Opening */}
                <motion.div {...fadeUp()} style={{ marginBottom: '80px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T3, marginBottom: '20px' }}>Sobre o projeto</p>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '40px', color: T1 }}>
                        Por que o{' '}
                        <span style={{ backgroundImage: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MatchGame</span>{' '}
                        existe.
                    </h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[
                            'Eu sempre fui aquela pessoa que prefere ficar em casa. Não por preguiça, não por tristeza — mas porque é ali, de frente pra tela, que eu me sinto mais vivo. Nos mundos que exploro, nas músicas que descubro sozinho às três da manhã, nos animes que me fazem chorar escondido, nos filmes que eu reassisto só pra sentir de novo.',
                            'E por muito tempo eu achei que isso era um problema. Que eu deveria sair mais, ir em festas, puxar conversa com desconhecidos num bar. Mas a verdade é que eu nunca encontrei ninguém nesses lugares que entendesse as coisas que me movem.',
                        ].map((p, i) => (
                            <p key={i} style={{ fontSize: '17px', lineHeight: 1.85, color: T2, margin: 0, textAlign: 'justify', fontWeight: 300 }}>{p}</p>
                        ))}
                    </div>
                </motion.div>

                {/* Sections */}
                {[
                    {
                        label: 'O problema',
                        title: 'O problema que ninguém fala',
                        color: 'rgba(167,139,250,0.5)',
                        paragraphs: [
                            'A gente vive na era mais conectada da história e, mesmo assim, a solidão nunca foi tão grande. Passamos horas jogando, ouvindo, assistindo, lendo — consumindo conteúdo que forma quem somos. Mas quando olhamos ao redor, percebemos que as pessoas à nossa volta não conhecem nada disso.',
                            'E não é culpa de ninguém. É que essas pessoas simplesmente não estão nos mesmos lugares que a gente. Elas estão em outro quarto, em outra cidade, de frente pra outra tela — sentindo exatamente a mesma coisa. Achando que são as únicas.',
                            'A pessoa que combina contigo provavelmente também não sai de casa.',
                        ],
                        italic: [2],
                    },
                    {
                        label: 'A ideia',
                        title: 'A faísca',
                        color: 'rgba(236,72,153,0.5)',
                        paragraphs: [
                            'O MatchGame nasceu num daqueles momentos em que você tá navegando num app de relacionamento e percebe o quão vazio tudo aquilo é. Fotos bonitas, bios genéricas, conversas que morrem no "oi, tudo bem?". Nenhuma faísca.',
                            'Aí eu pensei: e se, em vez de julgar alguém por uma foto, eu pudesse ver que essa pessoa tem 800 horas no mesmo jogo que eu? Que ela ouve os mesmos artistas obscuros? Que assistiu os mesmos animes que me marcaram?',
                            'De repente, o "oi, tudo bem?" vira "cara, você também zerou Hollow Knight três vezes?". A conversa começa diferente porque a conexão já existe antes mesmo da primeira mensagem.',
                        ],
                    },
                    {
                        label: 'O que somos',
                        title: 'Mais que romance — pertencimento',
                        color: 'rgba(74,222,128,0.5)',
                        paragraphs: [
                            'O MatchGame não é um app de namoro. Pode ser, se rolar. Mas o que a gente quer de verdade é algo mais raro: pertencimento. Aquela sensação de encontrar alguém e pensar "finalmente, alguém que entende".',
                            'Queremos que você encontre o duo perfeito pra subir de ranqueada. O amigo pra fechar o squad no fim de semana. Alguém pra ir naquele show da banda desconhecida que só vocês dois amam.',
                            'Muitas pessoas incríveis são introvertidas. Elas não vão aparecer num bar, numa festa. Mas elas estão aqui. E elas estão procurando por alguém exatamente como você.',
                        ],
                    },
                    {
                        label: 'Os dados',
                        title: 'Seus dados, sua verdade',
                        color: 'rgba(249,115,22,0.5)',
                        paragraphs: [
                            'Em outros apps, você escreve o que quer que as pessoas pensem sobre você. Aqui, você mostra quem você realmente é.',
                            'Ao conectar suas contas — Steam, Spotify, MyAnimeList, TMDB, Google Books — você traz dados reais do seu comportamento. Se você tem 2.000 horas de Skyrim, isso diz algo sobre sua paciência e amor por imersão. Se seu Spotify é recheado de indie rock dos anos 2000, já cria um tópico de conversa instantâneo.',
                            'Eliminamos o "oi, tudo bem?" genérico e pulamos direto para "você viu que saiu a DLC nova?". Porque é daí que começa tudo de verdade.',
                        ],
                    },
                    {
                        label: 'Para quem',
                        title: 'Para quem é isso',
                        color: 'rgba(251,191,36,0.5)',
                        paragraphs: [
                            'Pra quem passa mais tempo em mundos virtuais do que no mundo lá fora — e não vê problema nenhum nisso. Pra quem já tentou explicar por que um jogo fez chorar e recebeu um olhar estranho de volta.',
                            'Pra quem sente que existe alguém por aí — alguém que pensa parecido, que sente parecido, que se emociona com as mesmas coisas — mas simplesmente nunca encontrou. Porque essa pessoa também está em casa. Também está procurando.',
                        ],
                    },
                ].map((section, si) => (
                    <motion.div key={si} {...fadeUp(0.05 * si)} style={{ marginBottom: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: section.color }} />
                            <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T3, margin: 0 }}>{section.label}</p>
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.015em', color: T1, marginBottom: '24px' }}>{section.title}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {section.paragraphs.map((p, pi) => (
                                <p key={pi} style={{ fontSize: '16px', lineHeight: 1.85, color: section.italic?.includes(pi) ? T3 : T2, margin: 0, textAlign: 'justify', fontWeight: 300, fontStyle: section.italic?.includes(pi) ? 'italic' : 'normal' }}>{p}</p>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* Nietzsche quote */}
                <motion.div {...fadeUp(0.1)}
                    style={{ padding: '48px 0', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, textAlign: 'center', marginBottom: '64px' }}>
                    <blockquote style={{ fontSize: '20px', fontStyle: 'italic', color: T2, lineHeight: 1.7, fontWeight: 300, margin: '0 0 16px' }}>
                        &ldquo;Detesto quem rouba minha solidão sem, em troca, me oferecer verdadeira companhia.&rdquo;
                    </blockquote>
                    <cite style={{ fontSize: '12px', color: T3, letterSpacing: '0.12em', textTransform: 'uppercase', fontStyle: 'normal' }}>— F. Nietzsche</cite>
                </motion.div>

                {/* CTA */}
                <motion.div {...fadeUp(0.1)} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: T3, marginBottom: '28px', lineHeight: 1.6 }}>
                        Se você se reconheceu em algo que leu aqui — esse lugar foi feito pra você.
                    </p>
                    <Link href="/auth/register"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#fff', textDecoration: 'none', background: GRAD, boxShadow: '0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(236,72,153,0.2)' }}>
                        Começar minha jornada <span style={{ color: '#fda4af' }}>→</span>
                    </Link>
                </motion.div>

            </div>
        </main>
    );
}
