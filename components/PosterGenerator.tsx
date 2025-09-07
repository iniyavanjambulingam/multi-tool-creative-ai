
import React, { useState, useCallback } from 'react';
import { Button, Select, TextArea, Spinner, Card, DownloadIcon } from './ui';
import { generatePoster } from '../services/geminiService';

const PosterGenerator: React.FC = () => {
  const [posterText, setPosterText] = useState<string>('');
  const [style, setStyle] = useState<string>('minimalist');
  const [colorTheme, setColorTheme] = useState<string>('monochrome');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!posterText) {
      setError('Please provide text for the poster.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPoster(null);

    try {
      const resultBase64 = await generatePoster(posterText, style, colorTheme);
      setGeneratedPoster(`data:image/png;base64,${resultBase64}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [posterText, style, colorTheme]);

  const downloadImage = () => {
    if (!generatedPoster) return;
    const link = document.createElement('a');
    link.href = generatedPoster;
    link.download = 'poster-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <TextArea label="1. Poster Text" id="posterText" value={posterText} onChange={e => setPosterText(e.target.value)} placeholder="e.g., Summer Music Festival" />
        <Select label="2. Style" id="style" value={style} onChange={e => setStyle(e.target.value)}>
          <option value="minimalist">Minimalist</option>
          <option value="vintage">Vintage</option>
          <option value="futuristic">Futuristic</option>
          <option value="grunge">Grunge</option>
        </Select>
        <Select label="3. Color Theme" id="colorTheme" value={colorTheme} onChange={e => setColorTheme(e.target.value)}>
          <option value="monochrome">Monochrome</option>
          <option value="vibrant-pastels">Vibrant Pastels</option>
          <option value="neon">Neon</option>
          <option value="earth-tones">Earth Tones</option>
        </Select>
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!posterText}>
          Generate Poster
        </Button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-center text-brand-text mb-4">Result</h3>
        <Card className="flex items-center justify-center min-h-[400px] aspect-[3/4]">
          {isLoading ? <Spinner /> : (
            <div 
              className="relative w-full h-full bg-cover bg-center rounded-lg flex items-center justify-center text-center p-4" 
              style={{ backgroundImage: generatedPoster ? `url(${generatedPoster})` : 'none' }}
            >
              {generatedPoster ? (
                <>
                  <h2 className="text-4xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>{posterText}</h2>
                   <button onClick={downloadImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity" title="Download Background Image">
                      <DownloadIcon />
                  </button>
                </>
              ) : (
                <p className="text-brand-text-light">Your poster will appear here.</p>
              )}
            </div>
          )}
        </Card>
        <p className="text-center text-xs text-brand-text-light mt-2">Text is overlaid on the client-side for clarity. You can right-click to save the final poster, or use the button to download the generated background.</p>
      </div>
    </div>
  );
};

export default PosterGenerator;
