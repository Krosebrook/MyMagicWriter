
import React from 'react';
import { Suggestion } from '../types';
import { ICONS } from '../constants';

interface SuggestionSidebarProps {
  suggestion: Suggestion | null;
  onAccept: (suggestion: Suggestion) => void;
  onDismiss: () => void;
  isLoading: boolean;
}

export const SuggestionSidebar: React.FC<SuggestionSidebarProps> = ({ suggestion, onAccept, onDismiss, isLoading }) => {
  if (!suggestion) {
    return (
        <div className="w-64 bg-gray-50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-center items-center text-center transition-all duration-300">
            <div className="w-10 h-10 text-gray-400 dark:text-gray-600">
                {ICONS.lightbulb}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isLoading ? "Thinking..." : "Proactive suggestions will appear here as you write."}
            </p>
        </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-4 animate-fade-in">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          {ICONS.sparkle}
          Suggestion
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2 text-sm">
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase">From</span>
          <p className="line-through text-gray-500 dark:text-gray-400">{suggestion.snippet}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-green-500 uppercase">To</span>
          <p className="text-gray-900 dark:text-white">{suggestion.suggestion}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => onAccept(suggestion)}
          className="w-full px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-200"
        >
          Accept
        </button>
        <button
          onClick={onDismiss}
          className="w-full px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition duration-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
