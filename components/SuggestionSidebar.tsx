
import React, { useState } from 'react';
// FIX: Add .ts extension to file import.
import { Suggestion, SpellcheckError } from '../types.ts';
// FIX: Add .tsx extension to file import.
import { ICONS } from '../constants.tsx';

type SidebarTab = 'suggestion' | 'proofread';

interface SuggestionSidebarProps {
  suggestion: Suggestion | null;
  onAccept: (suggestion: Suggestion) => void;
  onDismiss: () => void;
  isSuggestionLoading: boolean;
  spellcheckErrors: SpellcheckError[];
  onApplyCorrection: (error: SpellcheckError, correction: string) => void;
  isSpellcheckLoading: boolean;
}

const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 p-2 text-sm font-semibold border-b-2 transition-colors ${
      isActive
        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
    }`}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
          isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const SuggestionView: React.FC<Pick<SuggestionSidebarProps, 'suggestion' | 'onAccept' | 'onDismiss' | 'isSuggestionLoading'>> = 
({ suggestion, onAccept, onDismiss, isSuggestionLoading }) => {
    if (!suggestion) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <div className="w-10 h-10 text-gray-400 dark:text-gray-600">{ICONS.lightbulb}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {isSuggestionLoading ? "Thinking..." : "AI suggestions will appear here."}
                </p>
            </div>
        );
    }
    return (
        <div className="p-4 flex flex-col gap-4 animate-fade-in flex-grow">
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {ICONS.sparkle} Suggestion
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
                <button onClick={() => onAccept(suggestion)} className="w-full px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-200">Accept</button>
                <button onClick={onDismiss} className="w-full px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition duration-200">Dismiss</button>
            </div>
        </div>
    );
};

const ProofreadView: React.FC<Pick<SuggestionSidebarProps, 'spellcheckErrors' | 'onApplyCorrection' | 'isSpellcheckLoading'>> = 
({ spellcheckErrors, onApplyCorrection, isSpellcheckLoading }) => {
    if (isSpellcheckLoading && spellcheckErrors.length === 0) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <div className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin">
                    <div className="w-8 h-8 border-2 border-gray-400 dark:border-gray-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Checking...</p>
            </div>
        );
    }
    if (spellcheckErrors.length === 0) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <div className="w-10 h-10 text-green-500 dark:text-green-400">{ICONS.proofread}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No errors found!</p>
            </div>
        );
    }
    return (
        <div className="p-4 flex-grow overflow-y-auto">
            <ul className="space-y-4">
                {spellcheckErrors.map((error) => (
                    <li key={error.index} className="text-sm">
                        <p className="line-through text-red-500">{error.word}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {error.suggestions.map(suggestion => (
                                <button
                                    key={suggestion}
                                    onClick={() => onApplyCorrection(error, suggestion)}
                                    className="px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export const SuggestionSidebar: React.FC<SuggestionSidebarProps> = (props) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('suggestion');
  const hasSuggestion = !!props.suggestion;
  const hasErrors = props.spellcheckErrors.length > 0;

  // Automatically switch tab if an error/suggestion appears and the other tab is empty
  React.useEffect(() => {
    if (hasErrors && !hasSuggestion) {
      setActiveTab('proofread');
    } else if (hasSuggestion && !hasErrors) {
      setActiveTab('suggestion');
    }
  }, [hasSuggestion, hasErrors]);

  return (
    <div className="w-72 bg-gray-50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300">
      <div className="flex border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <TabButton
          icon={ICONS.lightbulb}
          label="Suggestion"
          count={hasSuggestion ? 1 : 0}
          isActive={activeTab === 'suggestion'}
          onClick={() => setActiveTab('suggestion')}
        />
        <TabButton
          icon={ICONS.proofread}
          label="Proofread"
          count={props.spellcheckErrors.length}
          isActive={activeTab === 'proofread'}
          onClick={() => setActiveTab('proofread')}
        />
      </div>
      
      {activeTab === 'suggestion' ? (
        <SuggestionView {...props} />
      ) : (
        <ProofreadView {...props} />
      )}
    </div>
  );
};