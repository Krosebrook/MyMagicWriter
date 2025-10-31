

// FIX: Add .ts extension to file import.
import { SpellcheckError } from '../types.ts';

const MISTAKES: { [key: string]: string[] } = {
  "teh": ["the"],
  "wrok": ["work"],
  "writting": ["writing"],
  "experiance": ["experience"],
  "beleive": ["believe"],
  "wierd": ["weird"],
  "untill": ["until"],
  "seperate": ["separate"],
  "succes": ["success"],
  "sucess": ["success"],
  "definitly": ["definitely"],
  "goverment": ["government"],
};

export const checkSpelling = async (text: string): Promise<SpellcheckError[]> => {
  // Simulate a short async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const errors: SpellcheckError[] = [];
  // Use regex to split into words and non-words (punctuation, spaces)
  const tokens = text.split(/(\b\w+\b)/);

  let currentIndex = 0;
  for (const token of tokens) {
    if (/\w+/.test(token)) { // It's a word
      const lowerWord = token.toLowerCase();
      if (MISTAKES[lowerWord]) {
        errors.push({
          word: token,
          suggestions: MISTAKES[lowerWord],
          index: currentIndex,
        });
      }
    }
    currentIndex += token.length;
  }

  return errors;
};