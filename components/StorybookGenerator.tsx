
import React, { useState, useCallback } from 'react';
import { Button, Select, TextArea, Spinner, Card, DownloadIcon } from './ui';
import { generateStorybookPage } from '../services/geminiService';

const StorybookGenerator: React.FC = () => {
  const [storyText, setStoryText] = useState<string>('');
  const [style, setStyle] = useState<string>('whimsical-cartoon');
  const [numPages, setNumPages] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPages, setGeneratedPages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const splitStory = (text: string, pages: number): string[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < pages) {
        return sentences.map(s => s.trim());
    }
    const sentencesPerPage = Math.ceil(sentences.length / pages);
    const chunks: string[] = [];
    for (let i = 0; i < pages; i++) {
        const start = i * sentencesPerPage;
        const end = start + sentencesPerPage;
        chunks.push(sentences.slice(start, end).join(' ').trim());
    }
    return chunks.filter(chunk => chunk.length > 0);
  };

  const handleGenerate = useCallback(async () => {
    if (!storyText) {
      setError('Please provide some story text.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPages([]);

    try {
      const storyChunks = splitStory(storyText, numPages);
      if (storyChunks.length === 0) {
        throw new Error("Could not split story into pages. Please provide more text.");
      }
      
      const pagePromises = storyChunks.map(chunk => generateStorybookPage(chunk, style));
      const results = await Promise.all(pagePromises);
      setGeneratedPages(results.map(base64 => `data:image/png;base64,${base64}`));

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [storyText, style, numPages]);
  
  const downloadImage = (base64Image: string, index: number) => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = `storybook-page-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <TextArea label="1. Story Text" id="story" value={storyText} onChange={e => setStoryText(e.target.value)} placeholder="Write a short story here..." rows={10} />
        <Select label="2. Illustration Style" id="style" value={style} onChange={e => setStyle(e.target.value)}>
          <option value="whimsical-cartoon">Whimsical Cartoon</option>
          <option value="watercolor">Watercolor</option>
          <option value="storybook-illustration">Classic Storybook</option>
          <option value="anime">Anime</option>
        </Select>
        <Select label="3. Number of Pages" id="pages" value={numPages} onChange={e => setNumPages(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </Select>
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!storyText}>
          Generate Storybook
        </Button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-xl font-semibold text-center text-brand-text mb-4">Generated Pages</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
            <p className="ml-4">Generating your storybook pages...</p>
          </div>
        ) : generatedPages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {generatedPages.map((page, index) => (
              <Card key={index} className="relative group">
                <img src={page} alt={`Page ${index + 1}`} className="rounded-md w-full h-auto aspect-square object-cover"/>
                <button onClick={() => downloadImage(page, index)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <DownloadIcon />
                </button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center min-h-[256px]">
            <p className="text-brand-text-light">Your storybook pages will appear here.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StorybookGenerator;
