import React, { useState } from 'react';
import * as geminiService from '../services/geminiService.ts';
import { ICONS } from '../constants.tsx';

interface InsertContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  systemInstruction: string;
}

export const InsertContentModal: React.FC<InsertContentModalProps> = ({ isOpen, onClose, onInsert, isLoading, setIsLoading, systemInstruction }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    const generatedText = await geminiService.generateForInsertion(prompt, systemInstruction);
    onInsert(generatedText);
    setIsLoading(false);
    setPrompt('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate & Insert</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A short paragraph about the importance of teamwork"
            className="w-full h-24 p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="mt-2 w-full px-4 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                {ICONS.send}
                Generate
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};