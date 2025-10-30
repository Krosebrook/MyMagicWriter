
export interface Selection {
  start: number;
  end: number;
  text: string;
}

export interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
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
