import React, { useState, useRef, useEffect } from 'react';
import { ICONS, FONT_FAMILIES, FONT_SIZES } from '../constants';

interface FontSelectorProps {
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
}

const Dropdown: React.FC<{
    options: { name: string; value: string }[] | string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    renderLabel: (value: string) => React.ReactNode;
}> = ({ options, selectedValue, onSelect, renderLabel }) => {
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

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                {renderLabel(selectedValue)}
                {ICONS.chevronDown}
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30">
                    <ul className="py-1">
                        {options.map(option => {
                            const isObj = typeof option === 'object';
                            const value = isObj ? option.value : option;
                            const name = isObj ? option.name : option;
                            return (
                                <li key={value}>
                                    <button
                                        onClick={() => handleSelect(value)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-purple-600 hover:text-white"
                                        style={{ fontFamily: isObj ? value : 'inherit' }}
                                    >
                                        {name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};


export const FontSelector: React.FC<FontSelectorProps> = ({ fontFamily, setFontFamily, fontSize, setFontSize }) => {
  return (
    <div className="flex items-center gap-2">
      <Dropdown
        options={FONT_FAMILIES}
        selectedValue={fontFamily}
        onSelect={setFontFamily}
        renderLabel={(value) => (
          <span style={{ fontFamily: value }}>
            {FONT_FAMILIES.find(f => f.value === value)?.name || 'Select Font'}
          </span>
        )}
      />
      <Dropdown
        options={FONT_SIZES}
        selectedValue={fontSize}
        onSelect={setFontSize}
        renderLabel={(value) => <span>{value}</span>}
      />
    </div>
  );
};