import React, { useState } from 'react';
import { ChevronLeft, Save, FileText, Download, Sparkles, PenTool, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import AsylumWizard from './AsylumWizard';

const YourStatement = ({ onBack, profile, onGenerate }: { onBack: () => void, profile: any, onGenerate: (answers: Record<string, string>) => void }) => {
  const [mode, setMode] = useState<'select' | 'ai' | 'manual'>('select');
  const [statement, setStatement] = useState('');
  const [title, setTitle] = useState('My Asylum Statement');

  const handleDownload = () => {
    const doc = new jsPDF({ format: 'letter' });
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(statement, 180);
    doc.text(lines, 20, 40);
    
    // Add footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Name: ${profile?.fullName || 'Applicant'}`, 10, 285);
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
    }
    
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F3F4F9] p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Info Required / ব্যক্তিগত তথ্য প্রয়োজন</h2>
          <p className="text-gray-500 mb-8">Please fill out your personal information first to generate a complete statement. / একটি পূর্ণাঙ্গ স্টেটমেন্ট তৈরির জন্য প্রথমে আপনার ব্যক্তিগত তথ্য পূরণ করুন।</p>
          <button 
            onClick={onBack}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition"
          >
            Go to Profile / প্রোফাইলে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F9] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={mode === 'select' ? onBack : () => setMode('select')}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium"
        >
          <ChevronLeft size={20} /> {mode === 'select' ? 'Back to Dashboard' : 'Back to Selection'}
        </button>

        <AnimatePresence mode="wait">
          {mode === 'select' && (
            <motion.div 
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <button 
                onClick={() => setMode('ai')}
                className="bg-white p-10 rounded-3xl shadow-xl border border-white/50 hover:border-emerald-500 transition-all text-left group"
              >
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Statement Assistant</h2>
                <p className="text-gray-500">Answer a few questions and let our AI draft a professional legal statement for you.</p>
              </button>

              <button 
                onClick={() => setMode('manual')}
                className="bg-white p-10 rounded-3xl shadow-xl border border-white/50 hover:border-blue-500 transition-all text-left group"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <PenTool size={32} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Manual Drafting</h2>
                <p className="text-gray-500">Draft your own statement manually using our professional editor and tips.</p>
              </button>
            </motion.div>
          )}

          {mode === 'ai' && (
            <motion.div 
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-xl border border-white/50"
            >
              <AsylumWizard 
                onComplete={(answers) => {
                  onGenerate(answers);
                }} 
                onBack={() => setMode('select')} 
              />
            </motion.div>
          )}

          {mode === 'manual' && (
            <motion.div 
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-xl border border-white/50"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="text-emerald-500" /> Manual Drafting
                  </h1>
                  <p className="text-gray-500 mt-1">Draft your personal statement manually for legal review.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleDownload}
                    disabled={!statement}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-lg hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    <Download size={20} /> Download PDF
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statement Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-xl font-semibold text-gray-900"
                    placeholder="e.g., My Asylum Statement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Statement Content / আপনার স্টেটমেন্টের বিষয়বস্তু</label>
                  <textarea 
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    className="w-full p-6 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition min-h-[400px] text-lg leading-relaxed text-gray-900"
                    placeholder="Start writing your statement here... Be detailed about your experiences, dates, and reasons for seeking asylum. / এখানে আপনার স্টেটমেন্ট লেখা শুরু করুন... আপনার অভিজ্ঞতা, তারিখ এবং আশ্রয় চাওয়ার কারণগুলো বিস্তারিতভাবে লিখুন।"
                  />
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h3 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
                    💡 Writing Tips
                  </h3>
                  <ul className="text-emerald-700 text-sm space-y-2 list-disc pl-5">
                    <li>Be specific about dates and locations of incidents.</li>
                    <li>Describe your personal feelings and fears during the events.</li>
                    <li>Explain why you cannot seek protection from your home country's government.</li>
                    <li>Include details about any political or social groups you were involved with.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default YourStatement;
