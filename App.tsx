
import React, { useState, useMemo } from 'react';
import { Tab } from './types';
import ImageEditor from './components/ImageEditor';
import StorybookGenerator from './components/StorybookGenerator';
import PosterGenerator from './components/PosterGenerator';
import MemeGenerator from './components/MemeGenerator';
import { EditIcon, BookIcon, PosterIcon, MemeIcon } from './components/ui';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ImageEditor);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.ImageEditor:
        return <ImageEditor />;
      case Tab.Storybook:
        return <StorybookGenerator />;
      case Tab.Poster:
        return <PosterGenerator />;
      case Tab.Meme:
        return <MemeGenerator />;
      default:
        return null;
    }
  };

  const tabs = useMemo(() => [
    { name: Tab.ImageEditor, icon: <EditIcon /> },
    { name: Tab.Storybook, icon: <BookIcon /> },
    { name: Tab.Poster, icon: <PosterIcon /> },
    { name: Tab.Meme, icon: <MemeIcon /> },
  ], []);

  return (
    <div className="min-h-screen bg-brand-bg-dark font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          Gemini Creative Suite
        </h1>
        <p className="text-brand-text-light mt-2 text-lg">Your AI-powered toolkit for digital creation.</p>
      </header>
      
      <main className="w-full max-w-6xl flex-grow">
        <div className="mb-6 border-b border-brand-border">
          <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  ${activeTab === tab.name
                    ? 'border-brand-purple text-brand-purple'
                    : 'border-transparent text-brand-text-light hover:text-brand-text hover:border-gray-500'
                  }
                  group inline-flex items-center py-4 px-1 sm:px-4 border-b-2 font-medium text-sm transition-all duration-200
                `}
              >
                <span className="w-5 h-5 mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-brand-bg-light p-6 sm:p-8 rounded-lg shadow-2xl border border-brand-border">
          {renderContent()}
        </div>
      </main>

      <footer className="w-full max-w-6xl mt-8 text-center text-brand-text-light text-sm">
        <p>&copy; {new Date().getFullYear()} Gemini Creative Suite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
