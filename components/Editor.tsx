
import React, { useRef } from 'react';
import { Selection } from '../types';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSelectionChange: (selection: Selection | null) => void;
  isLoading: boolean;
}

export const Editor: React.FC<EditorProps> = ({ content, onContentChange, onSelectionChange, isLoading }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = () => {
    if (editorRef.current) {
      const { selectionStart, selectionEnd } = editorRef.current;
      if (selectionStart !== selectionEnd) {
        onSelectionChange({
          start: selectionStart,
          end: selectionEnd,
          text: editorRef.current.value.substring(selectionStart, selectionEnd),
        });
      } else {
        onSelectionChange(null);
      }
    }
  };

  return (
    <textarea
      ref={editorRef}
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      onSelect={handleSelect}
      placeholder="Start writing, or generate content to begin..."
      className="w-full h-full p-8 md:p-12 bg-transparent text-gray-300 text-lg leading-relaxed focus:outline-none resize-none placeholder-gray-600 selection:bg-purple-500 selection:text-white"
      disabled={isLoading}
    />
  );
};
