import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Editor } from './components/Editor.tsx';
import { AiToolbar } from './components/AiToolbar.tsx';
import { SuggestionSidebar } from './components/SuggestionSidebar.tsx';
import { InitialPromptModal } from './components/InitialPromptModal.tsx';
import { StorybookModal } from './components/StorybookModal.tsx';
import { IllustrationModal } from './components/IllustrationModal.tsx';
import { FontSelector } from './components/FontSelector.tsx';
import { FindReplaceBar } from './components/FindReplaceBar.tsx';
import { InsertContentModal } from './components/InsertContentModal.tsx';
import { ExportButton } from './components/ExportButton.tsx';
import { DocumentTypeSelector } from './components/DocumentTypeSelector.tsx';
import { DocumentStats } from './components/DocumentStats.tsx';
import { NextStepsModal } from './components/NextStepsModal.tsx';
import { IllustrationGallery } from './components/IllustrationGallery.tsx';
import { Selection, Suggestion, RephraseSuggestion, GenerativePart, SpellcheckError, Illustration } from './types.ts';
import * as geminiService from './services/geminiService.ts';
import * as spellcheckService from './services/spellcheckService.ts';
import { useDebounce } from './hooks/useDebounce.ts';
import { DOCUMENT_TYPES, ICONS } from './constants.tsx';

