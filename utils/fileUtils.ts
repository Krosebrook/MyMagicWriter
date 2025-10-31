
// FIX: Add .ts extension to file import.
import { GenerativePart } from '../types.ts';

export const fileToGenerativePart = async (file: File): Promise<GenerativePart> => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix 'data:...;base64,', which needs to be removed.
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as a data URL string."));
      }
    };
    reader.onerror = (error) => {
        reject(error);
    }
    reader.readAsDataURL(file);
  });

  const data = await base64EncodedDataPromise;
  
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};