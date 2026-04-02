import React from 'react';
import { User, Mail, Phone, Shield, Edit2, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

const ProfileView = ({ profile, onEdit, onBack }: { profile: any, onEdit: () => void, onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-[#F3F4F9] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/50"
        >
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-emerald-500" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile?.fullName?.[0] || 'U'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile?.fullName || 'User'}</h1>
                <p className="text-emerald-600 font-medium">{profile?.usaStatus || 'Status Unknown'}</p>
              </div>
            </div>
            <button 
              onClick={onEdit}
              className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
            >
              <Edit2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem icon={Mail} label="Email Address" value={profile?.email} />
            <ProfileItem icon={Phone} label="Phone Number" value={profile?.phone} />
            <ProfileItem icon={Shield} label="USA Immigration Status" value={profile?.usaStatus} />
            <ProfileItem icon={User} label="Gender" value={profile?.gender} />
            <ProfileItem icon={Shield} label="Date of Birth" value={profile?.dob} />
            <div className="md:col-span-2">
              <ProfileItem icon={Shield} label="Current Address" value={profile?.address} />
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="text-blue-800 font-bold mb-2">Profile Security</h3>
            <p className="text-blue-700 text-sm">Your information is securely stored in the cloud and used only to personalize your legal documents. We do not share your data with third parties.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
    <div className="bg-gray-50 p-3 rounded-xl text-gray-400">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value || 'Not provided'}</p>
    </div>
  </div>
);

export default ProfileView;
