
export default function DebugImagesPage() {
    const images = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bagra&eyebrows=defaultnatural&mouth=smile",
        "https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg",
        "https://via.placeholder.com/300"
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Debug Images</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {images.map((src, i) => (
                    <div key={i} className="border border-white/20 p-4 rounded-lg">
                        <p className="mb-2 text-xs break-all text-gray-400">{src}</p>
                        <div className="relative h-64 w-full bg-gray-800">
                            <img
                                src={src}
                                alt={`Debug ${i}`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
