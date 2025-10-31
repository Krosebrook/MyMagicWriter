import React from 'react';

interface NextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: string[];
  isLoading: boolean;
}

export const NextStepsModal: React.FC<NextStepsModalProps> = ({ isOpen, onClose, steps, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-xl transform transition-all duration-300 scale-100 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Suggested Next Steps</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    {steps.map((step, index) => (
                        <li key={index} className="pl-2">{step}</li>
                    ))}
                </ol>
            )}
        </div>
      </div>
    </div>
  );
};