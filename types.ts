
export interface GenerativePart {
    inlineData?: {
        data: string; // base64 encoded
        mimeType: string;
    };
    text?: string;
}

export interface Selection {
  text: string;
  start: number;
  end: number;
}

export interface Suggestion {
  snippet: string;
  suggestion: string;
  reason: string;
}

export interface RephraseSuggestion {
  phrasing: string;
  nuance: string;
}

export interface StorybookPage {
  text: string;
  imageUrl: string | null;
}

export interface SpellcheckError {
    word: string;
    suggestions: string[];
    index: number;
}
