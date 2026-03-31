import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function History({ history, onView, onBack }: { history: any[], onView: (statement: any) => void, onBack: () => void }) {
  return (
    <div className="w-full max-w-2xl glass p-8 mt-8">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
      >
        <ChevronLeft size={20} /> Back to Home
      </button>
      <h2 className="text-2xl font-semibold mb-6">Statement History</h2>
      {history.length === 0 ? (
        <p className="text-gray-400">No history yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{new Date(item.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400 truncate max-w-xs">{item.english.substring(0, 50)}...</p>
              </div>
              <button 
                className="px-4 py-2 bg-emerald-600 rounded text-sm"
                onClick={() => onView(item)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
