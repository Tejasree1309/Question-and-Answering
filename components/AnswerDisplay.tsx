
import React from 'react';
import { GroundingSource } from '../types';

interface AnswerDisplayProps {
  text: string;
  sources: GroundingSource[];
}

// Simple manual markdown-to-html converter (or can use a library like marked/react-markdown)
const formatMarkdown = (text: string) => {
  // Simple transformations for core needs: Bold, Italics, Lists, Code
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm text-blue-600 font-mono">$1</code>')
    .replace(/\n/g, '<br />');

  return { __html: html };
};

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ text, sources }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-grow">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">NLP Engine Output</div>
          <div 
            className="text-slate-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={formatMarkdown(text)}
          />
        </div>
      </div>

      {sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Sources & Grounding
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl transition-all"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-700">{source.title}</p>
                  <p className="text-xs text-slate-400 truncate">{new URL(source.uri).hostname}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
