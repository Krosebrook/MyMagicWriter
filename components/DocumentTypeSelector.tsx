import React, { useState, useRef, useEffect } from 'react';
import { DOCUMENT_TYPES, ICONS } from '../constants.tsx';

interface DocumentType {
    name: string;
    instruction: string;
}

interface DocumentTypeSelectorProps {
  selectedType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
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

    const handleSelect = (type: DocumentType) => {
        onTypeChange(type);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <span>{selectedType.name}</span>
                {ICONS.chevronDown}
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30">
                    <ul className="py-1">
                        {DOCUMENT_TYPES.map(type => (
                            <li key={type.name}>
                                <button
                                    onClick={() => handleSelect(type)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-purple-600 hover:text-white"
                                >
                                    {type.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};