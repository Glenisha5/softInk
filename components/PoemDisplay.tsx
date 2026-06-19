
import React from 'react';
import { PoemResponse, Language } from '../types';

interface PoemDisplayProps {
  poem: PoemResponse;
  language: Language;
  onReset: () => void;
  isLoading: boolean;
}

export const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, language, onReset, isLoading }) => {
  // Prevent text copying
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-neutral-500">
        <div className="w-12 h-12 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mb-4" />
        <p className="italic font-serif-heading text-lg">Brewing some verses for you...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <button 
        onClick={onReset}
        className="mb-8 flex items-center text-neutral-400 hover:text-neutral-800 transition-colors group print:hidden"
      >
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Titles
      </button>

      <article 
        className="bg-white p-12 md:p-20 shadow-2xl rounded-sm border border-neutral-100 relative overflow-hidden ink-bleed select-none"
        onCopy={handleCopy}
        onCut={handleCopy}
        onContextMenu={handleContextMenu}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-neutral-100 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-neutral-100 pointer-events-none" />
        
        <header className="mb-12 text-center">
          <h1 className={`text-4xl md:text-5xl font-serif-heading text-neutral-800 mb-4 ${language === 'Hindi' ? 'font-hindi' : ''}`}>
            {poem.title}
          </h1>
          <div className="w-12 h-px bg-neutral-300 mx-auto" />
          <p className="mt-4 text-neutral-600 font-semibold text-lg print:text-xl print:text-black print:font-bold">
            By {poem.author}
          </p>
        </header>

        <div className={`whitespace-pre-line text-lg md:text-xl leading-relaxed text-neutral-700 font-serif mb-16 text-center italic ${language === 'Hindi' ? 'font-hindi' : ''}`}>
          {poem.content}
        </div>

        {poem.meaning && (
          <footer className="pt-12 border-t border-neutral-50">
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-4 text-center">About this Verse</h4>
            <p className="text-sm text-neutral-500 text-center leading-relaxed">
              {poem.meaning}
            </p>
          </footer>
        )}

        {/* Print-only footer with author attribution */}
        <footer className="hidden print:block pt-8 mt-8 border-t-2 border-neutral-800">
          <p className="text-center text-base font-bold text-black">
            Written by {poem.author}
          </p>
          <p className="text-center text-sm text-neutral-700 mt-2">
            © All rights reserved. Please credit the author when sharing.
          </p>
        </footer>
      </article>

      <div className="mt-12 flex justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="px-8 py-3 border border-neutral-200 text-neutral-500 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-300 rounded-full text-sm font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Keep it forever
        </button>
      </div>
    </div>
  );
};
