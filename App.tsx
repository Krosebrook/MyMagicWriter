
import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from './components/Editor';
import { AiToolbar } from './components/AiToolbar';
import { InitialPromptModal } from './components/InitialPromptModal';
import { SuggestionSidebar } from './components/SuggestionSidebar';
import { Selection, GenerativePart, Suggestion, RephraseSuggestion } from './types';
import * as geminiService from './services/geminiService';
import { useDebounce } from './hooks/useDebounce';
import { ICONS } from './constants';

function App() {
  const [editorContent, setEditorContent] = useState<string>('');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isCheckingForSuggestion, setIsCheckingForSuggestion] = useState<boolean>(false);
  
  const [rephraseSuggestions, setRephraseSuggestions] = useState<RephraseSuggestion[] | null>(null);
  
  const debouncedContent = useDebounce(editorContent, 2000);

  // When selection changes, clear any existing rephrase suggestions
  // as they are no longer relevant for the new selection.
  useEffect(() => {
    setRephraseSuggestions(null);
  }, [selection]);

  const handleGenerate = async (prompt: string, files: GenerativePart[]) => {
    setIsLoading(true);
    const result = await geminiService.generateInitialDraft(prompt, files);
    setEditorContent(result);
    setIsLoading(false);
    setIsModalOpen(false);
  };

  const handleIteration = async (instruction: string) => {
    if (!selection) return;
    setIsLoading(true);
    
    const result = await geminiService.iterateOnSelection(selection.text, instruction);
    
    setEditorContent(currentContent => 
        currentContent.substring(0, selection.start) + result + currentContent.substring(selection.end)
    );

    setSelection(null);
    setIsLoading(false);
  };

  const handleRephrase = async () => {
    if (!selection) return;
    setIsLoading(true);
    const results = await geminiService.rephraseSelection(selection.text);
    setRephraseSuggestions(results);
    setIsLoading(false);
  };

  const handleReplaceSelection = (newText: string) => {
    if (!selection) return;
    setEditorContent(currentContent => 
        currentContent.substring(0, selection.start) + newText + currentContent.substring(selection.end)
    );
    setSelection(null);
  };

  const handleCancelRephrase = () => {
    setRephraseSuggestions(null);
  };

  const handleAcceptSuggestion = () => {
    if (!suggestion) return;
    setEditorContent(content => content.replace(suggestion.snippet, suggestion.suggestion));
    setSuggestion(null);
  };

  const fetchSuggestion = useCallback(async () => {
    if (!debouncedContent || isLoading) return;

    setIsCheckingForSuggestion(true);
    const newSuggestion = await geminiService.getProactiveSuggestion(debouncedContent);
    
    // Only show suggestion if it's new and doesn't overlap with current selection
    if (newSuggestion && newSuggestion.snippet !== suggestion?.snippet) {
         if(!selection || (debouncedContent.indexOf(newSuggestion.snippet) > selection.end || (debouncedContent.indexOf(newSuggestion.snippet) + newSuggestion.snippet.length) < selection.start)) {
            setSuggestion(newSuggestion);
         }
    } else if (!newSuggestion) {
        setSuggestion(null);
    }
    setIsCheckingForSuggestion(false);
  }, [debouncedContent, isLoading, suggestion, selection]);

  useEffect(() => {
    fetchSuggestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 font-sans">
        <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-2">
                {ICONS.sparkle}
                <h1 className="text-xl font-bold text-white">Magic Writer</h1>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-200"
            >
                New...
            </button>
        </header>

      <div className="flex-grow flex min-h-0">
        <main className="flex-grow w-2/3 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
          <Editor 
            content={editorContent}
            onContentChange={setEditorContent}
            onSelectionChange={setSelection}
            isLoading={isLoading}
          />
        </main>
        <aside className="w-1/3 flex-shrink-0 h-full">
            <SuggestionSidebar 
                suggestion={suggestion}
                onAccept={handleAcceptSuggestion}
                onDismiss={() => setSuggestion(null)}
                isChecking={isCheckingForSuggestion}
            />
        </aside>
      </div>

      <AiToolbar 
        selection={selection}
        onIterate={handleIteration}
        isLoading={isLoading}
        onRephrase={handleRephrase}
        onReplace={handleReplaceSelection}
        onCancelRephrase={handleCancelRephrase}
        suggestions={rephraseSuggestions}
      />
      <InitialPromptModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
