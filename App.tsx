
import React, { useState, useCallback } from 'react';
import { InputArea } from './components/InputArea';
import { Loader } from './components/Loader';
import { ArticleCard } from './components/ArticleCard';
import { ImagePromptCard } from './components/ImagePromptCard';
import { generateContent, generateImage, generateImagePromptFromText } from './services/geminiService'; // Import new service function
import type { GeneratedContent } from './types';
import { Bot, Link, FileText, ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [isGeneratingImagePrompt, setIsGeneratingImagePrompt] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentImagePrompt, setCurrentImagePrompt] = useState<string>(''); // For editable prompt in 'image-gen' tab
  const [generatedImageFromPromptTab, setGeneratedImageFromPromptTab] = useState<string | undefined>(undefined); // For image from '文生圖' tab

  // Handles URL/Text -> Blog/Briefing/ImagePrompt+Image flow
  const handleGenerateContent = useCallback(async (inputType: 'url' | 'text', value: string) => {
    if (!value) {
      setError('請輸入有效的網址或文字內容。');
      return;
    }
    setIsLoadingContent(true);
    setError(null);
    setGeneratedContent(null); // Clear previous full content
    setCurrentImagePrompt(''); // Clear image prompt from other tab
    setGeneratedImageFromPromptTab(undefined); // Clear image from other tab

    try {
      // Step 1: Generate text content and image prompt
      const textResult = await generateContent(inputType, value);
      setCurrentImagePrompt(textResult.imagePrompt); // Also set currentImagePrompt for potential reuse

      // Step 2: Generate image using the prompt
      const imageResult = await generateImage(textResult.imagePrompt);

      // Step 3: Set all content at once
      setGeneratedContent({ ...textResult, generatedImage: imageResult });

    } catch (e: any) {
      console.error(e);
      setError(`內容生成失敗: ${e.message}`);
    } finally {
      setIsLoadingContent(false);
    }
  }, []);

  // Handles Text -> Image Prompt flow (for '文生圖' tab)
  const handleGenerateImagePrompt = useCallback(async (text: string) => {
    if (!text) {
      setError('請輸入文字內容以生成圖像提示詞。');
      return;
    }
    setIsGeneratingImagePrompt(true);
    setError(null);
    setGeneratedContent(null); // Clear other content
    setGeneratedImageFromPromptTab(undefined); // Clear previous image

    try {
      const prompt = await generateImagePromptFromText(text);
      setCurrentImagePrompt(prompt); // Set the generated prompt to the editable box

      // Immediately generate image after generating prompt
      setIsGeneratingImage(true);
      const imageData = await generateImage(prompt);
      setGeneratedImageFromPromptTab(imageData);

    } catch (e: any) {
      console.error(e);
      setError(`圖像提示詞生成失敗: ${e.message}`);
    } finally {
      setIsGeneratingImagePrompt(false);
      // Ensure image generation loading state is reset, regardless of whether
      // an error occurred during prompt or image generation.
      setIsGeneratingImage(false);
    }
  }, []);

  // Handles Prompt -> Image flow (from the editable prompt box in '文生圖' tab)
  const handleGenerateImageFromSpecificPrompt = useCallback(async (prompt: string) => {
    if (!prompt) {
      setError('請輸入圖像提示詞。');
      return;
    }
    setIsGeneratingImage(true);
    setError(null);
    setGeneratedContent(null); // Clear other content
    setGeneratedImageFromPromptTab(undefined); // Clear previous image

    try {
      const imageData = await generateImage(prompt);
      setGeneratedImageFromPromptTab(imageData);
    } catch (e: any) {
      console.error(e);
      setError(`圖像生成失敗: ${e.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);

  const WelcomeMessage: React.FC = () => (
    <div className="text-center p-10 bg-slate-800/50 rounded-lg border border-slate-700">
      <Bot className="mx-auto h-16 w-16 text-indigo-400 mb-4" />
      <h2 className="text-2xl font-bold text-slate-100">ccreator : AI 內容合成器</h2>
      <p className="mt-2 text-slate-400">
        輸入一個網址或貼上文字，AI 將為您分析內容並生成部落格文章、簡報文件和圖片提示。您也可以直接從文字生成圖像。
      </p>
    </div>
  );

  const showLoader = isLoadingContent || isGeneratingImagePrompt || isGeneratingImage;
  const showWelcome = !showLoader && !generatedContent && !generatedImageFromPromptTab && !error;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            ccreator : AI 內容合成器
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            從任何網頁文章或文字內容中即時生成多種格式的內容。
          </p>
        </header>

        <div className="sticky top-0 z-10 py-4 bg-slate-900/80 backdrop-blur-sm">
           <InputArea 
             onGenerateContent={handleGenerateContent}
             onGenerateImagePrompt={handleGenerateImagePrompt}
             onGenerateImageFromPrompt={handleGenerateImageFromSpecificPrompt}
             isLoadingContent={isLoadingContent}
             isGeneratingImagePrompt={isGeneratingImagePrompt}
             isGeneratingImage={isGeneratingImage}
             generatedImagePrompt={currentImagePrompt}
           />
        </div>
       
        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">錯誤!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <div className="mt-8">
          {showLoader ? (
            <Loader 
              message={isGeneratingImagePrompt ? "AI 正在生成圖像提示詞..." : isGeneratingImage ? "AI 正在生成圖像..." : "AI 正在分析並生成內容..."}
              subMessage={isGeneratingImagePrompt ? "正在根據文字生成最佳圖像提示詞，請稍候。" : isGeneratingImage ? "正在使用提示詞生成圖像，這可能需要一些時間。" : "正在分析網頁並生成內容，請稍候。"}
            />
          ) : generatedContent ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2">
                <ArticleCard 
                  title="部落格文章" 
                  content={generatedContent.blogPost}
                  icon={<FileText className="h-6 w-6 mr-3 text-indigo-400" />}
                />
              </div>
              <ArticleCard 
                title="簡報文件" 
                content={generatedContent.briefingDocument}
                icon={<Link className="h-6 w-6 mr-3 text-indigo-400" />}
              />
              <ImagePromptCard 
                title="Imagen 圖片生成" 
                prompt={generatedContent.imagePrompt}
                imageData={generatedContent.generatedImage}
                icon={<ImageIcon className="h-6 w-6 mr-3 text-indigo-400" />}
              />
            </div>
          ) : (generatedImageFromPromptTab || currentImagePrompt) ? ( // Display ImagePromptCard if we have an image or a prompt from the new tab
             <ImagePromptCard
               title="Imagen 圖片生成"
               prompt={currentImagePrompt} // Always use currentImagePrompt for this path
               imageData={generatedImageFromPromptTab} // Always use generatedImageFromPromptTab for this path
               icon={<ImageIcon className="h-6 w-6 mr-3 text-indigo-400" />}
             />
          ) : showWelcome && (
            <WelcomeMessage />
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini & Imagen</p>
      </footer>
    </div>
  );
};

export default App;