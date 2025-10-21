import React from 'react';

interface ArticleCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ title, content, icon }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-hidden h-full flex flex-col">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center">
          {icon}
          {title}
        </h3>
      </div>
      <div className="px-6 pb-6 flex-grow">
         <div
           className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed"
           dangerouslySetInnerHTML={{ __html: content }}
         />
      </div>
    </div>
  );
};
