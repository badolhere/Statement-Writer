import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';
import ProfileWizard from './components/ProfileWizard';
import History from './components/History';
import Dashboard from './components/Dashboard';
import PoliticalHistory from './components/PoliticalHistory';
import YourStatement from './components/YourStatement';
import ProfileView from './components/ProfileView';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';
import jsPDF from 'jspdf';
import { MoreVertical, LogOut, AlertTriangle } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statement, setStatement] = useState<{ english: string; bengali: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPoliticalHistory, setShowPoliticalHistory] = useState(false);
  const [showYourStatement, setShowYourStatement] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    if (!session?.user) return;

    // Fetch Profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileData) setProfile(profileData);

    // Fetch History
    const { data: historyData, error: historyError } = await supabase
      .from('statements')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (historyData) setHistory(historyData);
  };

  const saveProfile = async (newProfile: any) => {
    if (!session?.user) {
      setProfile(newProfile);
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, ...newProfile });

    if (error) {
      console.error('Error saving profile:', error);
      setError(`Failed to save profile: ${error.message} (${error.details || 'No details'}). Please ensure you have run the corrected SQL setup in Supabase.`);
    } else {
      setProfile(newProfile);
      setError(null);
    }
    setLoading(false);
  };

  const saveStatement = async (newStatement: any) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('statements')
      .insert({ user_id: session.user.id, ...newStatement });

    if (!error) fetchUserData();
  };

  const generateStatement = async (currentAnswers?: Record<string, string>, retries = 3) => {
    setLoading(true);
    setError(null);
    setStatement(null);
    setTimeLeft(90); // Set to 90 seconds
    const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      setError('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your Vercel environment variables. / জেমিনি এপিআই কি পাওয়া যায়নি। দয়া করে ভার্সেল এনভায়রনমেন্ট ভেরিয়েবলে VITE_GEMINI_API_KEY যোগ করুন।');
      setLoading(false);
      clearInterval(timer);
      return;
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const finalAnswers = currentAnswers || answers;
    const prompt = `Act as an expert immigration attorney. Generate a highly detailed, professional, and unique asylum statement (Form I-589 supporting declaration) based on the following profile: ${JSON.stringify(profile)} and detailed questionnaire answers: ${JSON.stringify(finalAnswers)}. 
    
    CRITICAL INSTRUCTIONS:
    1. Use ALL the information provided in the profile (Name, USA Status, etc.) and the questionnaire (Travel, Incidents, Fear, etc.).
    2. The statement must be detailed, emotional, legally structured, and chronologically consistent.
    3. Include sections: Personal Background, Political/Social Involvement, Persecution & Attacks, Flight from Country, Entry into USA, Fear of Return, and Conclusion.
    4. Generate the statement in both English and Bengali.
    5. Format the output as a JSON object with keys "english" and "bengali".
    6. Ensure the tone is formal yet compelling, suitable for a legal declaration.`;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
          config: { 
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                bengali: { type: Type.STRING }
              },
              required: ["english", "bengali"]
            }
          }
        });
        
        const result = JSON.parse(response.text || '{}');
        if (!result.english || !result.bengali) throw new Error('Invalid response format from AI. / এআই থেকে ভুল ফরম্যাটে রেসপন্স এসেছে।');
        
        setStatement(result);
        await saveStatement(result);
        setLoading(false);
        clearInterval(timer);
        return;
      } catch (err: any) {
        console.error(`Attempt ${i + 1} failed:`, err);
        if (i === retries - 1) {
          setError(`Failed to generate statement: ${err.message || 'Unknown error'}. Please check your API key and connection. / স্টেটমেন্ট জেনারেট করতে সমস্যা হয়েছে: ${err.message || 'অজানা সমস্যা'}। দয়া করে আপনার এপিআই কি এবং কানেকশন চেক করুন।`);
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

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

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
              setShowYourStatement(false);
              setShowProfile(false);
              return;
            }
            setShowDashboard(false);
            if (page === 'profile') setShowProfile(true);
            else if (page === 'history') setShowHistory(true);
            else if (page === 'politicalHistory') setShowPoliticalHistory(true);
            else if (page === 'yourStatement') setShowYourStatement(true);
            else if (page === 'wizard') { setProfile(null); setIsEditing(true); }
          }} 
        />
      ) : (
        <div className="p-8 flex flex-col items-center">
          <header className="mb-12 text-center relative">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
              Writer Badol
            </h1>
            <p className="text-gray-300 mt-2">Professional AI Legal Support</p>
            <button className="absolute top-0 right-0 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreVertical />
            </button>
            {isMenuOpen && (
              <div className="absolute top-10 right-0 bg-gray-800 rounded shadow-lg p-2 z-10 text-left">
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setProfile(null); setStatement(null); setShowHistory(false); setShowPoliticalHistory(false); setShowYourStatement(false); setShowProfile(false); setShowDashboard(true); }}>Home</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setShowProfile(true); setShowHistory(false); setShowPoliticalHistory(false); setShowYourStatement(false); setShowDashboard(false); }}>Profile</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setShowHistory(true); setShowPoliticalHistory(false); setShowYourStatement(false); setShowProfile(false); setShowDashboard(false); }}>History</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setShowPoliticalHistory(true); setShowHistory(false); setShowYourStatement(false); setShowProfile(false); setShowDashboard(false); }}>Political History</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => { setIsMenuOpen(false); setShowYourStatement(true); setShowHistory(false); setShowPoliticalHistory(false); setShowProfile(false); setShowDashboard(false); }}>Your Statement</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={async () => { await supabase.auth.signOut(); setIsMenuOpen(false); }}>Sign Out</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Settings</button>
                <button className="block w-full text-left p-2 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>About</button>
              </div>
            )}
          </header>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertTriangle size={18} />
              <p>{error}</p>
            </div>
          )}

          {showHistory ? (
            <History history={history} onView={(s) => { setStatement(s); setShowHistory(false); }} onBack={() => { setShowHistory(false); setShowDashboard(true); }} />
          ) : showPoliticalHistory ? (
            <PoliticalHistory onBack={() => { setShowPoliticalHistory(false); setShowDashboard(true); }} />
          ) : showYourStatement ? (
            <YourStatement 
              profile={profile} 
              onBack={() => { setShowYourStatement(false); setShowDashboard(true); }} 
              onGenerate={(data) => {
                setAnswers(data);
                setShowYourStatement(false);
                generateStatement(data);
              }}
            />
          ) : showProfile ? (
            <ProfileView 
              profile={profile} 
              onEdit={() => { setIsEditing(true); setShowProfile(false); }} 
              onBack={() => { setShowProfile(false); setShowDashboard(true); }} 
            />
          ) : !profile || isEditing ? (
            <ProfileWizard onComplete={(data) => { saveProfile(data); setIsEditing(false); setShowDashboard(true); }} initialProfile={isEditing ? profile : null} onBack={() => { setIsEditing(false); setShowDashboard(true); }} />
          ) : (
            <div className="w-full max-w-2xl glass p-8">
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
                      addHeaderFooter(doc, profile.fullName || 'Applicant');
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
                      addHeaderFooter(doc, profile.fullName || 'আবেদনকারী');
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
