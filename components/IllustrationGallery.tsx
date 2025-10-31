import React, { useState } from 'react';
import { Illustration } from '../types.ts';

interface IllustrationGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  illustrations: Illustration[];
}

export const IllustrationGallery: React.FC<IllustrationGalleryProps> = ({ isOpen, onClose, illustrations }) => {
  const [selectedIllustration, setSelectedIllustration] = useState<Illustration | null>(null);

  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl h-full max-h-[90vh] transform transition-all duration-300 scale-100 flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Illustration Gallery</h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
            </button>
          </div>

          <div className="flex-grow bg-gray-100 dark:bg-gray-900 rounded-lg overflow-y-auto p-4">
            {illustrations.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">You haven't generated any illustrations yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {illustrations.map((illustration, index) => (
                  <div key={index} className="group relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer" onClick={() => setSelectedIllustration(illustration)}>
                    <img src={illustration.imageUrl} alt={`Illustration for: ${illustration.prompt}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs line-clamp-3">
                        {illustration.prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedIllustration && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]" onClick={() => setSelectedIllustration(null)}>
              <div className="relative max-w-4xl max-h-[90vh] p-4">
                  <img src={selectedIllustration.imageUrl} alt={`Illustration for: ${selectedIllustration.prompt}`} className="max-w-full max-h-full object-contain rounded-lg" />
                  <p className="text-white/80 text-center mt-2 text-sm italic">{selectedIllustration.prompt}</p>
              </div>
          </div>
      )}
    </>
  );
};