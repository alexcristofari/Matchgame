'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#060606] text-white selection:bg-pink-500 selection:text-white">

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[120px]"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-pink-900/10 blur-[120px]"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 md:px-12 py-6 border-b border-white/[0.04]">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-sm font-bold tracking-[0.2em] text-white/70 hover:text-white transition-colors">
                        MATCHGAME
                    </Link>
                    <Link href="/auth/register" className="text-xs text-gray-500 hover:text-white transition-colors tracking-widest uppercase">
                        Criar conta
                    </Link>
                </div>
            </header>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* ── Opening ── */}
                    <div className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-8 bg-gradient-to-r from-pink-500 to-transparent" />
                            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Sobre o projeto</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-12 leading-tight">
                            Por que o{' '}
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">MatchGame</span>{' '}
                            existe.
                        </h1>

                        <div className="space-y-6 text-gray-300 text-lg font-light leading-[1.9] text-justify">
                            <p>
                                Eu sempre fui aquela pessoa que prefere ficar em casa. Não por preguiça, não por tristeza —
                                mas porque é ali, de frente pra tela, que eu me sinto mais vivo. Nos mundos que exploro,
                                nas músicas que descubro sozinho às três da manhã, nos animes que me fazem chorar escondido,
                                nos filmes que eu reassisto só pra sentir de novo.
                            </p>
                            <p>
                                E por muito tempo eu achei que isso era um problema. Que eu deveria sair mais, ir em festas,
                                puxar conversa com desconhecidos num bar. Mas a verdade é que eu nunca encontrei ninguém
                                nesses lugares que entendesse as coisas que me movem. Ninguém que tivesse perdido uma noite
                                de sono por causa de uma side quest. Ninguém que soubesse a sensação de descobrir uma banda
                                perfeita que ninguém mais conhece.
                            </p>
                        </div>
                    </div>

                    {/* ── O Conflito ── */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-mono uppercase tracking-widest text-white mb-8 border-l-2 border-purple-500/40 pl-4">
                            O problema que ninguém fala
                        </h2>

                        <div className="space-y-6 text-gray-400 text-lg font-light leading-[1.9] text-justify">
                            <p>
                                A gente vive na era mais conectada da história e, mesmo assim, a solidão nunca foi tão grande.
                                Passamos horas jogando, ouvindo, assistindo, lendo — consumindo conteúdo que forma quem somos.
                                Mas quando olhamos ao redor, percebemos que as pessoas à nossa volta não conhecem nada disso.
                                Não sabem o que é ficar obcecado com a lore de um jogo. Não entendem por que você ouve
                                a mesma música vinte vezes seguidas. Não sentiram o que você sentiu ao terminar aquele anime.
                            </p>
                            <p>
                                E não é culpa de ninguém. É que essas pessoas simplesmente não estão nos mesmos lugares
                                que a gente. Elas estão em outro quarto, em outra cidade, de frente pra outra tela —
                                sentindo exatamente a mesma coisa. Achando que são as únicas.
                            </p>
                            <p className="text-gray-500 italic">
                                A pessoa que combina contigo provavelmente também não sai de casa.
                            </p>
                        </div>
                    </div>

                    {/* ── A Ideia ── */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-mono uppercase tracking-widest text-white mb-8 border-l-2 border-pink-500/40 pl-4">
                            A faísca
                        </h2>

                        <div className="space-y-6 text-gray-400 text-lg font-light leading-[1.9] text-justify">
                            <p>
                                O MatchGame nasceu num daqueles momentos em que você tá navegando num app de relacionamento
                                e percebe o quão vazio tudo aquilo é. Fotos bonitas, bios genéricas, conversas que morrem no
                                &ldquo;oi, tudo bem?&rdquo;. Nenhum contexto. Nenhuma profundidade. Nenhuma faísca.
                            </p>
                            <p>
                                Aí eu pensei: e se, em vez de julgar alguém por uma foto, eu pudesse ver que essa pessoa
                                tem 800 horas no mesmo jogo que eu? Que ela ouve os mesmos artistas obscuros?
                                Que assistiu os mesmos animes que me marcaram? Que leu os mesmos livros que mudaram
                                minha forma de pensar?
                            </p>
                            <p>
                                De repente, o &ldquo;oi, tudo bem?&rdquo; vira &ldquo;cara, você também zerou Hollow Knight
                                três vezes?&rdquo;. A conversa começa diferente porque a conexão já existe antes mesmo
                                da primeira mensagem.
                            </p>
                        </div>
                    </div>

                    {/* ── O que somos ── */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-mono uppercase tracking-widest text-white mb-8 border-l-2 border-green-500/40 pl-4">
                            Mais que romance — pertencimento
                        </h2>

                        <div className="space-y-6 text-gray-400 text-lg font-light leading-[1.9] text-justify">
                            <p>
                                O MatchGame não é um app de namoro. Pode ser, se rolar. Mas o que a gente quer de verdade
                                é algo mais raro: <em className="text-white/80">pertencimento</em>. Aquela sensação de encontrar
                                alguém e pensar &ldquo;finalmente, alguém que entende&rdquo;.
                            </p>
                            <p>
                                Queremos que você encontre o duo perfeito pra subir de ranqueada sem estresse.
                                O amigo pra fechar o squad no fim de semana. Alguém pra ir naquele show da banda
                                desconhecida que só vocês dois amam. Uma pessoa pra debater o final daquele anime
                                que explodiu sua mente. Ou simplesmente alguém que, como você, prefere ficar em casa —
                                e não vê nada de errado nisso.
                            </p>
                            <p>
                                Muitas pessoas incríveis são introvertidas. Elas não vão aparecer num bar, numa festa,
                                num evento aleatório. Mas elas estão aqui. E elas estão procurando por alguém exatamente como você.
                            </p>
                        </div>
                    </div>

                    {/* ── Dados ── */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-mono uppercase tracking-widest text-white mb-8 border-l-2 border-orange-500/40 pl-4">
                            Seus dados, sua verdade
                        </h2>

                        <div className="space-y-6 text-gray-400 text-lg font-light leading-[1.9] text-justify">
                            <p>
                                Em outros apps, você escreve o que quer que as pessoas pensem sobre você.
                                Aqui, você mostra quem você <em className="text-white/80">realmente</em> é.
                            </p>
                            <p>
                                Ao conectar suas contas — Steam, Spotify, MyAnimeList, TMDB, Google Books —
                                você traz dados reais do seu comportamento. Se você tem 2.000 horas de Skyrim,
                                isso diz algo sobre sua paciência e amor por imersão. Se seu Spotify é recheado
                                de indie rock dos anos 2000, isso já cria um tópico de conversa instantâneo.
                                Se você tem todos os volumes de Berserk na estante, a gente sabe que você entende
                                de narrativa.
                            </p>
                            <p>
                                Eliminamos o &ldquo;oi, tudo bem?&rdquo; genérico e pulamos direto para
                                &ldquo;você viu que saiu a DLC nova?&rdquo;. Porque é daí que começa tudo de verdade.
                            </p>
                        </div>
                    </div>

                    {/* ── Para quem é ── */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-mono uppercase tracking-widest text-white mb-8 border-l-2 border-blue-500/40 pl-4">
                            Para quem é isso
                        </h2>

                        <div className="space-y-6 text-gray-400 text-lg font-light leading-[1.9] text-justify">
                            <p>
                                Pra quem passa mais tempo em mundos virtuais do que no mundo lá fora —
                                e não vê problema nenhum nisso. Pra quem já tentou explicar por que um jogo
                                fez chorar e recebeu um olhar estranho de volta. Pra quem tem uma playlist
                                pra cada humor e um watchlist que nunca acaba. Pra quem debate teorias,
                                recomenda filmes com paixão e se apega a personagens de ficção mais do que
                                a maioria das pessoas ao redor.
                            </p>
                            <p>
                                Pra quem sente que existe alguém por aí — alguém que pensa parecido,
                                que sente parecido, que se emociona com as mesmas coisas — mas simplesmente
                                nunca encontrou. Porque essa pessoa também está em casa. Também está de frente
                                pra tela. Também está procurando.
                            </p>
                            <p className="text-white/60 text-xl font-light italic leading-relaxed mt-12 text-center">
                                O MatchGame existe para que essas pessoas finalmente se encontrem.
                            </p>
                        </div>
                    </div>

                    {/* ── Nietzsche ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="py-12 border-t border-white/[0.04] text-center mb-16"
                    >
                        <blockquote className="text-xl md:text-2xl font-light text-white/60 italic leading-relaxed mb-6 font-serif">
                            &ldquo;Detesto quem rouba minha solidão sem, em troca, me oferecer verdadeira companhia.&rdquo;
                        </blockquote>
                        <cite className="text-gray-600 text-sm font-mono uppercase tracking-[0.2em]">
                            — F. Nietzsche
                        </cite>
                    </motion.div>

                    {/* CTA */}
                    <div className="border-t border-white/[0.04] pt-12 text-center">
                        <p className="text-gray-500 text-base mb-8">
                            Se você se reconheceu em algo que leu aqui — esse lugar foi feito pra você.
                        </p>
                        <Link href="/auth/register" className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-white overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 transition-all group-hover:scale-105" />
                            <span className="relative z-10 tracking-widest text-sm uppercase">Começar minha jornada</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
