import React, { useState, useCallback } from 'react';
import { InputArea } from './components/InputArea';
import { Loader } from './components/Loader';
import { ArticleCard } from './components/ArticleCard';
import { ImagePromptCard } from './components/ImagePromptCard';
import { generateContent, generateImage } from './services/geminiService';
import type { GeneratedContent } from './types';
import { Bot, Link, FileText, ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = useCallback(async (inputType: 'url' | 'text', value: string) => {
    if (!value) {
      setError('請輸入有效的網址或文字內容。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // Step 1: Generate text content and image prompt
      const textResult = await generateContent(inputType, value);
      
      // Step 2: Generate image using the prompt
      const imageResult = await generateImage(textResult.imagePrompt);

      // Step 3: Set all content at once
      setGeneratedContent({ ...textResult, generatedImage: imageResult });

    } catch (e: any) {
      console.error(e);
      setError(`內容生成失敗: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const WelcomeMessage: React.FC = () => (
    <div className="text-center p-10 bg-slate-800/50 rounded-lg border border-slate-700">
      <Bot className="mx-auto h-16 w-16 text-indigo-400 mb-4" />
      <h2 className="text-2xl font-bold text-slate-100">ccreator : AI 內容合成器</h2>
      <p className="mt-2 text-slate-400">
        輸入一個網址或貼上文字，AI 將為您分析內容並生成部落格文章、簡報文件和圖片提示。
      </p>
    </div>
  );

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
           <InputArea onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
       
        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">錯誤!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <div className="mt-8">
          {isLoading ? (
            <Loader />
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
          ) : !error && (
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