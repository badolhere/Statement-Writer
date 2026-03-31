import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import ProfileWizard from './components/ProfileWizard';
import History from './components/History';
import Dashboard from './components/Dashboard';
import PoliticalHistory from './components/PoliticalHistory';
import jsPDF from 'jspdf';
import { MoreVertical } from 'lucide-react';

const steps = [
  { id: 'profile', title: 'User Profile / ব্যবহারকারীর প্রোফাইল', question: 'Please provide your personal details. / অনুগ্রহ করে আপনার ব্যক্তিগত বিবরণ দিন।', hint: 'Include full name, date of birth, and contact info. / আপনার সম্পূর্ণ নাম, জন্ম তারিখ এবং যোগাযোগের তথ্য অন্তর্ভুক্ত করুন।' },
  { id: 'travel', title: 'Travel History / ভ্রমণের ইতিহাস', question: 'Describe your travel history. / আপনার ভ্রমণের ইতিহাস বর্ণনা করুন।', hint: 'List countries visited and dates. / ভ্রমণ করা দেশ এবং তারিখগুলোর তালিকা দিন।' },
  { id: 'reason', title: 'Reason for Asylum / আশ্রয়ের কারণ', question: 'Why are you seeking asylum? / আপনি কেন আশ্রয় চাইছেন?', hint: 'Explain the main reasons for your fear. / আপনার ভয়ের প্রধান কারণগুলো ব্যাখ্যা করুন।' },
  { id: 'incidents', title: 'Incident Details / ঘটনার বিবরণ', question: 'Describe the incidents. / ঘটনাগুলো বর্ণনা করুন।', hint: 'Provide dates, locations, and details of incidents. / ঘটনার তারিখ, স্থান এবং বিস্তারিত বিবরণ দিন।' },
  { id: 'family', title: 'Family Threats / পারিবারিক হুমকি', question: 'Have your family members been threatened? / আপনার পরিবারের সদস্যদের কি হুমকি দেওয়া হয়েছে?', hint: 'Describe any threats to your family. / আপনার পরিবারের প্রতি কোনো হুমকি থাকলে তা বর্ণনা করুন।' },
  { id: 'escape', title: 'Escape Story / পালানোর গল্প', question: 'How did you escape? / আপনি কীভাবে পালিয়ে এসেছেন?', hint: 'Describe your escape journey. / আপনার পালানোর যাত্রার বর্ণনা দিন।' },
  { id: 'usa', title: 'Entry to USA / ইউএসএ প্রবেশ', question: 'How did you enter the USA? / আপনি কীভাবে ইউএসএ-তে প্রবেশ করেছেন?', hint: 'Describe your entry method and date. / আপনার প্রবেশের পদ্ধতি এবং তারিখ বর্ণনা করুন।' },
  { id: 'fear', title: 'Current Fear / বর্তমান ভয়', question: 'Why do you fear returning? / আপনি কেন ফিরে যেতে ভয় পান?', hint: 'Explain your current fears. / আপনার বর্তমান ভয়ের কারণগুলো ব্যাখ্যা করুন।' },
];

