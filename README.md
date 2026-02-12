# MatchGame

MatchGame e um aplicativo de conexao social focado em gamers, amantes de musica e pessoas que buscam relacoes baseadas em interesses reais e profundos. O projeto nasceu da ideia de que os aplicativos de relacionamento tradicionais sao superficiais demais, focando apenas em fotos e descricoes genericas. O MatchGame propoe uma mudanca de paradigma: conectar pessoas atraves do que elas realmente consomem e amam.

## A Ideia e o Proposito

O core do MatchGame e a integracao de dados. Ao inves de perguntar ao usuario "qual seu jogo favorito", o aplicativo se conecta a sua conta Steam para ver quantas horas ele realmente passou jogando cada titulo. Ao inves de perguntar "que tipo de musica voce gosta", ele analisa o Spotify para entender a sonoridade que define o dia a dia do usuario.

O objetivo e criar conexoes onde o primeiro assunto ja esta pronto: aquela raid dificil no MMO, o album que acabou de lancar ou o anime que marcou a infancia.

## Historia e Evolucao do Projeto

O desenvolvimento do MatchGame passou por diversas fases cruciais que moldaram sua arquitetura atual:

### Fase Inicial: Fundacao e Integracoes
O projeto comecou com o estabelecimento do monorepo e a criacao das integracoes basicas. O foco inicial foi garantir que os fluxos de OAuth (Steam e Spotify) fossem robustos, permitindo a coleta fidedigna de dados. Foi tambem estabelecida a base de dados inicial usando SQLite para prototipagem rapida.

### Fase de Expansao: Discovery e UI
Com os dados circulando, passamos para a criacao da interface de descoberta. Implementamos uma experiencia de Swipe inspirada nos melhores apps do mercado, mas com um diferencial: a exibicao imediata de "Power Interesses" (badges de Games, Filmes e Musica) direto no card, permitindo uma triagem muito mais eficiente por parte do usuario.

### Fase de Maturidade: Migracao para PostgreSQL e Infraestrutura
Recentemente, o projeto atingiu um novo patamar de robustez. Migramos toda a infraestrutura de dados de um modelo Sql Server legado para PostgreSQL utilizando Docker. Essa mudanca nao apenas facilitou o deploy e o desenvolvimento local, mas tambem preparou o app para escalar sem custos proibitivos. 

Nesta mesma fase, consolidamos os dados de teste em um sistema de sincronizacao mestre (Sync Master), garantindo que desenvolvedores e testadores tivessem sempre um ambiente rico em perfis e sementes de dados consistentes.

## Arquitetura Tecnica

O MatchGame e construído sobre uma pilha tecnologica moderna e de alta performance:

- **Frontend**: Utiliza Next.js 14 com App Router para uma navegacao rapida e otimizada para SEO. A estilização e feita com Vanilla CSS e Tailwind para garantir flexibilidade e visual premium. Animations sao tratadas pelo Framer Motion, proporcionando uma experiencia fluida de swipe e transicoes.
- **Backend**: Uma API em Node.js com Express, estruturada de forma modular para suportar as diversas integracoes de terceiros (Steam, Spotify, TMDB, MyAnimeList).
- **Banco de Dados**: PostgreSQL gerenciado via Prisma ORM. O Prisma nos permite manter um schema tipado e seguro para todas as operacoes de match, chat e perfil.
- **Infraestrutura**: O projeto e totalmente "dockerizado", facilitando a configuracao do ambiente com o Docker Compose.

## Funcionalidades Principais

- **Discovery Inteligente**: Sistema de swipe que filtra perfis com base em interesses e comportamentos previos.
- **Perfil Rico**: Exibicao de bibliotecas de jogos, playlists favoritas e listas de animes/filmes.
- **Sistema de Matches**: Logica de curtidas mutuas que libera o canal de comunicacao entre os usuarios.
- **Sistema de Chat Seguro**: Mensagens em tempo real via Socket.io com criptografia ponta-a-ponta (banco de dados).
- **Badges de Afinidade**: Identificacao visual rapida no Discover para destacar o que voce e o outro perfil tem em comum.

## Compromisso com o Futuro

O MatchGame continua em evolucao constante. Os próximos passos incluem a implementacao de algoritmos de compatibilidade baseados em Machine Learning para sugerir parceiros de jogo ideais e a expansao para plataformas mobile nativas.

---

## Histórico de Desenvolvimento (Roadmap Executado)

### Fase 1: Migração do Banco de Dados ✅
- [x] Analisar estrutura atual do projeto
- [x] Atualizar `schema.prisma` de SQLite para SQL Server
- [x] Criar/atualizar arquivos `.env` com CONNECTION_STRING
- [x] Executar migrations e testar conexão

### Fase 2: Integrações Backend ✅
- [x] Planejar arquitetura das integrações
- [x] Implementar integração Steam
- [x] Implementar integração Spotify
- [x] Atualizar dashboard

### Fase 3: Preferências do Usuário ✅
- [x] Criar modal de seleção de favoritos
- [x] Steam Game Catalog Search
- [x] Refatoração UX Música (Spotify)
- [x] Página de Perfil e Visualização

### Fase 4: Integrações Anime & Filmes ✅
- [x] Integração Anime (MyAnimeList/Jikan)
- [x] Integração Filmes (TMDB)

### Fase 5: Discovery UI (Swipe) ✅
- [x] Implementar tela de Swipe (like/pass)
- [x] Componente `SwipeCard` com Framer Motion
- [x] Dados de Teste: Seed com usuários fictícios

### Fase 8: Migração para PostgreSQL ✅
- [x] Criar plano de migração
- [x] Configurar ambiente local (Docker na porta 5433)
- [x] Atualizar `schema.prisma` e variáveis de ambiente
- [x] Rodar migrações e seed (`sync_master.ts`)

### Fase 9: Aprimoramento de Interesses no Perfil ✅
- [x] Adicionar `favoriteGame`, `favoriteMovie`, `favoriteMusic` ao DB
- [x] Adicionar `displayName` para visibilidade no Studio
- [x] Atualizar `sync_master.ts` para mapear novos campos
- [x] Atualizar `SwipeCard` para exibir 3 badges de interesses

### Fase 10: Documentação e Finalização ✅
- [x] Unificar scripts de perfis no `profiles.json`
- [x] Criar `MANUAL_DE_COMANDOS.md` completo
- [x] Criar `IMPLEMENTATION_PLAN.md` na raiz
- [x] Redigir novo `README.md` detalhado (sem emojis e com história)
- [x] Adicionar referências ao manual nos arquivos `.env`
- [x] Commit final no Git

### Fase 11: Sistema de Chat Seguro (Tempo Real) 💬
- [x] **Setup e Segurança**
    - [x] Configurar Socket.io Server com Auth JWT
    - [x] Implementar Helper de Criptografia (AES-256)
    - [x] Atualizar métodos do Prisma para criptografar/descriptografar
- [x] **Frontend Core**
    - [x] Criar `SocketContext` para gerenciar conexão global
    - [x] Criar Hooks de `useChat` e `useMatchList`
- [x] **Frontend UI**
    - [x] Tela de Lista de Matches (Sidebar/Mobile)
    - [x] Janela de Chat (Bubbles, Input, Auto-scroll)
