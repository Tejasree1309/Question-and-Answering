
import React, { useState, useRef, useEffect } from 'react';

interface QuestionInputProps {
  onAsk: (question: string) => void;
  isLoading: boolean;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({ onAsk, isLoading }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onAsk(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full group">
      <div className="relative flex items-end bg-white border-2 border-slate-200 rounded-2xl shadow-lg focus-within:border-blue-500 transition-all p-2 pr-4 pl-4 overflow-hidden group-hover:border-slate-300">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here (e.g. How does quantum entanglement work?)"
          className="flex-grow bg-transparent border-none focus:ring-0 resize-none py-3 text-slate-700 placeholder-slate-400 max-h-[200px] leading-relaxed"
          rows={1}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={`mb-1 p-2 rounded-xl transition-all ${
            value.trim() && !isLoading 
            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
      <div className="mt-2 text-center text-xs text-slate-400 font-medium">
        Press <span className="px-1 border border-slate-200 rounded">Enter</span> to send
      </div>
    </form>
  );
};
