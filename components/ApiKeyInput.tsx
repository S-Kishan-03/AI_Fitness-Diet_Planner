import React, { useState } from 'react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  const handleClear = () => {
    setApiKey('');
    onApiKeySet('');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-white">🔑 Gemini API Key</h3>
        {currentApiKey && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
            Configured
          </span>
        )}
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        Enter your Google Gemini API key to generate personalized fitness and diet plans. 
        <a 
          href="https://ai.google.dev/gemini-api/docs/api-key" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 ml-1"
        >
          Get your API key here →
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key..."
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-24"
            required
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm"
          >
            {showApiKey ? '👁️' : '🙈'}
          </button>
          {currentApiKey && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 text-sm"
              title="Clear API key"
            >
              ❌
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            {currentApiKey ? 'Update API Key' : 'Set API Key'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-600">
        <p className="text-xs text-gray-400">
          🔒 Your API key is stored locally in your browser and never sent to any third-party servers except Google Gemini.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;