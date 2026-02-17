import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { profilesApi } from '@/services/api';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: any;
    onSave: () => Promise<void> | void;
}

export function EditProfileModal({ isOpen, onClose, currentProfile, onSave }: EditProfileModalProps) {
    const [bio, setBio] = useState(currentProfile?.bio || '');
    const [location, setLocation] = useState(currentProfile?.location || '');
    const [lookingFor, setLookingFor] = useState(currentProfile?.lookingFor || 'both');
    const [photos, setPhotos] = useState<string[]>(currentProfile?.photos || []);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [birthDate, setBirthDate] = useState(currentProfile?.birthDate ? new Date(currentProfile.birthDate).toISOString().split('T')[0] : '');

    const lookingForOptions = [
        { id: 'friendship', icon: '🎮', label: 'Amizade & Jogatina', desc: 'Encontrar parceiros para jogar junto' },
        { id: 'relationship', icon: '❤️', label: 'Relacionamento', desc: 'Encontrar meu player 2' },
        { id: 'both', icon: '✨', label: 'Ambos', desc: 'Aberto a todas as possibilidades' },
    ];

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('photo', file);

            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/profiles/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                // Add new photo url to list (replace first one for now as we treat it as avatar)
                const newPhotos = [data.data.url, ...photos.slice(1)];
                setPhotos(newPhotos);
            } else {
                alert('Erro no upload: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Falha ao enviar imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await profilesApi.updateProfile({
                bio,
                location,
                lookingFor,
                birthDate,
                photos
            });
            await onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar perfil');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#09090b] border border-zinc-800 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#09090b] z-10 pb-4 border-b border-zinc-800/50">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Editar Perfil</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center gap-6 pb-6 border-b border-zinc-800">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-900 border-2 border-zinc-800 group-hover:border-pink-500/50 transition-colors shadow-xl">
                                {photos[0] ? (
                                    <img src={photos[0]} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl bg-zinc-900">📷</div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[#09090b] hover:bg-pink-400 transition-colors"
                            >
                                ✏️
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            hidden
                            accept="image/*"
                        />
                        <p className="text-sm text-zinc-500 font-medium">
                            {uploading ? 'Enviando...' : 'Alterar foto de perfil'}
                        </p>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Sobre você</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500/50 resize-none min-h-[120px] transition-colors"
                                placeholder="Eu curto RPGs, animes e..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Localização</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                                    placeholder="Cidade, Estado"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Data de Nascimento</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={e => setBirthDate(e.target.value)}
                                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Looking For Section */}
                    <div>
                        <h3 className="block text-sm font-medium text-zinc-400 mb-4">O que você busca?</h3>
                        <div className="grid gap-3">
                            {lookingForOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setLookingFor(option.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${lookingFor === option.id
                                            ? 'border-pink-500 bg-pink-500/10'
                                            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
                                        }`}
                                >
                                    <div className="text-2xl">{option.icon}</div>
                                    <div>
                                        <h4 className={`font-bold ${lookingFor === option.id ? 'text-white' : 'text-zinc-300'}`}>
                                            {option.label}
                                        </h4>
                                        <p className="text-xs text-zinc-500">{option.desc}</p>
                                    </div>
                                    {lookingFor === option.id && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-10 pt-6 border-t border-zinc-800">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-xl font-semibold text-zinc-400 hover:bg-zinc-900 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-4 rounded-xl font-semibold text-white transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(90deg, #ec4899 0%, #f97316 100%)'
                        }}
                    >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
