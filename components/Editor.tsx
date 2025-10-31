import React, { useRef, useLayoutEffect, forwardRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
// FIX: Add .ts extension to file import.
import { Selection, SpellcheckError } from '../types.ts';
// FIX: Add .tsx extension to file import.
import { SpellcheckHighlight } from './SpellcheckHighlight.tsx';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSelectionChange: (selection: Selection | null) => void;
  fontFamily: string;
  fontSize: string;
  isLoading: boolean;
  placeholder: string;
  spellcheckErrors: SpellcheckError[];
  onApplyCorrection: (error: SpellcheckError, correction: string) => void;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  (
    {
      content,
      onContentChange,
      onSelectionChange,
      fontFamily,
      fontSize,
      isLoading,
      placeholder,
      spellcheckErrors,
      onApplyCorrection,
    },
    ref
  ) => {
    const highlightsRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Sync the forwarded ref with the internal ref
    useLayoutEffect(() => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else {
        ref.current = internalRef.current;
      }
    }, [ref]);

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
    
    // Sync scroll between textarea and highlights div
    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (highlightsRef.current) {
        highlightsRef.current.scrollTop = e.currentTarget.scrollTop;
        highlightsRef.current.scrollLeft = e.currentTarget.scrollLeft;
      }
    };
    
    const renderContentWithHighlights = () => {
        if (!spellcheckErrors || spellcheckErrors.length === 0) {
            return content;
        }

        const sortedErrors = [...spellcheckErrors].sort((a, b) => a.index - b.index);
        let lastIndex = 0;
        const elements: React.ReactNode[] = [];

        sortedErrors.forEach((error, i) => {
            elements.push(content.slice(lastIndex, error.index));
            elements.push(
                <SpellcheckHighlight
                    key={`${error.index}-${i}`}
                    error={error}
                    onCorrect={onApplyCorrection}
                />
            );
            lastIndex = error.index + error.word.length;
        });

        elements.push(content.slice(lastIndex));

        if (content.endsWith('\n')) {
          elements.push(<br key="final-break" />);
        }
        
        return elements;
    };
    
    // Selection handling effect
    useLayoutEffect(() => {
        const editor = internalRef.current;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSelectionChange]);
    
    const commonStyles: React.CSSProperties = {
        fontFamily: fontFamily,
        fontSize: fontSize,
        lineHeight: '1.75rem', // Corresponds to Tailwind's 'leading-relaxed'
        letterSpacing: '0.025em', // Corresponds to Tailwind's 'tracking-wide'
    };

    const className = "w-full h-full p-8 md:p-12 box-border resize-none";

    return (
      <div className="flex-grow w-full h-full relative">
        <div
          ref={highlightsRef}
          className={`${className} absolute inset-0 overflow-auto whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100 pointer-events-none`}
          style={commonStyles}
          aria-hidden="true"
        >
          {renderContentWithHighlights()}
        </div>
        <TextareaAutosize
          ref={internalRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onSelect={(e) => handleSelect(e.currentTarget)}
          onScroll={handleScroll}
          placeholder={content ? '' : placeholder}
          className={`${className} absolute inset-0 bg-transparent text-transparent caret-gray-900 dark:caret-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none placeholder:whitespace-pre-wrap`}
          style={commonStyles}
          disabled={isLoading}
          minRows={10}
        />
      </div>
    );
  }
);