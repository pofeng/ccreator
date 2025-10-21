import React, { useState } from 'react';
import { Link, Type } from 'lucide-react';

interface InputAreaProps {
  onGenerate: (inputType: 'url' | 'text', value: string) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'url') {
      onGenerate('url', url);
    } else {
      onGenerate('text', text);
    }
  };

  const tabButtonClasses = (tabName: 'url' | 'text') => 
    `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 ${
      activeTab === tabName 
        ? 'bg-slate-700 text-white' 
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`;

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800/60 rounded-xl shadow-lg border border-slate-700">
      <div className="flex border-b border-slate-700 px-2 pt-2">
        <button onClick={() => setActiveTab('url')} className={tabButtonClasses('url')}>
          <Link className="h-4 w-4" />
          從網址
        </button>
        <button onClick={() => setActiveTab('text')} className={tabButtonClasses('text')}>
          <Type className="h-4 w-4" />
          從文字
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-grow">
          {activeTab === 'url' ? (
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="請在此貼上網址..."
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow h-full"
              disabled={isLoading}
              required
            />
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="請在此貼上純文字內容..."
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
              rows={5}
              disabled={isLoading}
              required
            />
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 self-center sm:self-auto"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              處理中...
            </>
          ) : (
            '生成內容'
          )}
        </button>
      </form>
    </div>
  );
};