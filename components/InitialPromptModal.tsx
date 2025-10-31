import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants.tsx';
import { getCreativePrompts } from '../services/geminiService.ts';
import { fileToGenerativePart } from '../utils/fileUtils.ts';
import { GenerativePart } from '../types.ts';

interface InitialPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, files: GenerativePart[]) => void;
  isLoading: boolean;
}

export const InitialPromptModal: React.FC<InitialPromptModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [creativePrompts, setCreativePrompts] = useState<string[]>([]);
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  const fetchPrompts = async () => {
    setIsPromptLoading(true);
    const prompts = await getCreativePrompts();
    setCreativePrompts(prompts);
    setIsPromptLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchPrompts();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && files.length === 0) return;

    const fileParts = await Promise.all(
        files.map(file => fileToGenerativePart(file))
    );

    onSubmit(prompt, fileParts);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl transform transition-all duration-300 scale-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Start a new document</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell me what you want to write about... (e.g., 'a blog post about the benefits of remote work')"
            className="w-full h-32 p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            disabled={isLoading}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attach files (optional)</label>
            <input type="file" multiple onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {files.length > 0 ? files.map(f => f.name).join(', ') : 'You can provide images or other documents for context.'}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Need inspiration?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {isPromptLoading ? <p className="text-sm text-gray-500">Loading suggestions...</p> : 
               creativePrompts.slice(0, 2).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="p-3 text-left text-sm bg-gray-100 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || (!prompt.trim() && files.length === 0)}
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
                Start Writing
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
