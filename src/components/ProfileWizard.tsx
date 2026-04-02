import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, User, Users, MapPin, Briefcase, BookOpen, AlertTriangle, FileText, X, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/imageUtils';

const steps = [
  { id: 'registration', title: 'Registration', icon: User },
];

export default function ProfileWizard({ onComplete, initialProfile, onBack }: { onComplete: (data: any) => void, initialProfile?: any, onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState(() => {
    if (initialProfile) return initialProfile;
    return {};
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        setProfile({ ...profile, profilePicture: croppedImage });
        setImageToCrop(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageToCrop, croppedAreaPixels, profile]);

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
    if (step === 0) {
      return [
        { id: 'profilePicture', label: 'Profile Picture / প্রোফাইল ছবি', type: 'file', hint: 'Upload a clear photo of yourself. / আপনার একটি পরিষ্কার ছবি আপলোড করুন।' },
        { id: 'fullName', label: 'Full Name / পূর্ণ নাম', required: true, hint: 'Enter your full legal name. / আপনার পূর্ণ আইনি নাম লিখুন।' },
        { id: 'phone', label: 'Phone Number / ফোন নম্বর', required: true, type: 'tel', hint: 'Enter your active phone number. / আপনার সচল ফোন নম্বরটি দিন।' },
        { id: 'email', label: 'Email Address / ইমেল ঠিকানা', required: true, type: 'email', hint: 'Enter your email for contact. / যোগাযোগের জন্য আপনার ইমেল দিন।' },
        { id: 'dob', label: 'Date of Birth / জন্ম তারিখ', required: true, type: 'date', hint: 'Select your date of birth. / আপনার জন্ম তারিখ নির্বাচন করুন।' },
        { id: 'gender', label: 'Gender / লিঙ্গ', required: true, type: 'select', options: ['Male', 'Female', 'Other'], hint: 'Select your gender. / আপনার লিঙ্গ নির্বাচন করুন।' },
        { id: 'address', label: 'Current Address / বর্তমান ঠিকানা', required: true, type: 'textarea', hint: 'Enter your current living address in USA. / ইউএসএ-তে আপনার বর্তমান ঠিকানা লিখুন।' },
        { id: 'usaStatus', label: 'Status in USA / ইউএসএ-তে বর্তমান অবস্থা', required: true, type: 'select', options: ['Pending Asylum', 'Case Granted', 'Green Card holder', 'Other'], hint: 'Select your current immigration status. / আপনার বর্তমান অভিবাসন অবস্থা নির্বাচন করুন।' },
      ];
    }
    return [];
  };

  const handleNext = () => {
    if (validate()) {
      if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
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
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStep < steps.length 
                ? (profile.fullNameEn ? steps[currentStep].title : `Registration - ${steps[currentStep].title}`) 
                : 'Review'}
            </h2>
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
                  <div className="space-y-1">
                    <select 
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-gray-900" 
                      onChange={e => setProfile({...profile, [field.id]: e.target.value})} 
                      value={profile[field.id] || ''}
                    >
                      <option value="">Select...</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <p className="text-[10px] text-gray-400 italic">{field.hint}</p>
                  </div>
                ) : field.type === 'textarea' ? (
                  <div className="space-y-1">
                    <textarea 
                      className={`w-full p-3 bg-white border ${errors[field.id] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-gray-900`}
                      rows={4}
                      value={profile[field.id] || ''}
                      onChange={e => setProfile({...profile, [field.id]: e.target.value})}
                      placeholder={field.hint}
                    />
                    <p className="text-[10px] text-gray-400 italic">{field.hint}</p>
                  </div>
                ) : field.type === 'file' ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      {profile.profilePicture && (
                        <div className="relative group">
                          <img src={profile.profilePicture} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-md" />
                          <button 
                            onClick={() => setProfile({ ...profile, profilePicture: null })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      <label className="flex-1">
                        <div className="flex items-center justify-center w-full h-12 px-4 transition bg-white border-2 border-gray-200 border-dashed rounded-xl appearance-none cursor-pointer hover:border-emerald-400 focus:outline-none">
                          <span className="flex items-center space-x-2">
                            <Crop className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-600">
                              {profile.profilePicture ? 'Change Photo / ছবি পরিবর্তন করুন' : 'Upload Photo / ছবি আপলোড করুন'}
                            </span>
                          </span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setImageToCrop(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </label>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">{field.hint}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input 
                      type={field.type || 'text'}
                      className={`w-full p-3 bg-white border ${errors[field.id] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-gray-900`}
                      value={profile[field.id] || ''}
                      onChange={e => setProfile({...profile, [field.id]: e.target.value})}
                      placeholder={field.hint}
                    />
                    <p className="text-[10px] text-gray-400 italic">{field.hint}</p>
                  </div>
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
            {currentStep === steps.length - 1 ? 'Finish / সেভ করুন' : 'Next / পরবর্তী'} <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>

      {/* Image Cropping Modal */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Crop Profile Picture / ছবি ক্রপ করুন</h3>
                <button onClick={() => setImageToCrop(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative h-80 bg-gray-900">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Zoom / জুম</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setImageToCrop(null)}
                    className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    Cancel / বাতিল
                  </button>
                  <button 
                    onClick={showCroppedImage}
                    className="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition"
                  >
                    Apply / সেভ করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
