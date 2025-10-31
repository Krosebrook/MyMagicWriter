import React, { useState, useRef, useEffect } from 'react';
// FIX: Add .tsx extension to file import.
import { ICONS } from '../constants.tsx';

// Since jsPDF is loaded from a script tag, we need to tell TypeScript about it.
declare global {
    interface Window {
        jspdf: any;
    }
}

interface ExportButtonProps {
  content: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleExportTXT = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, 'document.txt');
  };

  const handleExportMD = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, 'document.md');
  };
  
  const handleExportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set properties
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - (margin * 2);
    
    // Add text with automatic line wrapping
    const lines = doc.splitTextToSize(content, usableWidth);
    doc.text(lines, margin, margin);

    doc.save('document.pdf');
    setIsOpen(false);
  };

  const isDisabled = !content.trim();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDisabled}
        className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-purple-600 hover:text-white rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ICONS.export}
        Export
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30">
          <ul className="py-1">
            <li>
              <button onClick={handleExportTXT} className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-purple-600 hover:text-white">
                as .txt
              </button>
            </li>
            <li>
              <button onClick={handleExportMD} className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-purple-600 hover:text-white">
                as .md
              </button>
            </li>
            <li>
              <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-purple-600 hover:text-white">
                as .pdf
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};