export default function App() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statement, setStatement] = useState<{ english: string; bengali: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPoliticalHistory, setShowPoliticalHistory] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('asylum-history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleNext = (data: Record<string, string>) => {
    setAnswers({ ...answers, ...data });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateStatement();
    }
  };

  const generateStatement = async (retries = 3) => {
    setLoading(true);
    setError(null);
    setTimeLeft(90); // Set to 90 seconds
    const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const prompt = `Act as an expert immigration attorney. Generate a highly detailed, professional, and unique asylum statement (Form I-589 supporting declaration) based on the following profile: ${JSON.stringify(profile)} and information: ${JSON.stringify(answers)}. 
    The statement must be 3-6 pages long, emotional, legally structured, and chronologically consistent.
    Include sections: Personal Background, Political/Social Involvement, Persecution & Attacks, Flight from Country, Entry into USA, Fear of Return, and Conclusion.
    Generate the statement in both English and Bengali.
    Format the output as a JSON object with keys "english" and "bengali".`;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        
        const result = JSON.parse(response.text || '{}');
        setStatement(result);
        const newHistory = [...history, { ...result, date: new Date().toISOString() }];
        setHistory(newHistory);
        localStorage.setItem('asylum-history', JSON.stringify(newHistory));
        setLoading(false);
        clearInterval(timer);
        return;
      } catch (err) {
        console.error(`Attempt ${i + 1} failed:`, err);
        if (i === retries - 1) {
          setError('Failed to generate statement after multiple attempts. Please try again later.');
        } else {
          await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        }
      }
    }
    setLoading(false);
    clearInterval(timer);
  };

  const addHeaderFooter = (doc: jsPDF, name: string) => {
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Name: ${name}`, 10, 10);
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {showDashboard ? (
        <Dashboard 
          profile={profile} 
          history={history} 
          onNavigate={(page) => {
            if (page === 'home') {
              setShowDashboard(true);
              setShowHistory(false);
              setShowPoliticalHistory(false);
              return;
            }
            setShowDashboard(false);
            if (page === 'profile') setIsEditing(true);
            else if (page === 'history') setShowHistory(true);
            else if (page === 'politicalHistory') setShowPoliticalHistory(true);
            else if (page === 'wizard') { setProfile(null); setIsEditing(true); }
          }} 
        />
      ) : (
        <div className="p-8 flex flex-col items-center">
          <header className="mb-12 text-center relative">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
              𝓑𝓪𝓭𝓸𝓵'𝓼 Statement Assistant™
            </h1>
            <p className="text-gray-300 mt-2">Professional AI Legal Support</p>
            <button className="absolute top-0 right-0 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreVertical />
            </button>
            {isMenuOpen && (
              <div className="absolute top-10 right-0 bg-gray-800 rounded shadow-lg p-2 z-10 text-left">
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setProfile(null); setStatement(null); setShowHistory(false); setShowPoliticalHistory(false); setShowDashboard(true); }}>Home</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setIsEditing(true); setShowHistory(false); setShowPoliticalHistory(false); setShowDashboard(false); }}>Profile</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setShowHistory(true); setShowPoliticalHistory(false); setShowDashboard(false); }}>History</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setShowPoliticalHistory(true); setShowHistory(false); setShowDashboard(false); }}>Political History</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Settings</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>About</button>
              </div>
            )}
          </header>

          {showHistory ? (
            <History history={history} onView={(s) => { setStatement(s); setShowHistory(false); }} onBack={() => { setShowHistory(false); setShowDashboard(true); }} />
          ) : showPoliticalHistory ? (
            <PoliticalHistory onBack={() => { setShowPoliticalHistory(false); setShowDashboard(true); }} />
          ) : !profile || isEditing ? (
            <ProfileWizard onComplete={(data) => { setProfile(data); setIsEditing(false); }} initialProfile={isEditing ? profile : null} onBack={() => { setIsEditing(false); setShowDashboard(true); }} />
          ) : (
            <div className="w-full max-w-2xl glass p-8">
              <button className="mb-4 text-emerald-400 hover:underline" onClick={() => setIsEditing(true)}>Edit Profile</button>
              <div className="mb-8 flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.id} className={`h-2 flex-1 mx-1 rounded-full ${index <= currentStep ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {!statement && !loading && !error && (
                  <motion.div
                    key={steps[currentStep].id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">{steps[currentStep].title}</h2>
                    <p className="text-lg mb-2">{steps[currentStep].question}</p>
                    <p className="text-sm text-gray-400 mb-4">{steps[currentStep].hint}</p>
                    <textarea
                      className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white mb-6"
                      rows={6}
                      placeholder="Enter details..."
                      onChange={(e) => setAnswers({...answers, [steps[currentStep].id]: e.target.value})}
                    />
                    <button
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg font-semibold hover:opacity-90"
                      onClick={() => handleNext({})}
                    >
                      {currentStep === steps.length - 1 ? 'Generate Statement' : 'Next Step'}
                    </button>
                  </motion.div>
                )}
                {loading && (
                  <div className="text-center text-xl">
                    <p>Generating your personalized legal statement...</p>
                    <p className="text-emerald-400 font-bold mt-2">Estimated time remaining: {timeLeft} seconds</p>
                  </div>
                )}
                {error && (
                  <div className="text-center text-red-400">
                    <p>{error}</p>
                    <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => generateStatement()}>Retry</button>
                  </div>
                )}
                {statement && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose text-white"
                  >
                    <h2 className="text-2xl font-semibold mb-4">Your Asylum Statement</h2>
                    <button 
                      className="mb-4 bg-blue-600 text-white px-4 py-2 rounded mr-2"
                      onClick={() => {
                        const doc = new jsPDF({ format: 'letter' });
                        doc.setFontSize(12);
                        const lines = doc.splitTextToSize(statement.english, 190);
                        let y = 20;
                        for (let i = 0; i < lines.length; i++) {
                          if (y > 270) {
                            doc.addPage();
                            y = 20;
                          }
                          doc.text(lines[i], 10, y);
                          y += 7;
                        }
                        addHeaderFooter(doc, profile.fullNameEn || 'Applicant');
                        doc.save('asylum-statement-english.pdf');
                      }}
                    >
                      Download English PDF
                    </button>
                    <button 
                      className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={() => {
                        const doc = new jsPDF({ format: 'letter' });
                        // NOTE: Bengali font support requires an external font file.
                        // This is a best-effort implementation using standard fonts.
                        doc.setFontSize(12);
                        const lines = doc.splitTextToSize(statement.bengali, 190);
                        let y = 20;
                        for (let i = 0; i < lines.length; i++) {
                          if (y > 270) {
                            doc.addPage();
                            y = 20;
                          }
                          doc.text(lines[i], 10, y);
                          y += 7;
                        }
                        addHeaderFooter(doc, profile.fullNameBn || 'আবেদনকারী');
                        doc.save('asylum-statement-bengali.pdf');
                      }}
                    >
                      Download Bengali PDF
                    </button>
                    <h3 className="font-bold">English</h3>
                    <p>{statement.english}</p>
                    <h3 className="font-bold mt-4">Bengali</h3>
                    <p>{statement.bengali}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
