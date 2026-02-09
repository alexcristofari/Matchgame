'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { profilesApi } from '@/services/api';

// Steps components
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="flex items-center justify-center gap-2 mb-12">
        {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-colors duration-300 ${i + 1 <= currentStep ? 'bg-gradient-to-r from-pink-500 to-orange-500' : 'bg-zinc-800'
                    }`}
                initial={{ width: 16 }}
                animate={{ width: i + 1 === currentStep ? 32 : 16 }}
            />
        ))}
    </div>
);

const Step1BasicInfo = ({ data, updateData }: { data: any; updateData: (d: any) => void }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sobre você</h2>
            <p className="text-gray-400">Conte um pouco para o seu futuro squad</p>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
            <textarea
                className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500/50 resize-none h-32"
                placeholder="Eu curto RPGs, animes e..."
                value={data.bio}
                onChange={(e) => updateData({ bio: e.target.value })}
            />
            <p className="text-right text-xs text-gray-600 mt-2">
                {data.bio.length}/500
            </p>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Localização</label>
            <input
                type="text"
                className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500/50"
                placeholder="Cidade, Estado"
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Data de Nascimento</label>
            <input
                type="date"
                className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500/50"
                value={data.birthDate}
                onChange={(e) => updateData({ birthDate: e.target.value })}
            />
        </div>
    </motion.div>
);

const Step2Preferences = ({ data, updateData }: { data: any; updateData: (d: any) => void }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">O que você busca?</h2>
            <p className="text-gray-400">Selecione o tipo de conexão que deseja</p>
        </div>

        <div className="grid gap-4">
            {[
                { id: 'friendship', icon: '🎮', label: 'Amizade & Jogatina', desc: 'Encontrar parceiros para jogar junto' },
                { id: 'relationship', icon: '❤️', label: 'Relacionamento', desc: 'Encontrar meu player 2' },
                { id: 'both', icon: '✨', label: 'Ambos', desc: 'Aberto a todas as possibilidades' },
            ].map((option) => (
                <button
                    key={option.id}
                    className={`p-6 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${data.lookingFor === option.id
                            ? 'border-pink-500 bg-pink-500/10'
                            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                        }`}
                    onClick={() => updateData({ lookingFor: option.id })}
                >
                    <div className="text-3xl">{option.icon}</div>
                    <div>
                        <h3 className={`font-bold ${data.lookingFor === option.id ? 'text-white' : 'text-gray-300'}`}>
                            {option.label}
                        </h3>
                        <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                </button>
            ))}
        </div>
    </motion.div>
);

const Step3Photos = ({ data, updateData }: { data: any; updateData: (d: any) => void }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Suas Fotos</h2>
            <p className="text-gray-400">Adicione URLs de fotos suas (temporário)</p>
        </div>

        <div className="space-y-4">
            {data.photos.map((photo: string, index: number) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500/50"
                        placeholder={`URL da foto ${index + 1}`}
                        value={photo}
                        onChange={(e) => {
                            const newPhotos = [...data.photos];
                            newPhotos[index] = e.target.value;
                            updateData({ photos: newPhotos });
                        }}
                    />
                    {photo && (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            ))}
            {data.photos.length < 6 && (
                <button
                    className="text-sm text-pink-500 hover:text-pink-400 font-medium"
                    onClick={() => updateData({ photos: [...data.photos, ''] })}
                >
                    + Adicionar outra foto
                </button>
            )}
        </div>
    </motion.div>
);

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        bio: '',
        birthDate: '',
        location: '',
        lookingFor: 'both',
        photos: [''] // Start with one empty slot
    });

    const updateData = (newData: any) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            await handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // Filter out empty photo URLs
            const cleanPhotos = formData.photos.filter(p => p.trim() !== '');

            await profilesApi.createProfile({
                ...formData,
                photos: cleanPhotos,
                // Format birthDate if needed, currently string is fine if ISO
            });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900/20 to-transparent" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

            <motion.div
                className="w-full max-w-lg relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <StepIndicator currentStep={step} totalSteps={3} />

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="bg-black/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && <Step1BasicInfo key="step1" data={formData} updateData={updateData} />}
                        {step === 2 && <Step2Preferences key="step2" data={formData} updateData={updateData} />}
                        {step === 3 && <Step3Photos key="step3" data={formData} updateData={updateData} />}
                    </AnimatePresence>

                    <div className="flex gap-4 mt-10">
                        {step > 1 && (
                            <button
                                className="flex-1 py-4 rounded-xl font-semibold text-gray-400 hover:bg-zinc-900 transition-colors"
                                onClick={handleBack}
                            >
                                Voltar
                            </button>
                        )}
                        <button
                            className={`flex-1 py-4 rounded-xl font-semibold text-white transition-all shadow-lg shadow-pink-500/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            style={{
                                background: 'linear-gradient(90deg, #ec4899 0%, #f97316 100%)'
                            }}
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : step === 3 ? 'Finalizar' : 'Próximo'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
