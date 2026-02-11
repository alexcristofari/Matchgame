
import { Router, Request, Response } from 'express';
import axios from 'axios';

export const proxyRouter = Router();

proxyRouter.get('/image', async (req: Request, res: Response) => {
    try {
        const imageUrl = req.query.url as string;
        if (!imageUrl) {
            return res.status(400).send('URL is required');
        }

        const response = await axios.get(imageUrl, {
            responseType: 'stream'
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('Error fetching image');
    }
});
