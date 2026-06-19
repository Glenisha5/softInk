
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language | null;
  onSelect: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <h2 className="text-3xl font-serif-heading mb-8 text-neutral-800">Select your tongue</h2>
      <div className="flex gap-8">
        <button
          onClick={() => onSelect('English')}
          className={`group relative overflow-hidden px-10 py-16 w-48 rounded-xl transition-all duration-500 border-2 ${
            selectedLanguage === 'English' 
              ? 'border-neutral-800 bg-neutral-800 text-white shadow-xl' 
              : 'border-neutral-200 hover:border-neutral-400 bg-white'
          }`}
        >
          <span className="text-4xl block mb-2 transition-transform group-hover:scale-110">A</span>
          <span className="text-xl font-serif-heading">English</span>
        </button>

        <button
          onClick={() => onSelect('Hindi')}
          className={`group relative overflow-hidden px-10 py-16 w-48 rounded-xl transition-all duration-500 border-2 ${
            selectedLanguage === 'Hindi' 
              ? 'border-neutral-800 bg-neutral-800 text-white shadow-xl' 
              : 'border-neutral-200 hover:border-neutral-400 bg-white'
          }`}
        >
          <span className="text-4xl block mb-2 transition-transform group-hover:scale-110 font-hindi">अ</span>
          <span className="text-xl font-hindi">हिन्दी</span>
        </button>
      </div>
    </div>
  );
};
