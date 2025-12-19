
import React, { useState, useCallback, useEffect } from 'react';
import { QAHistoryItem, GeminiResponse } from './types';
import { geminiService } from './services/geminiService';
import { Header } from './components/Header';
import { QuestionInput } from './components/QuestionInput';
import { AnswerDisplay } from './components/AnswerDisplay';
import { HistorySidebar } from './components/HistorySidebar';

const App: React.FC = () => {
  const [history, setHistory] = useState<QAHistoryItem[]>([]);
  const [currentQuery, setCurrentQuery] = useState<{ question: string; response: GeminiResponse | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuery({ question, response: null });

    try {
      const response = await geminiService.askQuestion(question);
      
      const newItem: QAHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        question,
        answer: response.text,
        sources: response.sources,
        timestamp: new Date()
      };

      setCurrentQuery({ question, response });
      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const selectHistoryItem = (item: QAHistoryItem) => {
    setCurrentQuery({
      question: item.question,
      response: {
        text: item.answer,
        sources: item.sources
      }
    });
    // Scroll to top of response area on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearCurrent = () => {
    setCurrentQuery(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onNewChat={clearCurrent} />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar - Hidden on small mobile but can be toggled if needed */}
        <aside className="w-full md:w-80 flex-shrink-0 order-2 md:order-1">
          <HistorySidebar 
            items={history} 
            onSelectItem={selectHistoryItem} 
            activeId={null} 
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col gap-6 order-1 md:order-2">
          {!currentQuery && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 max-w-md">Ask any complex question and get a research-backed answer using advanced NLP techniques.</p>
            </div>
          )}

          {(currentQuery || isLoading) && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">User Question</div>
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-800 leading-tight">
                    {currentQuery?.question}
                  </h1>
                </div>

                <div className="h-px bg-slate-100 mb-6"></div>

                {isLoading ? (
                  <div className="flex flex-col space-y-4 py-4">
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                ) : (
                  <AnswerDisplay 
                    text={currentQuery?.response?.text || ""} 
                    sources={currentQuery?.response?.sources || []} 
                  />
                )}
              </div>
            </div>
          )}

          <div className="sticky bottom-4 md:bottom-8 mt-auto">
            <QuestionInput onAsk={handleAskQuestion} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
