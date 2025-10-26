
import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

interface ImagePromptCardProps {
  title: string;
  prompt: string;
  icon: React.ReactNode;
  imageData?: string;
}

export const ImagePromptCard: React.FC<ImagePromptCardProps> = ({ title, prompt, icon, imageData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (imageData) {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${imageData}`;
      link.download = 'generated-image.jpeg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-2xl font-bold text-indigo-400 flex items-center">
          {icon}
          {title}
        </h3>
      </div>
      <div className="p-6 flex-grow flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-400 mb-2">生成提示 (Prompt)</h4>
          <div className="relative">
            <p className="text-slate-300 italic bg-slate-900/50 p-4 pr-12 rounded-md border border-slate-600 text-sm">
              {prompt}
            </p>
            <button
              onClick={handleCopy}
              className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-slate-300 hover:text-white"
              aria-label="Copy prompt"
            >
              {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {imageData && (
          <div className="flex-grow flex flex-col gap-4">
             <h4 className="text-sm font-semibold text-slate-400 mb-2">生成圖片</h4>
            <div className="w-full aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                src={`data:image/jpeg;base64,${imageData}`} 
                alt={prompt}
                className="w-full h-full object-cover"
                />
            </div>
            <button
              onClick={handleDownloadImage}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 ease-in-out flex items-center justify-center transform hover:scale-105"
            >
              <Download className="h-5 w-5 mr-2" />
              下載圖片
            </button>
          </div>
        )}
      </div>
    </div>
  );
};