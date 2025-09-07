import React, { useState, useCallback } from 'react';
import { Button, Select, TextArea, Spinner, Card, DownloadIcon } from './ui';
import { generateMemeBackground } from '../services/geminiService';

const MemeGenerator: React.FC = () => {
  const [caption, setCaption] = useState<string>('');
  const [style, setStyle] = useState<string>('photorealistic');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!caption) {
      setError('Please provide a caption for the meme.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateMemeBackground(caption, style);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [caption, style]);
  
  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'meme-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <TextArea label="1. Dialogue / Caption" id="caption" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g., One does not simply..." />
        <Select label="2. Style" id="style" value={style} onChange={e => setStyle(e.target.value)}>
          <option value="photorealistic">Photorealistic</option>
          <option value="cartoon">Cartoon</option>
          <option value="surreal">Surreal</option>
          <option value="vintage-photo">Vintage Photo</option>
        </Select>
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!caption}>
          Generate Meme
        </Button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-center text-brand-text mb-4">Result</h3>
        <Card className="flex items-center justify-center min-h-[400px] aspect-video">
          {isLoading ? <Spinner /> : (
            <div 
              className="relative w-full h-full bg-cover bg-center rounded-lg flex flex-col justify-center items-center text-center p-4" 
              style={{ backgroundImage: generatedImage ? `url(${generatedImage})` : 'none' }}
            >
              {generatedImage ? (
                <>
                  {/* FIX: Removed invalid 'textStroke' CSS property from inline style. */}
                  <h2 
                    className="text-3xl font-bold text-white uppercase" 
                    style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '2px black', letterSpacing: '1px' }}
                  >
                    {caption}
                  </h2>
                   <button onClick={downloadImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity" title="Download Background Image">
                    <DownloadIcon />
                  </button>
                </>
              ) : (
                <p className="text-brand-text-light">Your meme will appear here.</p>
              )}
            </div>
          )}
        </Card>
        <p className="text-center text-xs text-brand-text-light mt-2">Text is overlaid for presentation. Right-click to save the final meme, or use the button to download the generated background.</p>
      </div>
    </div>
  );
};

export default MemeGenerator;