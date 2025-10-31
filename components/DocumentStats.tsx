import React, { useMemo } from 'react';

interface DocumentStatsProps {
  content: string;
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({ content }) => {
  const { words, characters } = useMemo(() => {
    const trimmedContent = content.trim();
    const wordMatches = trimmedContent.match(/\b\w+\b/g);
    return {
      words: wordMatches ? wordMatches.length : 0,
      characters: trimmedContent.length,
    };
  }, [content]);

  return (
    <div className="flex items-center justify-end gap-4 px-4 py-1 text-xs text-gray-500 dark:text-gray-400">
      <span>{words} {words === 1 ? 'word' : 'words'}</span>
      <div className="w-px h-3 bg-gray-200 dark:bg-gray-700"></div>
      <span>{characters} {characters === 1 ? 'character' : 'characters'}</span>
    </div>
  );
};