
import React from 'react';
import { QAHistoryItem } from '../types';

interface HistorySidebarProps {
  items: QAHistoryItem[];
  onSelectItem: (item: QAHistoryItem) => void;
  activeId: string | null;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ items, onSelectItem, activeId }) => {
  return (
    <div className="flex flex-col h-full bg-white md:bg-transparent rounded-2xl overflow-hidden md:overflow-visible">
      <div className="p-4 md:px-0 md:pt-0">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Search History</h3>
        
        {items.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center opacity-60">
            <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-slate-500 font-medium">Recent queries will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`w-full text-left p-4 rounded-2xl transition-all border group relative ${
                  activeId === item.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white md:bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-700'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <p className={`text-sm font-semibold truncate ${activeId === item.id ? 'text-white' : 'text-slate-800'}`}>
                    {item.question}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${activeId === item.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(item.timestamp)}
                    </span>
                    {item.sources.length > 0 && (
                      <span className={`text-[10px] flex items-center gap-1 ${activeId === item.id ? 'text-blue-100' : 'text-blue-500'}`}>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 10-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.243 17.657a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 111.414-1.414l.707.707z" />
                        </svg>
                        {item.sources.length} sources
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
