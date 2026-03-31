import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, User, Users, MapPin, Briefcase, BookOpen, AlertTriangle, FileText } from 'lucide-react';

const steps = [
  { id: 'personal', title: 'Personal', icon: User },
  { id: 'family', title: 'Family', icon: Users },
  { id: 'national', title: 'National', icon: FileText },
  { id: 'contact', title: 'Contact', icon: User },
  { id: 'address', title: 'Address', icon: MapPin },
  { id: 'education', title: 'Education', icon: BookOpen },
  { id: 'employment', title: 'Employment', icon: Briefcase },
  { id: 'fear', title: 'Fear', icon: AlertTriangle },
  { id: 'documents', title: 'Documents', icon: FileText },
];

export default function ProfileWizard({ onComplete, initialProfile, onBack }: { onComplete: (data: any) => void, initialProfile?: any, onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState(() => {
    if (initialProfile) return initialProfile;
    const saved = localStorage.getItem('asylum-profile');
    return saved ? JSON.parse(saved) : {};
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('asylum-profile', JSON.stringify(profile));
  }, [profile]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const stepFields = getFieldsForStep(currentStep);
    stepFields.forEach(field => {
      if (field.required && !profile[field.id]) {
        newErrors[field.id] = 'Required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return [
        { id: 'fullNameEn', label: 'Full Name (English)', required: true },
        { id: 'fullNameBn', label: 'Full Name (Bengali)', required: true },
        { id: 'dob', label: 'Date of Birth', required: true, type: 'date' },
        { id: 'pob', label: 'Place of Birth', required: true },
        { id: 'gender', label: 'Gender', required: true, type: 'select', options: ['Male', 'Female', 'Other'] },
      ];
      case 1: return [
        { id: 'fatherName', label: 'Father Name', required: true },
        { id: 'motherName', label: 'Mother Name', required: true },
      ];
      case 2: return [
        { id: 'nationality', label: 'Nationality', required: true },
        { id: 'nid', label: 'NID Number', required: false },
        { id: 'passport', label: 'Passport Number', required: false },
      ];
      case 3: return [
        { id: 'email', label: 'Email', required: true, type: 'email' },
        { id: 'phone', label: 'Phone Number', required: true, type: 'tel' },
      ];
      case 4: return [
        { id: 'addressUsa', label: 'Present Address (USA)', required: true },
        { id: 'addressHome', label: 'Permanent Address (Home)', required: true },
      ];
      case 5: return [
        { id: 'education', label: 'Highest Education', required: true },
      ];
      case 6: return [
        { id: 'employment', label: 'Employment History', required: true },
      ];
      case 7: return [
        { id: 'fearReason', label: 'Reasons for Fear of Return', required: true, type: 'textarea' },
      ];
      case 8: return [
        { id: 'documents', label: 'Upload Supporting Documents', required: false, type: 'file' },
        { id: 'docDescription', label: 'Describe the Documents', required: true, type: 'textarea' },
      ];
      default: return [];
    }
  };

  const handleNext = () => {
    if (validate()) {
      if (currentStep < steps.length) setCurrentStep(currentStep + 1);
      else onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F9] p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-xl border border-white/50">
        {onBack && (
          <button 
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium"
          >
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
        )}
        
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{currentStep < steps.length ? steps[currentStep].title : 'Review'}</h2>
            <span className="text-sm font-medium text-emerald-600">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Fields or Review */}
        {currentStep < steps.length ? (
          <div className="space-y-6">
            {getFieldsForStep(currentStep).map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select 
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                    onChange={e => setProfile({...profile, [field.id]: e.target.value})} 
                    value={profile[field.id] || ''}
                  >
                    <option value="">Select...</option>
                    {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea 
                    className={`w-full p-3 bg-white border ${errors[field.id] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition`}
                    rows={4}
                    value={profile[field.id] || ''}
                    onChange={e => setProfile({...profile, [field.id]: e.target.value})}
                  />
                ) : (
                  <input 
                    type={field.type || 'text'}
                    className={`w-full p-3 bg-white border ${errors[field.id] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition`}
                    value={field.type === 'file' ? undefined : profile[field.id] || ''}
                    onChange={e => field.type === 'file' ? setProfile({...profile, [field.id]: e.target.files?.[0]?.name}) : setProfile({...profile, [field.id]: e.target.value})}
                  />
                )}
                {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              {Object.entries(profile).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-sm font-semibold text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
          <button 
            disabled={currentStep === 0} 
            onClick={() => setCurrentStep(currentStep - 1)} 
            className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            <ChevronLeft size={20} className="mr-2" /> Back
          </button>
          <button 
            onClick={handleNext} 
            className="flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-emerald-500/20 transition"
          >
            {currentStep === steps.length ? 'Finish' : 'Next'} <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
