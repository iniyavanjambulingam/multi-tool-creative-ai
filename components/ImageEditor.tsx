
import React, { useState, useCallback } from 'react';
import { Button, Select, TextArea, Spinner, Card, DownloadIcon } from './ui';
import { editImage } from '../services/geminiService';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const ImageEditor: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('realistic');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setEditedImage(null);
      setError(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError('Please upload an image and provide an edit prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const resultBase64 = await editImage(base64Image, imageFile.type, prompt, style);
      setEditedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt, style]);

  const downloadImage = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-brand-text mb-2">1. Upload Image</h3>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-brand-text-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple file:text-white hover:file:bg-purple-700"
          />
        </Card>
        <TextArea label="2. Edit Prompt" id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., add a pirate hat to the person" />
        <Select label="3. Style / Mode" id="style" value={style} onChange={e => setStyle(e.target.value)}>
          <option value="realistic">Realistic</option>
          <option value="manga">Manga</option>
          <option value="minimalist">Minimalist</option>
          <option value="pixel-art">Pixel Art</option>
        </Select>
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!imageFile || !prompt}>
          Generate Edited Image
        </Button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center text-brand-text">Results</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center min-h-[256px]">
                <h4 className="text-md font-semibold text-brand-text-light mb-2">Original</h4>
                {imagePreview ? (
                    <img src={imagePreview} alt="Original preview" className="rounded-lg max-h-64 object-contain" />
                ) : (
                    <p className="text-brand-text-light">Upload an image to see a preview</p>
                )}
            </Card>
            <Card className="flex flex-col items-center justify-center min-h-[256px]">
                <h4 className="text-md font-semibold text-brand-text-light mb-2">Edited</h4>
                {isLoading && <Spinner />}
                {editedImage && !isLoading && (
                    <div className="relative">
                        <img src={editedImage} alt="Edited result" className="rounded-lg max-h-64 object-contain" />
                         <button onClick={downloadImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity">
                            <DownloadIcon />
                         </button>
                    </div>
                )}
                {!editedImage && !isLoading && (
                    <p className="text-brand-text-light">Your edited image will appear here</p>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
