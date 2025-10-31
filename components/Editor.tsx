
import React, { useEffect, forwardRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Selection } from '../types';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSelectionChange: (selection: Selection | null) => void;
  fontFamily: string;
  fontSize: string;
  isLoading: boolean;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ content, onContentChange, onSelectionChange, fontFamily, fontSize, isLoading }, ref) => {

    const handleSelect = (editor: HTMLTextAreaElement | null) => {
      if (editor) {
        const { selectionStart, selectionEnd } = editor;
        if (selectionStart !== selectionEnd) {
          onSelectionChange({
            text: editor.value.substring(selectionStart, selectionEnd),
            start: selectionStart,
            end: selectionEnd,
          });
        } else {
          onSelectionChange(null);
        }
      }
    };

    useEffect(() => {
        const editor = (ref as React.RefObject<HTMLTextAreaElement>)?.current;
        if (editor) {
            const handleMouseUp = () => handleSelect(editor);
            const handleKeyUp = (e: KeyboardEvent) => {
                if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End') {
                    if (e.shiftKey) {
                        handleSelect(editor);
                    } else {
                        onSelectionChange(null);
                    }
                }
            };

            editor.addEventListener('mouseup', handleMouseUp);
            editor.addEventListener('keyup', handleKeyUp);
            
            return () => {
                editor.removeEventListener('mouseup', handleMouseUp);
                editor.removeEventListener('keyup', handleKeyUp);
            };
        }
    }, [ref, onSelectionChange]);

    return (
      <div className="flex-grow w-full h-full relative">
        <TextareaAutosize
          ref={ref}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onSelect={(e) => handleSelect(e.currentTarget)}
          placeholder="Start writing your masterpiece..."
          className="w-full h-full p-8 md:p-12 box-border resize-none bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed tracking-wide"
          style={{ fontFamily: fontFamily, fontSize: fontSize }}
          disabled={isLoading}
          minRows={10}
        />
      </div>
    );
  }
);
