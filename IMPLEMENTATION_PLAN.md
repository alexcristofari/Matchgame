# Histórico de Implementação

Este documento registra a evolução técnica do projeto MatchGame, detalhando as grandes mudanças realizadas, com foco na migração de infraestrutura e aprimoramento da experiência do usuário.

## 1. Migração de Banco de Dados: SQL Server para PostgreSQL

A mudança mais significativa do projeto foi a transição do SQL Server (Azure/Local) para um ambiente PostgreSQL rodando em Docker. 

### Motivação
- **Custo e Escalabilidade**: PostgreSQL oferece um ecossistema mais flexível e econômico para projetos de crescimento orgânico.
- **Portabilidade**: O uso de Docker Compose permite que qualquer desenvolvedor suba o ambiente completo com um único comando, sem dependências de serviços instalados nativamente no SO.

### Mudanças Técnicas
- **Prisma Schema**: O provider foi alterado de `sqlserver` para `postgresql`. Tipos específicos como `NVarChar(Max)` foram removidos em favor dos padrões nativos do Postgres.
- **Conectividade**: A URL de conexão foi padronizada para `postgresql://postgres:password123@localhost:5433/matchgame`, utilizando a porta 5433 para evitar conflitos com serviços locais.
- **Ambiente**: Criação do `docker-compose.yml` para orquestração do banco.

---

## 2. Consolidação de Dados e Sincronização (Sync Master)

Antes da migração, os dados de perfis de teste estavam espalhados por diversos scripts (`add_new_profiles.js`, `fix_profiles.js`, etc).

### Ação Realizada
- **Single Source of Truth**: Criamos o `profiles.json` na raiz da pasta `database`, consolidando todos os perfis "meme" e de teste em um único lugar.
- **Script sync_master.ts**: Desenvolvemos um sincronizador robusto que lê esse JSON e realiza o `upsert` (cria ou atualiza) no banco de dados, garantindo que o ambiente de teste esteja sempre atualizado sem duplicar dados.

---

## 3. Aprimoramento da Experiência no Discover

Para tornar o Discover (swipe) mais informativo e rápido, realizamos mudanças estruturais no perfil do usuário.

### Mudanças no Perfil
- **Interesses Diretos**: Adicionamos os campos `favoriteGame`, `favoriteMovie` e `favoriteMusic` diretamente na tabela `Profile`. Isso elimina a necessidade de JOINS complexos durante o swipe, permitindo uma interface extremamente fluida.
- **Visibilidade Técnica**: Adicionamos o campo `displayName` na tabela `Profile` para facilitar a identificação visual dos dados via Prisma Studio.

### UI/UX
- O componente `SwipeCard` foi atualizado para exibir até três badges de interesses (🎮, 🎬, 🎵) simultaneamente, dando ao usuário uma visão imediata da compatibilidade antes mesmo de abrir o perfil completo.

---

## 4. Próximos Passos
- Implementação de Chat em Tempo Real.
- Sistema de Notificações de Matches.
- Refinamento do Algoritmo de Compatibilidade.
