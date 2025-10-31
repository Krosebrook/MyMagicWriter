import React from 'react';

interface IllustrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  isLoading: boolean;
  promptText?: string;
}

export const IllustrationModal: React.FC<IllustrationModalProps> = ({ isOpen, onClose, imageUrl, isLoading, promptText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl h-full max-h-[80vh] transform transition-all duration-300 scale-100 flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Illustration</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 dark:bg-gray-900/80 z-10">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-800 dark:text-white">Generating your illustration...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Generated illustration" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-gray-500 text-center p-4">
              <p>Could not generate an illustration.</p>
              <p className="text-sm">Please try again or with a different paragraph.</p>
            </div>
          )}
        </div>
        
        {promptText && !isLoading && (
             <p className="flex-shrink-0 text-gray-600 dark:text-gray-400 text-center leading-relaxed max-h-24 overflow-y-auto mt-4 text-sm italic truncate">
                For: "{promptText}"
             </p>
        )}
      </div>
    </div>
  );
};