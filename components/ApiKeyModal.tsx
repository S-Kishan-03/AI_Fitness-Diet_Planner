import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSubmit(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-slate-700">
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">Gemini API Key Required</h2>
                <p className="text-gray-400 mb-6">
                    Please provide your Google Gemini API key to use the AI features. Your key is stored only in your browser for this session.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        required
                        aria-label="Gemini API Key"
                    />
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300">
                        Continue
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                    Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Get one from Google AI Studio</a>.
                </p>
            </div>
        </div>
    );
};

export default ApiKeyModal;
