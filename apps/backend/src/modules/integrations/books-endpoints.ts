
// ==================== BOOKS (Google Books) ====================

// GET /api/integrations/books/search - Search books
integrationsRouter.get('/books/search', authenticate, async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query) return res.json({ success: true, data: [] });

        const results = await BooksService.searchBooks(query);
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar livros' });
    }
});

// GET /api/integrations/books/genres - Get book genres
integrationsRouter.get('/books/genres', authenticate, async (req: Request, res: Response) => {
    res.json({ success: true, data: BooksService.getGenres() });
});

// GET /api/integrations/books - Get user's saved books
integrationsRouter.get('/books', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const integration = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'books' } }
        });

        if (!integration) {
            return res.json({ success: true, data: { connected: false } });
        }

        const data = JSON.parse(integration.data);
        res.json({
            success: true,
            data: {
                connected: true,
                genres: integration.genres, // Use column
                favorites: data.favoriteBooks || []
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar livros salvos' });
    }
});

// PUT /api/integrations/books/manual - Save manual Books data
integrationsRouter.put('/books/manual', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { genres, favorites } = req.body;

        // Basic validation
        if (genres && !Array.isArray(genres)) return res.status(400).json({ success: false, error: 'Gêneros inválidos' });
        if (favorites && !Array.isArray(favorites)) return res.status(400).json({ success: false, error: 'Favoritos inválidos' });

        const existing = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'books' } }
        });

        let data = existing ? JSON.parse(existing.data) : {};

        data = {
            ...data,
            manual: true,
            genres: genres || data.genres || [],
            favoriteBooks: favorites || data.favoriteBooks || [],
            updatedAt: new Date().toISOString()
        };

        await prisma.$transaction(async (tx) => {
            // 1. Update Integration
            await tx.integration.upsert({
                where: { userId_type: { userId, type: 'books' } },
                update: {
                    data: JSON.stringify(data),
                    genres: genres || data.genres || [],
                    syncedAt: new Date()
                },
                create: {
                    userId,
                    type: 'books',
                    externalId: `manual_books_${userId}`,
                    data: JSON.stringify(data),
                    genres: genres || [],
                    syncedAt: new Date()
                }
            });

            // 2. Update Favorites (Discovery) if favorites provided
            if (favorites && favorites.length > 0) {
                await tx.favorite.deleteMany({
                    where: { userId, category: 'books' }
                });

                await tx.favorite.createMany({
                    data: favorites.map((f: any, index: number) => ({
                        userId,
                        category: 'books',
                        position: index + 1,
                        itemId: f.id,
                        itemName: f.title,
                        itemImageUrl: f.imageUrl
                    }))
                });
            }
        });

        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar livros';
        res.status(500).json({ success: false, error: message });
    }
});
