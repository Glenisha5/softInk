import React from 'react';
import { Language, PoemResponse } from '../types';

interface PoemLibraryProps {
  language: Language;
  poems: PoemResponse[];
  onSelectPoem: (poem: PoemResponse) => void;
}


export const PoemLibrary: React.FC<PoemLibraryProps> = ({ language, poems, onSelectPoem }) => {
  const pageTitle = language === 'English' ? 'English Poems' : 'हिंदी कविता';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className={`text-4xl font-serif-heading text-neutral-800 mb-2 ${language === 'Hindi' ? 'font-hindi' : ''}`}>
          {pageTitle}
        </h2>
        <p className="text-neutral-500 italic">
          {language === 'English'
            ? 'Pick a title to open the full poem'
            : 'किसी शीर्षक पर क्लिक करके पूरी कविता खोलें'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {poems.map((poem) => (
          <button
            key={`${language}-${poem.title}`}
            type="button"
            onClick={() => onSelectPoem(poem)}
            className="group rounded-2xl border border-neutral-100 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-neutral-200"
          >
            <div className={`text-xl font-serif-heading text-neutral-800 mb-2 ${language === 'Hindi' ? 'font-hindi' : ''}`}>
              {poem.title}
            </div>
            <p className="text-sm text-neutral-500 line-clamp-2">
              {poem.content.slice(0, 110).replace(/\s+/g, ' ')}...
            </p>
            <div className="mt-4 text-xs uppercase tracking-widest text-neutral-400 group-hover:text-neutral-800 transition-colors">
              By {poem.author}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};