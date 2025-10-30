
import React from 'react';
import { Suggestion } from '../types';
import { ICONS } from '../constants';

interface SuggestionSidebarProps {
    suggestion: Suggestion | null;
    onAccept: () => void;
    onDismiss: () => void;
    isChecking: boolean;
}

export const SuggestionSidebar: React.FC<SuggestionSidebarProps> = ({ suggestion, onAccept, onDismiss, isChecking }) => {
    return (
        <div className="w-full h-full bg-gray-900 border-l border-gray-700/50 p-6 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                {ICONS.lightbulb}
                AI Suggestions
            </h2>
            <div className="flex-grow bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {isChecking && (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-6 h-6 border-2 border-gray-500 border-t-purple-500 rounded-full animate-spin mb-3"></div>
                        <span>Analyzing your text...</span>
                    </div>
                )}

                {!isChecking && suggestion && (
                    <div className="w-full h-full flex flex-col text-left animate-fade-in">
                        <p className="text-sm text-purple-400 font-semibold mb-2">{suggestion.reason}</p>
                        
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Original</p>
                            <p className="bg-red-900/20 text-red-300 p-2 rounded-md text-sm line-through decoration-red-400">{suggestion.snippet}</p>
                        </div>
                        
                        <div>
                             <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Suggestion</p>
                            <p className="bg-green-900/20 text-green-300 p-2 rounded-md text-sm">{suggestion.suggestion}</p>
                        </div>

                        <div className="mt-auto flex gap-3">
                            <button onClick={onAccept} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">Accept</button>
                            <button onClick={onDismiss} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">Dismiss</button>
                        </div>
                    </div>
                )}
                
                {!isChecking && !suggestion && (
                     <div className="text-gray-500 flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p>Suggestions will appear here as you write.</p>
                     </div>
                )}
            </div>
        </div>
    );
}

// Add fade-in animation to tailwind config or a style tag if needed
// For simplicity here, we'll rely on a basic effect.
// In index.html, you can add:
// <style> @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-in-out; } </style>
