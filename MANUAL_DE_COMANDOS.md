# MANUAL DE COMANDOS

### Comandos Essenciais (Executar em terminais separados)

1. **Backend**: `pnpm dev:backend`
2. **Frontend**: `pnpm --filter web dev`
3. **Database Studio**: `pnpm db:studio` (no root) ou `npx prisma studio` (em packages/database)
4. **Sincronizar Perfis**: `npx tsx sync_master.ts` (dentro de `packages/database`)

---

## Gerenciamento do Projeto

Aqui estao os comandos e truques mais importantes para facilitar sua vida no desenvolvimento.

---

## Como Rodar o Projeto

Para comecar o desenvolvimento, abra os terminais diferentes na raiz do projeto conforme os comandos acima.

---

## Banco de Dados e Prisma

### Sincronizar banco com o Schema
Sempre que voce mudar o arquivo `schema.prisma`:
```bash
pnpm db:push
```

### Visualizar Dados com Interface Grafica
Para abrir o Prisma Studio e ver/editar dados no navegador, rode na raiz do projeto:
```bash
pnpm db:studio
```

### Atualizar Perfis (Sync Master)
Depois de editar o `packages/database/profiles.json`, rode isso para atualizar o banco:
```bash
cd packages/database
npx tsx sync_master.ts
```

---

## Limpeza de Dados (SQL)

Use estes comandos no seu cliente SQL (Azure Data Studio, DBeaver) ou na aba de query do Prisma Studio.

### Apagar Usuarios Especificos (com Cascata Manual)
Se precisar apagar usuarios que ja tem historico (likes, matches), use este script completo:

```sql
-- 1. Definir quem vai ser apagado
DECLARE @EmailsToDelete TABLE (email NVARCHAR(255));
INSERT INTO @EmailsToDelete (email)
VALUES 
    ('email.chato@exemplo.com'),
    ('outro.email@exemplo.com');

-- 2. Limpar dependencias
DELETE FROM Dislike WHERE fromUserId IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete)) OR toUserId IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete));
DELETE FROM [Like] WHERE fromUserId IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete)) OR toUserId IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete));
DELETE FROM Match WHERE user1Id IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete)) OR user2Id IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete));
DELETE FROM Message WHERE senderId IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete));
DELETE FROM Profile WHERE userId IN (SELECT id FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete));

-- 3. Apagar o Usuario
DELETE FROM [User] WHERE email IN (SELECT email FROM @EmailsToDelete);
```

---

## Organizacao de Arquivos

- **`packages/database/profiles.json`**: Onde voce edita os perfis "fakes" do sistema.
- **`packages/database/sync_master.ts`**: O script que le o JSON e joga no banco.
- **`packages/database/scripts/`**: Onde estao scripts auxiliares antigos.
