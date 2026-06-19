import React, { useEffect, useState } from 'react';
import { Language, PoemResponse } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { PoemLibrary } from './components/PoemLibrary';
import { PoemDisplay } from './components/PoemDisplay';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Login } from './components/Login';
import { fetchPoemsByLanguage } from './services/poemService';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

type View = 'home' | 'about' | 'contact' | 'login';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<PoemResponse | null>(null);
  const [pendingPoem, setPendingPoem] = useState<PoemResponse | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [poems, setPoems] = useState<PoemResponse[]>([]);
  const [isLoadingPoems, setIsLoadingPoems] = useState(false);
  const [poemError, setPoemError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const handleLogin = (tok: string, user: string) => {
    setToken(tok);
    setUsername(user);
    if (pendingPoem) {
      setSelectedPoem(pendingPoem);
      setPendingPoem(null);
    }
    setCurrentView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setPendingPoem(null);
    handleBackToHome();
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setSelectedPoem(null);
    setPoems([]);
    setPoemError(null);
    setCurrentView('home');
  };

  const handlePoemSelect = (poem: PoemResponse) => {
    if (token) {
      setSelectedPoem(poem);
      return;
    }

    setPendingPoem(poem);
    setCurrentView('login');
  };

  const handleReset = () => {
    setSelectedPoem(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setLanguage(null);
    setSelectedPoem(null);
    setPendingPoem(null);
    setPoems([]);
    setPoemError(null);
  };

  useEffect(() => {
    if (!language || currentView !== 'home') return;

    let isActive = true;

    const loadPoems = async () => {
      setIsLoadingPoems(true);
      setPoemError(null);
      try {
        const fetchedPoems = await fetchPoemsByLanguage(language.toLowerCase());
        if (!isActive) return;
        setPoems(fetchedPoems);
      } catch (error) {
        if (!isActive) return;
        setPoemError(error instanceof Error ? error.message : 'Failed to load poems');
        setPoems([]);
      } finally {
        if (isActive) setIsLoadingPoems(false);
      }
    };

    void loadPoems();
    return () => { isActive = false; };
  }, [language, currentView]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-8 px-8 border-b border-neutral-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50 print:hidden">
        <div className="flex flex-col cursor-pointer" onClick={handleBackToHome}>
          <span className="text-2xl font-serif-heading tracking-tight text-neutral-800">softInk</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Crafted with soul</span>
        </div>

        <nav className="flex gap-6 items-center">
          {currentView === 'home' && language && (
            <>
              <button
                onClick={() => setLanguage(null)}
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors"
              >
                Languages
              </button>
              <div className="h-4 w-px bg-neutral-200" />
              <span className={`text-sm font-medium text-neutral-800 ${language === 'Hindi' ? 'font-hindi' : 'font-serif'}`}>
                {language}
              </span>
              <div className="h-4 w-px bg-neutral-200" />
            </>
          )}
          <button
            onClick={() => setCurrentView('about')}
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => setCurrentView('contact')}
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            Contact
          </button>
          {token && (
            <>
              <div className="h-4 w-px bg-neutral-200" />
              <span className="text-xs text-neutral-500">Hi, {username}</span>
              <button
                onClick={handleLogout}
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        {currentView === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            {currentView === 'about' && <About onClose={handleBackToHome} />}
            {currentView === 'contact' && <Contact onClose={handleBackToHome} />}

            {currentView === 'home' && !language && (
              <div className="max-w-4xl mx-auto mt-20 text-center px-4">
                <div className="mb-12 animate-in fade-in duration-1000">
                  <h1 className="text-6xl md:text-8xl font-serif-heading text-neutral-800 mb-6">
                    Where words <br /> find their <span className="italic">home</span>.
                  </h1>
                  <p className="text-neutral-500 text-lg max-w-lg mx-auto leading-relaxed">
                    Here, poems rest—written across time, in English and Hindi.
                  </p>
                </div>
                <LanguageSelector selectedLanguage={language} onSelect={handleLanguageSelect} />
              </div>
            )}

            {currentView === 'home' && language && !selectedPoem && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {isLoadingPoems && (
                  <div className="max-w-6xl mx-auto px-4 py-12 text-center text-neutral-500 italic">
                    Loading poems from the database...
                  </div>
                )}
                {poemError && (
                  <div className="max-w-6xl mx-auto px-4 py-12 text-center text-red-500">
                    {poemError}
                  </div>
                )}
                {!isLoadingPoems && !poemError && (
                  <PoemLibrary language={language} poems={poems} onSelectPoem={handlePoemSelect} />
                )}
              </div>
            )}

            {currentView === 'home' && selectedPoem && language && (
              <div className="animate-in fade-in duration-500">
                <PoemDisplay
                  poem={selectedPoem}
                  language={language}
                  onReset={handleReset}
                  isLoading={false}
                />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-12 border-t border-neutral-100 mt-20">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} softInk. Crafted with soul.</p>
          <div className="flex gap-8 mt-4 md:mt-0 italic font-serif">
            <span>Ink</span>
            <span>Paper</span>
            <span>Soul</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;