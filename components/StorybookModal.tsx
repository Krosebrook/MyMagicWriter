import React, { useState, useEffect } from 'react';
import { StorybookPage } from '../types';
import * as geminiService from '../services/geminiService';

interface StorybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyContent: string;
}

export const StorybookModal: React.FC<StorybookModalProps> = ({ isOpen, onClose, storyContent }) => {
  const [pages, setPages] = useState<StorybookPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const generateStorybook = async () => {
        setIsLoading(true);
        const paragraphs = storyContent.split('\n').filter(p => p.trim() !== '');
        if (paragraphs.length === 0) {
        setIsLoading(false);
        return;
        }

        setGenerationProgress({ current: 0, total: paragraphs.length });
        const generatedPages: StorybookPage[] = [];

        for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        setGenerationProgress({ current: i + 1, total: paragraphs.length });
        const imageUrl = await geminiService.generateStorybookImage(paragraph);
        generatedPages.push({ text: paragraph, imageUrl });
        }

        setPages(generatedPages);
        setIsLoading(false);
    };

    if (isOpen) {
      generateStorybook();
    } else {
      // Reset state when modal is closed
      setPages([]);
      setCurrentPageIndex(0);
      setIsLoading(false);
      setGenerationProgress({ current: 0, total: 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const goToNextPage = () => {
    setCurrentPageIndex(prev => Math.min(prev + 1, pages.length - 1));
  };

  const goToPrevPage = () => {
    setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  };

  if (!isOpen) return null;

  const currentPage = pages[currentPageIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-3xl h-full max-h-[90vh] transform transition-all duration-300 scale-100 flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Storybook</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 dark:bg-gray-900/80 z-10">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-800 dark:text-white">Generating page {generationProgress.current} of {generationProgress.total}...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments.</p>
            </div>
          )}
          {!isLoading && pages.length > 0 && currentPage && (
            <div className="w-full h-full flex flex-col p-4 animate-fade-in">
              <div className="flex-grow w-full bg-black rounded-md flex items-center justify-center mb-4">
                {currentPage.imageUrl ? (
                  <img src={currentPage.imageUrl} alt="Storybook illustration" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-gray-500 text-center p-4">
                    <p>Could not generate image for this page.</p>
                  </div>
                )}
              </div>
              <p className="flex-shrink-0 text-gray-700 dark:text-gray-300 text-center leading-relaxed max-h-24 overflow-y-auto">{currentPage.text}</p>
            </div>
          )}
          {!isLoading && pages.length === 0 && (
            <p className="text-gray-500">No story content found to generate a book.</p>
          )}
        </div>

        {!isLoading && pages.length > 0 && (
          <div className="flex items-center justify-between mt-4 flex-shrink-0">
            <button onClick={goToPrevPage} disabled={currentPageIndex === 0} className="px-5 py-2 rounded-lg text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <span className="text-gray-500 dark:text-gray-400">{currentPageIndex + 1} / {pages.length}</span>
            <button onClick={goToNextPage} disabled={currentPageIndex === pages.length - 1} className="px-5 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};