const App: React.FC = () => {
  // Core editor state
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Document settings state
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
  const [fontFamily, setFontFamily] = useState('ui-sans-serif, system-ui, sans-serif');
  const [fontSize, setFontSize] = useState('16px');

  // AI features state
  const [proactiveSuggestion, setProactiveSuggestion] = useState<Suggestion | null>(null);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [rephraseSuggestions, setRephraseSuggestions] = useState<RephraseSuggestion[] | null>(null);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [isNextStepsLoading, setIsNextStepsLoading] = useState(false);
  
  // Spellcheck state
  const [spellcheckErrors, setSpellcheckErrors] = useState<SpellcheckError[]>([]);
  const [isSpellcheckLoading, setIsSpellcheckLoading] = useState(false);
  
  // Modal & UI visibility state
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(true);
  const [isStorybookModalOpen, setIsStorybookModalOpen] = useState(false);
  const [isIllustrationModalOpen, setIsIllustrationModalOpen] = useState(false);
  const [illustrationImageUrl, setIllustrationImageUrl] = useState<string | null>(null);
  const [isFindReplaceVisible, setIsFindReplaceVisible] = useState(false);
  const [isInsertContentModalOpen, setIsInsertContentModalOpen] = useState(false);
  const [isNextStepsModalOpen, setIsNextStepsModalOpen] = useState(false);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);


  // Debounced content for background tasks
  const debouncedContent = useDebounce(content, 1000);

  // --- Effects for background AI tasks ---

  // Proactive suggestions
  useEffect(() => {
    if (debouncedContent && !isLoading && !selection) {
      const fetchSuggestion = async () => {
        setIsSuggestionLoading(true);
        const suggestion = await geminiService.getProactiveSuggestion(debouncedContent);
        setProactiveSuggestion(suggestion);
        setIsSuggestionLoading(false);
      };
      fetchSuggestion();
    }
  }, [debouncedContent, isLoading, selection]);
  
  // Spellchecking
  useEffect(() => {
    if (debouncedContent) {
      const checkSpelling = async () => {
        setIsSpellcheckLoading(true);
        const errors = await spellcheckService.checkSpelling(debouncedContent);
        setSpellcheckErrors(errors);
        setIsSpellcheckLoading(false);
      };
      checkSpelling();
    }
  }, [debouncedContent]);

  // --- Core Text & Correction Handlers ---
  const replaceText = (start: number, end: number, newText: string) => {
    setContent(currentContent => currentContent.substring(0, start) + newText + currentContent.substring(end));
    // After replacement, clear selection and suggestions
    setSelection(null);
    setRephraseSuggestions(null);
  };
  
  const handleApplyCorrection = (error: SpellcheckError, correction: string) => {
    setContent(currentContent => {
        const before = currentContent.substring(0, error.index);
        const after = currentContent.substring(error.index + error.word.length);
        return before + correction + after;
    });
    setSpellcheckErrors(errors => errors.filter(e => e.index !== error.index));
  };

  const handleSelectionChange = (newSelection: Selection | null) => {
    setSelection(newSelection);
    if (newSelection === null) {
      setRephraseSuggestions(null); // Clear rephrase suggestions when selection is cleared
    }
  };

  // --- AI Feature Handlers ---
  const handleInitialSubmit = async (prompt: string, files: GenerativePart[]) => {
    setIsLoading(true);
    setIsInitialModalOpen(false);
    const draft = await geminiService.generateInitialDraft(prompt, files, documentType.instruction);
    setContent(draft);
    setIsLoading(false);
  };
  
  const handleIterate = async (instruction: string) => {
    if (!selection) return;
    setIsLoading(true);
    const modifiedText = await geminiService.iterateOnSelection(selection.text, instruction, documentType.instruction);
    replaceText(selection.start, selection.end, modifiedText);
    setIsLoading(false);
  };

  const handleRephrase = async () => {
    if (!selection) return;
    setIsLoading(true);
    const suggestions = await geminiService.rephraseSelection(selection.text);
    setRephraseSuggestions(suggestions);
    setIsLoading(false);
  };
  
  const handleReplaceSuggestion = (newText: string) => {
    if (!selection) return;
    replaceText(selection.start, selection.end, newText);
  };
  
  const handleAcceptProactiveSuggestion = (suggestion: Suggestion) => {
      const index = content.indexOf(suggestion.snippet);
      if (index !== -1) {
          replaceText(index, index + suggestion.snippet.length, suggestion.suggestion);
      }
      setProactiveSuggestion(null);
  };

  const handleIllustrate = async () => {
    if (!selection || selection.text.split(' ').length < 10) {
        alert("Please select a paragraph (at least 10 words) to illustrate.");
        return;
    }
    setIsLoading(true);
    setIsIllustrationModalOpen(true);
    setIllustrationImageUrl(null);
    const imageUrl = await geminiService.generateStorybookImage(selection.text);
    setIllustrationImageUrl(imageUrl);
    if (imageUrl) {
        setIllustrations(prev => [...prev, { prompt: selection.text!, imageUrl: imageUrl }]);
    }
    setIsLoading(false);
  };
  
  const handleInsertContent = (textToInsert: string) => {
    const cursorPosition = editorRef.current?.selectionStart ?? content.length;
    const newContent = `${content.slice(0, cursorPosition)}${textToInsert}${content.slice(cursorPosition)}`;
    setContent(newContent);
  };
  
  const handleGetNextSteps = async () => {
    setIsNextStepsLoading(true);
    setIsNextStepsModalOpen(true);
    const steps = await geminiService.generateNextSteps(content, documentType.instruction);
    setNextSteps(steps);
    setIsNextStepsLoading(false);
  };

  // --- Keyboard & Find/Replace Handlers ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsFindReplaceVisible(v => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsInsertContentModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [findMatches, setFindMatches] = useState<{start: number; end: number}[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    if (findQuery) {
        const regex = new RegExp(findQuery, 'gi');
        const matches = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            matches.push({ start: match.index, end: match.index + match[0].length });
        }
        setFindMatches(matches);
        setCurrentMatchIndex(0);
        if (matches.length > 0) {
          editorRef.current?.focus();
          editorRef.current?.setSelectionRange(matches[0].start, matches[0].end);
        }
    } else {
        setFindMatches([]);
    }
  }, [findQuery, content]);

  const handleFindNext = () => {
    if (findMatches.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % findMatches.length;
    setCurrentMatchIndex(nextIndex);
    const match = findMatches[nextIndex];
    editorRef.current?.focus();
    editorRef.current?.setSelectionRange(match.start, match.end);
  };
  
  const handleFindPrev = () => {
    if (findMatches.length === 0) return;
    const prevIndex = (currentMatchIndex - 1 + findMatches.length) % findMatches.length;
    setCurrentMatchIndex(prevIndex);
    const match = findMatches[prevIndex];
    editorRef.current?.focus();
    editorRef.current?.setSelectionRange(match.start, match.end);
  };

  const handleReplace = () => {
    if (findMatches.length === 0) return;
    const match = findMatches[currentMatchIndex];
    replaceText(match.start, match.end, replaceQuery);
  };
  
  const handleReplaceAll = () => {
    if (findMatches.length === 0) return;
    const regex = new RegExp(findQuery, 'gi');
    setContent(content.replace(regex, replaceQuery));
  };


  return (
    <main className="h-screen w-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col antialiased">
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Ghostwriter AI</h1>
            <DocumentTypeSelector selectedType={documentType} onTypeChange={setDocumentType} />
        </div>
        <div className="flex items-center gap-4">
            <button
                onClick={() => setIsGalleryOpen(true)}
                disabled={illustrations.length === 0}
                className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-purple-600 hover:text-white rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
            >
                {ICONS.gallery}
                Illustrations ({illustrations.length})
            </button>
            <button
                onClick={handleGetNextSteps}
                disabled={isNextStepsLoading}
                className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-purple-600 hover:text-white rounded-lg transition duration-200 flex items-center gap-2"
            >
                {ICONS.steps}
                Suggest Next Steps
            </button>
            <button
                onClick={() => setIsInsertContentModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-purple-600 hover:text-white rounded-lg transition duration-200"
            >
                Insert... (⌘K)
            </button>
            <button
                onClick={() => setIsStorybookModalOpen(true)}
                disabled={!content.trim()}
                className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-purple-600 hover:text-white rounded-lg transition duration-200 disabled:opacity-50"
            >
                Create Storybook
            </button>
            <ExportButton content={content} />
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            <FontSelector fontFamily={fontFamily} setFontFamily={setFontFamily} fontSize={fontSize} setFontSize={setFontSize} />
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden relative">
        <Editor
          ref={editorRef}
          content={content}
          onContentChange={setContent}
          onSelectionChange={handleSelectionChange}
          fontFamily={fontFamily}
          fontSize={fontSize}
          isLoading={isLoading}
          placeholder={`Start writing your ${documentType.name.toLowerCase()}...`}
          spellcheckErrors={spellcheckErrors}
          onApplyCorrection={handleApplyCorrection}
        />
        <SuggestionSidebar 
            suggestion={proactiveSuggestion} 
            onAccept={handleAcceptProactiveSuggestion}
            onDismiss={() => setProactiveSuggestion(null)}
            isSuggestionLoading={isSuggestionLoading}
            spellcheckErrors={spellcheckErrors}
            onApplyCorrection={handleApplyCorrection}
            isSpellcheckLoading={isSpellcheckLoading}
        />
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
            matchCount={findMatches.length}
            currentMatchIndex={currentMatchIndex}
        />
      </div>

      <footer className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
        <DocumentStats content={content} />
      </footer>

      <AiToolbar 
        selection={selection} 
        onIterate={handleIterate} 
        onRephrase={handleRephrase}
        onReplace={handleReplaceSuggestion}
        onCancelRephrase={() => setRephraseSuggestions(null)}
        suggestions={rephraseSuggestions}
        isLoading={isLoading}
        onIllustrate={handleIllustrate}
      />

      <InitialPromptModal 
        isOpen={isInitialModalOpen}
        onClose={() => setIsInitialModalOpen(false)}
        onSubmit={handleInitialSubmit}
        isLoading={isLoading}
      />

      <StorybookModal 
        isOpen={isStorybookModalOpen}
        onClose={() => setIsStorybookModalOpen(false)}
        storyContent={content}
      />
      
      <IllustrationModal
        isOpen={isIllustrationModalOpen}
        onClose={() => setIsIllustrationModalOpen(false)}
        imageUrl={illustrationImageUrl}
        isLoading={isLoading}
        promptText={selection?.text}
      />

      <InsertContentModal
        isOpen={isInsertContentModalOpen}
        onClose={() => setIsInsertContentModalOpen(false)}
        onInsert={handleInsertContent}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        systemInstruction={documentType.instruction}
      />

      <NextStepsModal
        isOpen={isNextStepsModalOpen}
        onClose={() => setIsNextStepsModalOpen(false)}
        steps={nextSteps}
        isLoading={isNextStepsLoading}
      />

      <IllustrationGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        illustrations={illustrations}
      />

    </main>
  );
};

export default App;