
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we'll throw an error if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImage = async (base64Image: string, mimeType: string, prompt: string, style: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType: mimeType } },
                { text: `Modify the uploaded image according to: "${prompt}". Style: ${style}. Preserve main objects unless instructed to change. Maintain realistic lighting and perspective.` },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image was generated in the response.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. Please check the console for details.");
  }
};

export const generateStorybookPage = async (pageText: string, style: string): Promise<string> => {
    try {
        const fullPrompt = `Generate a comic panel from the following story page: "${pageText}". Style: ${style}. The image should not contain any text. The image should be visually appealing for a children's storybook.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/png' },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("No storybook page was generated.");
    } catch (error) {
        console.error("Error generating storybook page:", error);
        throw new Error("Failed to generate storybook page. Please check the console for details.");
    }
};

export const generatePoster = async (text: string, style: string, colorTheme: string): Promise<string> => {
    try {
        const fullPrompt = `Generate a visually striking poster background. The poster text will be "${text}". The style should be: ${style}. The color theme should be: ${colorTheme}. The design must be high-impact, focusing on composition and readability, leaving appropriate space for the text to be overlaid later. Do NOT include the text in the image.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/png' },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("No poster was generated.");
    } catch (error) {
        console.error("Error generating poster:", error);
        throw new Error("Failed to generate poster. Please check the console for details.");
    }
};

export const generateMemeBackground = async (caption: string, style: string): Promise<string> => {
    try {
        const fullPrompt = `Generate a funny or expressive image that would work as a meme background for the caption: "${caption}". Style: ${style}. The image must leave ample clear space for text overlay. Do NOT include any text in the image itself. The image should be humorous and relatable.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/png' },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("No meme background was generated.");
    } catch (error) {
        console.error("Error generating meme background:", error);
        throw new Error("Failed to generate meme background. Please check the console for details.");
    }
};
