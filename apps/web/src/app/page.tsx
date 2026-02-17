'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060606] text-white selection:bg-pink-500 selection:text-white overflow-x-hidden">

      {/* ── Animated Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#060606]" />
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-900/15 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-blue-900/10 blur-[100px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* ── Nav ── */}
      <header className="fixed top-0 w-full z-50 bg-[#060606]/60 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group">
              <span className="text-sm font-bold tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">MATCHGAME</span>
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-white/[0.06]">
              <a href="mailto:alexcristofari2@gmail.com" className="text-gray-600 hover:text-white transition-colors text-sm"><FaEnvelope /></a>
              <a href="https://www.linkedin.com/in/alexsandercristofari/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors text-sm"><FaLinkedin /></a>
              <a href="https://www.instagram.com/alex.cristofari/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors text-sm"><FaInstagram /></a>
              <a href="https://github.com/alexcristofari" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors text-sm"><FaGithub /></a>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-xs font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
              Sobre
            </Link>
            <Link href="/changelog" className="text-xs font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
              Versões
            </Link>
            <Link href="/auth/login" className="text-xs font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
              Entrar
            </Link>
            <Link href="/auth/register" className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-white/20 hover:bg-white hover:text-black transition-all">
              Criar Conta
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-12 bg-gradient-to-r from-pink-500 to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-medium">
              Plataforma de compatibilidade cultural
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-[1.08] mb-8">
            CONEXÕES REAIS<br />
            <span className="font-bold text-gray-500">
              ATRAVÉS DO{' '}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white inline-block"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 200%' }}
              >
                SEU
              </motion.span>
              {' '}GOSTO.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl text-gray-400 text-lg md:text-xl font-light mb-6 leading-relaxed text-justify"
          >
            A primeira plataforma que utiliza seus dados reais de consumo — jogos, músicas, filmes,
            animes e livros — para encontrar pessoas que compartilham suas mesmas paixões.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl text-gray-500 text-base font-light mb-14 leading-relaxed text-justify"
          >
            Porque as melhores conexões nascem quando duas pessoas descobrem que amam as mesmas coisas.
            Seja para um duo na ranqueada, uma amizade para maratonar séries, ou um player 2 para a vida.
            Aqui, seu gosto fala por você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <Link href="/auth/register" className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 transition-all group-hover:scale-105" />
              <span className="relative z-10 tracking-wide">CRIAR PERFIL</span>
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/15 text-white font-medium tracking-wide hover:border-white/40 hover:bg-white/5 transition-all">
              LER MANIFESTO
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Integrações (text-based) ── */}
      <section className="relative z-10 py-28 px-6 md:px-12 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-transparent" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Integrações</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
              Cinco dimensões.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">Uma essência.</span>
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mb-16 leading-relaxed text-justify">
              Cada plataforma que você conecta revela uma faceta diferente de quem você é.
              Juntas, elas formam um retrato cultural completo — e é esse retrato que usamos
              para encontrar pessoas que realmente combinam com você.
            </p>
          </motion.div>

          <div className="space-y-0">
            {[
              {
                name: 'Steam',
                desc: 'Sua biblioteca, suas horas jogadas, seus gêneros favoritos. Os jogos que você escolhe dizem muito sobre como você pensa, reage e se diverte. Encontramos jogadores que compartilham esse mesmo universo.',
                color: 'text-purple-400',
                borderColor: 'border-purple-500/20',
              },
              {
                name: 'Spotify',
                desc: 'Seus top artistas, gêneros e músicas mais ouvidas revelam a trilha sonora da sua vida. Damos match com quem vive na mesma frequência — porque quem ouve as mesmas coisas, sente as mesmas coisas.',
                color: 'text-green-400',
                borderColor: 'border-green-500/20',
              },
              {
                name: 'MyAnimeList',
                desc: 'De shonen a slice-of-life, de clássicos a temporadas correntes — seus animes favoritos carregam histórias que moldaram sua visão de mundo. Encontre quem entende suas referências.',
                color: 'text-pink-400',
                borderColor: 'border-pink-500/20',
              },
              {
                name: 'TMDB',
                desc: 'Filmes e séries que marcaram sua vida são a porta de entrada para conversas profundas, debates apaixonados e noites de cinema compartilhadas com alguém que realmente entende.',
                color: 'text-red-400',
                borderColor: 'border-red-500/20',
              },
              {
                name: 'Google Books',
                desc: 'Os livros que transformaram sua perspectiva conectam você com pessoas que pensam e sentem de forma parecida. Leitores são sonhadores — e sonhadores se encontram.',
                color: 'text-amber-400',
                borderColor: 'border-amber-500/20',
              },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className={`group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 py-7 border-b border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-default`}
              >
                <h3 className={`text-lg font-semibold ${item.color} md:w-40 flex-shrink-0 tracking-tight`}>{item.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors text-justify">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section className="relative z-10 py-28 px-6 md:px-12 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-green-500 to-transparent" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Como funciona</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
              Três passos. <span className="text-gray-500">Zero complicação.</span>
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mb-20 leading-relaxed text-justify">
              Do cadastro ao primeiro match em menos de cinco minutos.
              Sem formulários intermináveis, sem perguntas genéricas — apenas você sendo você.
            </p>
          </motion.div>

          <div className="space-y-16">
            {[
              {
                num: '01',
                title: 'Conecte suas plataformas',
                text: 'Vincule suas contas do Steam, Spotify, MyAnimeList, TMDB e adicione seus livros favoritos. O processo leva menos de dois minutos. Seus dados ficam seguros — usamos apenas para criar seu perfil de compatibilidade, nunca são vendidos ou compartilhados.',
              },
              {
                num: '02',
                title: 'Descubra pessoas compatíveis',
                text: 'Nosso algoritmo cultural analisa seus gostos em cinco dimensões diferentes e encontra pessoas que compartilham suas paixões de verdade. Quanto mais plataformas você conecta, mais preciso fica o match — porque cada dimensão revela uma parte diferente de quem você é.',
              },
              {
                num: '03',
                title: 'Crie conexões reais',
                text: 'Dê match, inicie conversas e construa relacionamentos baseados no que realmente importa — seus interesses, suas vivências, sua essência. Amizade, duo, squad ou algo mais. Aqui, cada conexão começa de um lugar genuíno.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-8 md:gap-12 group"
              >
                <span className="text-5xl md:text-7xl font-extralight text-white/[0.05] tracking-tighter flex-shrink-0 group-hover:text-white/[0.10] transition-colors">{step.num}</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-gray-500 text-base leading-relaxed max-w-xl text-justify">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="relative z-10 py-28 px-6 md:px-12 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-orange-500 to-transparent" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Manifesto</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-12">
              Pessoas. Sentimentos.<br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Conexões de verdade.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-gray-300 text-base leading-[1.85] text-justify">
                Acreditamos que as melhores relações nascem de afinidades reais. Quando você
                descobre alguém que chorou no mesmo final de anime, que ouve as mesmas músicas
                às três da manhã, ou que zera os mesmos jogos no hardest — algo genuíno acontece.
                Uma faísca que nenhum algoritmo de aparência é capaz de criar.
              </p>
              <p className="text-gray-400 text-base leading-[1.85] text-justify">
                O MatchGame nasceu da frustração com plataformas que julgam por foto de perfil.
                Aqui, sua essência vem primeiro. Seus gostos, suas paixões, seu universo cultural —
                isso é o que te conecta com pessoas que realmente entendem quem você é.
                Não pedimos que você se venda. Pedimos que você seja você.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-gray-400 text-base leading-[1.85] text-justify">
                Não queremos likes vazios. Queremos aquela sensação de &ldquo;nossa, você também
                ama isso?&rdquo; — o início de toda grande amizade, de todo grande amor.
                Aquele momento em que você percebe que não está sozinho nas coisas que te movem.
              </p>
              <p className="text-gray-500 text-base leading-[1.85] text-justify">
                Construímos o MatchGame para as pessoas que sentem profundamente.
                Para quem se apega a personagens de ficção, para quem tem uma playlist
                pra cada humor, para quem debate teorias e recomenda filmes com paixão.
                Se você se reconhece nisso — este lugar foi feito para você.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 pt-12 border-t border-white/[0.04] space-y-0"
          >
            {[
              { label: 'Conexão por essência', desc: 'Match baseado no que você ama, não em como você aparenta.' },
              { label: 'Cinco dimensões culturais', desc: 'Jogos, música, anime, filmes e livros — cada um revela uma parte de quem você é.' },
              { label: 'Privacidade sempre', desc: 'Seus dados são usados apenas para matching. Nunca vendidos, nunca compartilhados.' },
              { label: 'Relações autênticas', desc: 'Sem algoritmos de engajamento. Transparência total na hora de conectar pessoas.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 py-5 border-b border-white/[0.04] group cursor-default"
              >
                <p className="text-sm font-medium text-white md:w-56 flex-shrink-0 group-hover:text-pink-300 transition-colors">{item.label}</p>
                <p className="text-sm text-gray-600 group-hover:text-gray-400 transition-colors">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>




      {/* ── CTA ── */}
      <section className="relative z-10 py-32 px-6 md:px-12 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-pink-500/10 blur-[100px] rounded-full" />

          <h2 className="relative text-4xl md:text-6xl font-light tracking-tighter mb-6">
            Pronto para encontrar<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">seu match?</span>
          </h2>
          <p className="relative text-gray-500 text-base mb-4 max-w-lg mx-auto leading-relaxed">
            Crie seu perfil em menos de dois minutos. Conecte suas plataformas favoritas
            e descubra pessoas que compartilham suas mesmas paixões.
          </p>
          <p className="relative text-gray-600 text-sm mb-10 max-w-md mx-auto">
            Gratuito. Sem anúncios. Feito por gamers, para gamers.
          </p>
          <Link href="/auth/register" className="relative inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-white overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 transition-all group-hover:scale-105" />
            <span className="relative z-10 tracking-widest text-sm uppercase">Criar Conta Grátis</span>
          </Link>
        </motion.div>
      </section>




      {/* ── Footer ── */}
      <footer className="relative z-10 px-6 md:px-12 py-10 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 font-mono tracking-wider">MATCHGAME © 2026</p>
          <div className="flex gap-6 text-xs font-medium text-gray-500">
            <Link href="/about" className="hover:text-white transition-colors uppercase tracking-widest">Sobre</Link>
            <Link href="/changelog" className="hover:text-white transition-colors uppercase tracking-widest">Changelog</Link>
            <a href="mailto:alexcristofari2@gmail.com" className="hover:text-white transition-colors uppercase tracking-widest">Contato</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
