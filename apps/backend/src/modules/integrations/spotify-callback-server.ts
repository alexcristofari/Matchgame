import http from 'http';
import { URL } from 'url';
import { SpotifyService } from './spotify.service';

let httpServer: http.Server | null = null;

/**
 * HTML page that processes the Spotify callback via JavaScript
 * This avoids SSL issues by using HTTP and calling the API after processing
 */
const callbackHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Spotify - Conectando...</title>
    <style>
        body {
            background: #0d0d0d;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #333;
            border-top-color: #1DB954;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .success { color: #1DB954; }
        .error { color: #ff4444; }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner" id="spinner"></div>
        <p id="message">Conectando ao Spotify...</p>
    </div>
    <script>
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');

        const msgEl = document.getElementById('message');
        const spinnerEl = document.getElementById('spinner');

        if (error) {
            spinnerEl.style.display = 'none';
            msgEl.className = 'error';
            msgEl.textContent = 'Erro: ' + error;
            setTimeout(() => window.location.href = 'http://localhost:3000/dashboard?spotify_error=' + error, 2000);
        } else if (code && state) {
            // Send code to backend API
            fetch('http://localhost:3001/api/integrations/spotify/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, state })
            })
            .then(res => res.json())
            .then(data => {
                spinnerEl.style.display = 'none';
                if (data.success) {
                    msgEl.className = 'success';
                    msgEl.textContent = '✓ Spotify conectado!';
                    setTimeout(() => window.location.href = 'http://localhost:3000/dashboard?spotify_connected=true', 1500);
                } else {
                    msgEl.className = 'error';
                    msgEl.textContent = 'Erro: ' + (data.error || 'Falha na conexão');
                    setTimeout(() => window.location.href = 'http://localhost:3000/dashboard?spotify_error=connection_failed', 2000);
                }
            })
            .catch(err => {
                spinnerEl.style.display = 'none';
                msgEl.className = 'error';
                msgEl.textContent = 'Erro de conexão';
                setTimeout(() => window.location.href = 'http://localhost:3000/dashboard?spotify_error=network_error', 2000);
            });
        } else {
            spinnerEl.style.display = 'none';
            msgEl.className = 'error';
            msgEl.textContent = 'Parâmetros inválidos';
            setTimeout(() => window.location.href = 'http://localhost:3000/dashboard?spotify_error=missing_params', 2000);
        }
    </script>
</body>
</html>
`;

/**
 * Start HTTP server on port 8888 for Spotify OAuth callback
 * Uses plain HTTP - the callback page uses JavaScript to complete the flow
 */
export function startSpotifyCallbackServer() {
    if (httpServer) {
        console.log('Spotify callback server already running');
        return;
    }

    httpServer = http.createServer((req, res) => {
        const url = new URL(req.url || '/', `http://${req.headers.host}`);

        if (url.pathname === '/callback') {
            // Serve HTML page that will process the callback
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(callbackHtml);
            return;
        }

        res.writeHead(404);
        res.end('Not found');
    });

    httpServer.listen(8888, '127.0.0.1', () => {
        console.log('🎵 Spotify callback server running on http://127.0.0.1:8888');
    });
}

export function stopSpotifyCallbackServer() {
    if (httpServer) {
        httpServer.close();
        httpServer = null;
    }
}
