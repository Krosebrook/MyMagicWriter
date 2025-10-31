import React from 'react';

interface FindReplaceBarProps {
  isVisible: boolean;
  onClose: () => void;
  findQuery: string;
  setFindQuery: (query: string) => void;
  replaceQuery: string;
  setReplaceQuery: (query: string) => void;
  onFindNext: () => void;
  onFindPrev: () => void;
  onReplace: () => void;
  onReplaceAll: () => void;
  matchCount: number;
  currentMatchIndex: number;
}

export const FindReplaceBar: React.FC<FindReplaceBarProps> = ({
  isVisible,
  onClose,
  findQuery,
  setFindQuery,
  replaceQuery,
  setReplaceQuery,
  onFindNext,
  onFindPrev,
  onReplace,
  onReplaceAll,
  matchCount,
  currentMatchIndex,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-3 z-10 w-full max-w-sm flex flex-col gap-3 animate-fade-in-down">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white">Find & Replace</h3>
        <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={findQuery}
          onChange={(e) => setFindQuery(e.target.value)}
          placeholder="Find"
          className="flex-grow bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <span className="text-gray-500 dark:text-gray-400 text-sm w-16 text-center">
          {matchCount > 0 ? `${currentMatchIndex + 1} / ${matchCount}` : '0 / 0'}
        </span>
        <button onClick={onFindPrev} disabled={matchCount < 2} className="p-1.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832 6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z" clipRule="evenodd" /></svg>
        </button>
        <button onClick={onFindNext} disabled={matchCount < 2} className="p-1.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" /></svg>
        </button>
      </div>

      <input
        type="text"
        value={replaceQuery}
        onChange={(e) => setReplaceQuery(e.target.value)}
        placeholder="Replace with"
        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />
      
      <div className="flex gap-2 justify-end">
        <button 
          onClick={onReplace}
          disabled={matchCount === 0}
          className="px-4 py-1.5 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
            Replace
        </button>
        <button 
          onClick={onReplaceAll}
          disabled={matchCount === 0}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
            Replace All
        </button>
      </div>
    </div>
  );
};

// Add fade-in-down animation to index.html style block or tailwind config
// In index.html, you can add:
// <style> 
//   @keyframes fade-in-down { 
//     0% { opacity: 0; transform: translateY(-10px); } 
//     100% { opacity: 1; transform: translateY(0); } 
//   } 
//   .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; } 
// </style>