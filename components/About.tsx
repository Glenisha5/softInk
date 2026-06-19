import React from 'react';

interface AboutProps {
  onClose: () => void;
}

export const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <button
        onClick={onClose}
        className="mb-8 flex items-center text-neutral-400 hover:text-neutral-800 transition-colors group"
      >
        <svg
          className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </button>

      <article className="bg-white p-12 md:p-20 shadow-2xl rounded-sm border border-neutral-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-neutral-100 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-neutral-100 pointer-events-none" />

        {/* About softInk */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif-heading text-neutral-800 mb-4">
            About softInk
          </h1>
          <div className="w-12 h-px bg-neutral-300 mx-auto" />
        </header>

        <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
          <p className="first-letter:text-5xl first-letter:font-serif-heading first-letter:float-left first-letter:mr-3 first-letter:mt-1">
            Welcome to <span className="font-serif-heading italic">softInk</span>, 
            a space where emotions meet words. Created for poetry lovers and dreamers, 
            <span className="font-serif-heading italic"> softInk</span> brings together 
            thoughts, feelings, and stories through beautifully written poems. Every piece 
            shared here is inspired by real emotions, quiet moments, and the beauty hidden 
            in everyday life. The name 
            <span className="font-serif-heading italic"> softInk</span> reflects gentle 
            expression — emotions flowing softly through ink and words.
          </p>
        </div>

        {/* About Author */}
        <header className="mt-20 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif-heading text-neutral-800 mb-4">
            About Author
          </h1>
          <div className="w-12 h-px bg-neutral-300 mx-auto" />
        </header>

        <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
          <p className="first-letter:text-5xl first-letter:font-serif-heading first-letter:float-left first-letter:mr-3 first-letter:mt-1">
            Hi, I'm an engineer with a passion for poetry. While engineering taught me logic, 
            innovation, and problem-solving, poetry became my way of expressing emotions beyond 
            formulas and code.
            
            <br />
            <br />

            Through softInk, I share poems that capture feelings, memories, love, silence, 
            and life’s little moments. Writing poetry allows me to connect imagination with 
            emotion, creating a balance between technology and art.
          </p>
        </div>

      </article>
    </div>
  );
};