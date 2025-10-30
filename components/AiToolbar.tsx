
import React, { useState } from 'react';
import { Selection, RephraseSuggestion } from '../types';
import { ICONS } from '../constants';

interface AiToolbarProps {
  selection: Selection | null;
  onIterate: (instruction: string) => void;
  onRephrase: () => void;
  onReplace: (newText: string) => void;
  onCancelRephrase: () => void;
  suggestions: RephraseSuggestion[] | null;
  isLoading: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="px-4 py-2 text-sm font-semibold text-white bg-gray-700 hover:bg-purple-600 rounded-md transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
    >
        {children}
    </button>
);

export const AiToolbar: React.FC<AiToolbarProps> = ({ selection, onIterate, onRephrase, onReplace, onCancelRephrase, suggestions, isLoading }) => {
  const [customInstruction, setCustomInstruction] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const isSelectionActive = selection !== null && !isLoading;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInstruction.trim()) {
      onIterate(customInstruction);
      setCustomInstruction('');
      setShowCustomInput(false);
    }
  };

  const handleCancel = () => {
    setShowCustomInput(false);
    onCancelRephrase();
  };
  
  const hasSuggestions = suggestions && suggestions.length > 0;
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-4 transform transition-transform duration-300 ${selection ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="text-sm text-gray-400">
            {selection ? `Selected ${selection.text.length} characters` : 'Select text to activate AI tools'}
        </div>
        <div className="flex items-center gap-2">
            { hasSuggestions ? (
                <>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => onReplace(s.phrasing)}
                            disabled={isLoading}
                            className="px-3 py-2 text-sm text-white bg-gray-700 hover:bg-purple-600 rounded-lg transition duration-200 flex flex-col items-center justify-center text-center disabled:opacity-50 w-40 h-16"
                        >
                            <span className="font-semibold text-purple-300 text-xs mb-1">{s.nuance}</span>
                            <span className="text-white text-xs leading-tight line-clamp-3">{s.phrasing}</span>
                        </button>
                    ))}
                    <button type="button" onClick={handleCancel} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md self-stretch">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
                    </button>
                </>
            ) : !showCustomInput ? (
                 <>
                    <ActionButton disabled={!isSelectionActive} onClick={() => onIterate('Improve the clarity and flow.')}>Improve</ActionButton>
                    <ActionButton disabled={!isSelectionActive} onClick={() => onIterate('Make it more concise.')}>Shorten</ActionButton>
                    <ActionButton disabled={!isSelectionActive} onClick={() => onIterate('Expand on this idea.')}>Expand</ActionButton>
                    <ActionButton disabled={!isSelectionActive} onClick={onRephrase}>Rephrase</ActionButton>
                    <ActionButton disabled={!isSelectionActive} onClick={() => setShowCustomInput(true)}>Custom...</ActionButton>
                 </>
            ) : (
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                        placeholder="e.g., Make it sound more professional"
                        className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none w-72"
                        autoFocus
                    />
                    <button type="submit" disabled={!customInstruction.trim() || isLoading} className="p-2 bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50">
                        {ICONS.send}
                    </button>
                    <button type="button" onClick={handleCancel} className="p-2 text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
