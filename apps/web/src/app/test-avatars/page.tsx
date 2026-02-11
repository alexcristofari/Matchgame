
import fs from 'fs';
import path from 'path';

export default function TestAvatarsPage() {
    // Read the directory to get actual filenames
    // Note: specific to server-side rendering in Next.js
    const avatarDir = path.join(process.cwd(), 'public/avatars');
    let files: string[] = [];

    try {
        if (fs.existsSync(avatarDir)) {
            files = fs.readdirSync(avatarDir).filter(f => f.endsWith('.svg') || f.endsWith('.jpg') || f.endsWith('.png'));
        }
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Local Avatars Gallery 📦</h1>
            <p className="mb-4 text-gray-400">found {files.length} images in /public/avatars</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map(file => (
                    <div key={file} className="bg-zinc-900 p-4 rounded-xl border border-white/10">
                        <img
                            src={`/avatars/${file}`}
                            alt={file}
                            className="w-full aspect-square object-cover rounded-lg bg-black/50 mb-2"
                        />
                        <p className="text-xs text-gray-500 font-mono break-all">{file}</p>
                    </div>
                ))}
            </div>

            {files.length === 0 && (
                <div className="p-4 bg-red-500/20 border border-red-500 text-red-200 rounded">
                    No images found in public/avatars. Did the download script run?
                </div>
            )}
        </div>
    );
}
