import React, { useState } from 'react';
// FIX: Add .ts extension to file import.
import { SpellcheckError } from '../types.ts';

interface SpellcheckHighlightProps {
  error: SpellcheckError;
  onCorrect: (error: SpellcheckError, correction: string) => void;
}

export const SpellcheckHighlight: React.FC<SpellcheckHighlightProps> = ({ error, onCorrect }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="spell-error">{error.word}</span>
      {showTooltip && (
        <div className="tooltip">
          <div className="tooltip-content">
            {error.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  onCorrect(error, suggestion);
                  setShowTooltip(false);
                }}
                className="px-3 py-1 text-sm bg-purple-600 text-white dark:bg-purple-500 dark:text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </span>
  );
};