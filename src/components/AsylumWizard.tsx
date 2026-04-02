import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

const steps = [
  { id: 'travel', title: 'Travel History / ভ্রমণের ইতিহাস', question: 'Describe your travel history. / আপনার ভ্রমণের ইতিহাস বর্ণনা করুন।', hint: 'List countries visited and dates. / ভ্রমণ করা দেশ এবং তারিখগুলোর তালিকা দিন।', placeholder: 'e.g., India (2015-2016), USA (2023) / উদা: ভারত (২০১৫-২০১৬), ইউএসএ (২০২৩)' },
  { id: 'reason', title: 'Reason for Asylum / আশ্রয়ের কারণ', question: 'Why are you seeking asylum? / আপনি কেন আশ্রয় চাইছেন?', hint: 'Explain the main reasons for your fear. / আপনার ভয়ের প্রধান কারণগুলো ব্যাখ্যা করুন।', placeholder: 'e.g., Political persecution due to my involvement in... / উদা: আমার রাজনৈতিক সম্পৃক্ততার কারণে নির্যাতন...' },
  { id: 'incidents', title: 'Incident Details / ঘটনার বিবরণ', question: 'Describe the incidents. / ঘটনাগুলো বর্ণনা করুন।', hint: 'Provide dates, locations, and details of incidents. / ঘটনার তারিখ, স্থান এবং বিস্তারিত বিবরণ দিন।', placeholder: 'e.g., On June 12, 2022, I was attacked at... / উদা: ১২ জুন, ২০২২ তারিখে আমাকে আক্রমণ করা হয়েছিল...' },
  { id: 'family', title: 'Family Threats / পারিবারিক হুমকি', question: 'Have your family members been threatened? / আপনার পরিবারের সদস্যদের কি হুমকি দেওয়া হয়েছে?', hint: 'Describe any threats to your family. / আপনার পরিবারের প্রতি কোনো হুমকি থাকলে তা বর্ণনা করুন।', placeholder: 'e.g., My brother was kidnapped on... / উদা: আমার ভাইকে অপহরণ করা হয়েছিল...' },
  { id: 'escape', title: 'Escape Story / পালানোর গল্প', question: 'How did you escape? / আপনি কীভাবে পালিয়ে এসেছেন?', hint: 'Describe your escape journey. / আপনার পালানোর যাত্রার বর্ণনা দিন।', placeholder: 'e.g., I traveled through several countries to reach... / উদা: আমি বেশ কয়েকটি দেশ পার হয়ে এখানে পৌঁছেছি...' },
  { id: 'usa', title: 'Entry to USA / ইউএসএ প্রবেশ', question: 'How did you enter the USA? / আপনি কীভাবে ইউএসএ-তে প্রবেশ করেছেন?', hint: 'Describe your entry method and date. / আপনার প্রবেশের পদ্ধতি এবং তারিখ বর্ণনা করুন।', placeholder: 'e.g., I entered via the border at... / উদা: আমি সীমান্ত দিয়ে প্রবেশ করেছি...' },
  { id: 'fear', title: 'Current Fear / বর্তমান ভয়', question: 'Why do you fear returning? / আপনি কেন ফিরে যেতে ভয় পান?', hint: 'Explain your current fears. / আপনার বর্তমান ভয়ের কারণগুলো ব্যাখ্যা করুন।', placeholder: 'e.g., If I return, I will be imprisoned or killed because... / উদা: আমি ফিরে গেলে আমাকে কারারুদ্ধ বা হত্যা করা হবে কারণ...' },
];

export default function AsylumWizard({ onComplete, onBack }: { onComplete: (answers: Record<string, string>) => void, onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 flex-1 mr-4">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${index <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'}`} 
            />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {currentStep + 1}/{steps.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={steps[currentStep].id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-600 text-lg">{steps[currentStep].question}</p>
          </div>

          <div className="relative">
            <textarea
              className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition min-h-[200px] text-lg text-gray-900"
              placeholder={steps[currentStep].placeholder}
              value={answers[steps[currentStep].id] || ''}
              onChange={(e) => setAnswers({ ...answers, [steps[currentStep].id]: e.target.value })}
            />
            <div className="mt-3 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed font-medium">{steps[currentStep].hint}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleBack}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[steps[currentStep].id]}
              className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? (
                <>Generate Statement <Sparkles size={20} /></>
              ) : (
                <>Next Step <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
