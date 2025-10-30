
import React, { useState } from 'react';
import { fileToGenerativePart } from '../utils/fileUtils';
import { GenerativePart } from '../types';
import { ICONS } from '../constants';

interface InitialPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, files: GenerativePart[]) => void;
  isLoading: boolean;
}

export const InitialPromptModal: React.FC<InitialPromptModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!prompt && files.length === 0) return;
    const fileParts = await Promise.all(files.map(file => fileToGenerativePart(file)));
    onGenerate(prompt, fileParts);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-100">
        <h2 className="text-3xl font-bold text-white mb-4">Create something new</h2>
        <p className="text-gray-400 mb-6">Describe what you want to write. You can also upload files for context (e.g., meeting notes, a rough draft).</p>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A blog post about the future of remote work..."
            className="w-full h-32 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-500"
            disabled={isLoading}
          />

          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">Attach files (optional)</label>
            <input 
              id="file-upload"
              type="file" 
              multiple 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50"
              disabled={isLoading}
            />
            {files.length > 0 && (
              <div className="mt-2 text-xs text-gray-400">
                Selected: {files.map(f => f.name).join(', ')}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!prompt && files.length === 0)}
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
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
