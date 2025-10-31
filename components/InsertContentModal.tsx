import React, { useState } from 'react';
import { ICONS } from '../constants';

interface InsertContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const InsertContentModal: React.FC<InsertContentModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async () => {
    if (!prompt) return;
    onGenerate(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Insert AI Content</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Describe the content you want to generate and insert at your current cursor position.</p>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="For example: A short poem about the moon..."
            className="w-full h-24 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-900 dark:text-white placeholder-gray-500"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt}
            className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                {ICONS.sparkle}
                Generate & Insert
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};