
import React, { useState, useEffect, useRef } from 'react';
import {
  GenerativePart,
  Selection,
  Suggestion,
  RephraseSuggestion,
} from './types';
import { Editor } from './components/Editor';
import { InitialPromptModal } from './components/InitialPromptModal';
import { AiToolbar } from './components/AiToolbar';
import { SuggestionSidebar } from './components/SuggestionSidebar';
import { useDebounce } from './hooks/useDebounce';
import * as geminiService from './services/geminiService';
import { FONT_FAMILIES, FONT_SIZES, ICONS } from './constants';
import { FontSelector } from './components/FontSelector';
import { StorybookModal } from './components/StorybookModal';
import { FindReplaceBar } from './components/FindReplaceBar';
import { InsertContentModal } from './components/InsertContentModal';
import { ExportButton } from './components/ExportButton';


const App: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialModalOpen, setIsInitialModalOpen] = useState<boolean>(true);
  
  const [proactiveSuggestion, setProactiveSuggestion] = useState<Suggestion | null>(null);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState<boolean>(false);
  
  const [rephraseSuggestions, setRephraseSuggestions] = useState<RephraseSuggestion[] | null>(null);

  // Editor Appearance
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [fontSize, setFontSize] = useState(FONT_SIZES[2]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals & Bars
  const [isStorybookModalOpen, setIsStorybookModalOpen] = useState(false);
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const insertCursorPosition = useRef<number | null>(null);

  // Find & Replace State
  const [isFindReplaceVisible, setIsFindReplaceVisible] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matches, setMatches] = useState<{start: number, end: number}[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Debounce content for proactive suggestions
  const debouncedContent = useDebounce(content, 2000);

  useEffect(() => {
    if (debouncedContent && !isLoading && !isInitialModalOpen) {
      const getSuggestion = async () => {
        setIsSuggestionLoading(true);
        const suggestion = await geminiService.getProactiveSuggestion(debouncedContent);
        // Only show suggestion if there isn't one already
        if (!proactiveSuggestion) {
            setProactiveSuggestion(suggestion);
        }
        setIsSuggestionLoading(false);
      };
      getSuggestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent, isLoading, isInitialModalOpen]);
  
  // Dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Effect to find matches when findQuery or content changes
  useEffect(() => {
    if (findQuery && content) {
      const regex = new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const newMatches = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        newMatches.push({ start: match.index, end: match.index + match[0].length });
      }
      setMatches(newMatches);
      setCurrentMatchIndex(0);
    } else {
      setMatches([]);
    }
  }, [findQuery, content]);

  // Effect to highlight current match
  useEffect(() => {
    if (isFindReplaceVisible && matches.length > 0 && editorRef.current) {
      const match = matches[currentMatchIndex];
      if (match) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(match.start, match.end);
      }
    }
  }, [currentMatchIndex, matches, isFindReplaceVisible]);


  const handleGenerate = async (prompt: string, files: GenerativePart[]) => {
    setIsLoading(true);
    const draft = await geminiService.generateInitialDraft(prompt, files);
    setContent(draft);
    setIsLoading(false);
    setIsInitialModalOpen(false);
  };

  const replaceText = (start: number, end: number, newText: string) => {
    setContent(currentContent => currentContent.substring(0, start) + newText + currentContent.substring(end));
    setSelection(null);
  };

  const handleIterate = async (instruction: string) => {
    if (!selection) return;
    setIsLoading(true);
    setRephraseSuggestions(null);
    const newText = await geminiService.iterateOnSelection(selection.text, instruction);
    replaceText(selection.start, selection.end, newText);
    setIsLoading(false);
  };

  const handleRephrase = async () => {
    if (!selection) return;
    setIsLoading(true);
    const suggestions = await geminiService.rephraseSelection(selection.text);
    setRephraseSuggestions(suggestions);
    setIsLoading(false);
  };

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    const newContent = content.replace(suggestion.snippet, suggestion.suggestion);
    setContent(newContent);
    setProactiveSuggestion(null);
  };
  
  const handleGenerateForInsertion = async (prompt: string) => {
    setIsLoading(true);
    const generatedText = await geminiService.generateForInsertion(prompt);
    const position = insertCursorPosition.current ?? content.length;
    setContent(current => current.slice(0, position) + generatedText + current.slice(position));
    setIsInsertModalOpen(false);
    setIsLoading(false);
  };

  const openInsertModal = () => {
    insertCursorPosition.current = editorRef.current?.selectionStart ?? content.length;
    setIsInsertModalOpen(true);
  };

  const handleFindNext = () => {
    if (matches.length > 0) {
      setCurrentMatchIndex(prev => (prev + 1) % matches.length);
    }
  };

  const handleFindPrev = () => {
    if (matches.length > 0) {
      setCurrentMatchIndex(prev => (prev - 1 + matches.length) % matches.length);
    }
  };
  
  const handleReplace = () => {
    if (matches.length > 0) {
      const match = matches[currentMatchIndex];
      const newContent = content.substring(0, match.start) + replaceQuery + content.substring(match.end);
      setContent(newContent);
    }
  };

  const handleReplaceAll = () => {
    if (findQuery && matches.length > 0) {
      const newContent = content.replace(new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replaceQuery);
      setContent(newContent);
    }
  };


  return (
    <div className="h-screen w-screen bg-white dark:bg-gray-950 flex flex-col font-sans transition-colors duration-300">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chaos Writer</h1>
            <div className="flex items-center gap-2">
                 <button onClick={() => setIsFindReplaceVisible(p => !p)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {ICONS.search}
                 </button>
                 <button onClick={openInsertModal} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {ICONS.insert}
                 </button>
                 <button onClick={() => setIsStorybookModalOpen(true)} disabled={!content.trim()} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50">
                    {ICONS.storybook}
                 </button>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <FontSelector fontFamily={fontFamily} setFontFamily={setFontFamily} fontSize={fontSize} setFontSize={setFontSize} />
            <button onClick={() => setIsDarkMode(p => !p)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                {isDarkMode ? ICONS.sun : ICONS.moon}
            </button>
            <ExportButton content={content} />
        </div>
      </header>

      <main className="flex-grow flex h-full overflow-hidden relative">
        <Editor
          ref={editorRef}
          content={content}
          onContentChange={setContent}
          onSelectionChange={setSelection}
          fontFamily={fontFamily}
          fontSize={fontSize}
          isLoading={isLoading}
        />
        <SuggestionSidebar 
            suggestion={proactiveSuggestion}
            onAccept={handleAcceptSuggestion}
            onDismiss={() => setProactiveSuggestion(null)}
            isLoading={isSuggestionLoading}
        />
        {isFindReplaceVisible && (
          <FindReplaceBar 
            isVisible={isFindReplaceVisible} 
            onClose={() => setIsFindReplaceVisible(false)} 
            findQuery={findQuery} 
            setFindQuery={setFindQuery} 
            replaceQuery={replaceQuery} 
            setReplaceQuery={setReplaceQuery}
            onFindNext={handleFindNext} 
            onFindPrev={handleFindPrev} 
            onReplace={handleReplace} 
            onReplaceAll={handleReplaceAll} 
            matchCount={matches.length} 
            currentMatchIndex={currentMatchIndex}
          />
        )}
      </main>

      <InitialPromptModal
        isOpen={isInitialModalOpen}
        onClose={() => setIsInitialModalOpen(false)}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
      
      <AiToolbar 
        selection={selection}
        onIterate={handleIterate}
        onRephrase={handleRephrase}
        onReplace={(newText) => selection && replaceText(selection.start, selection.end, newText)}
        onCancelRephrase={() => setRephraseSuggestions(null)}
        suggestions={rephraseSuggestions}
        isLoading={isLoading}
      />
      
      <StorybookModal
        isOpen={isStorybookModalOpen}
        onClose={() => setIsStorybookModalOpen(false)}
        storyContent={content}
      />
      
      <InsertContentModal 
        isOpen={isInsertModalOpen}
        onClose={() => setIsInsertModalOpen(false)}
        onGenerate={handleGenerateForInsertion}
        isLoading={isLoading}
      />

    </div>
  );
};

export default App;
