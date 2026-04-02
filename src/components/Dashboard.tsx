import React from 'react';
import { Pencil, Trash2, Search, Folder, FileText, Plus, Target, Clock, Users, User, Home, BookOpen, PenTool, UserPlus } from 'lucide-react';

const Dashboard = ({ profile, history, onNavigate }: { profile: any, history: any[], onNavigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-[#F3F4F9] p-5">
      {/* Header Section */}
      <div className="flex justify-between items-center mt-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">𝓑𝓪𝓭𝓸𝓵'𝓼 Assistant</h1>
          <p className="text-gray-600">Welcome back, {profile?.fullName || 'User'}</p>
        </div>
        <div className="flex gap-2">
          {!profile && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full shadow-sm text-sm font-medium hover:bg-emerald-700 transition"
              onClick={() => onNavigate('wizard')}
            >
              <UserPlus size={18} /> Register
            </button>
          )}
          <button className="p-2 bg-white rounded-full shadow-sm" onClick={() => onNavigate('profile')}>
            <User size={24} className="text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white/70 backdrop-blur-md rounded-xl px-4 py-3 mt-5 shadow-sm">
        <Search size={20} className="text-gray-400" />
        <input 
          placeholder="Search statements..." 
          className="ml-2 flex-1 text-gray-700 bg-transparent outline-none"
        />
      </div>

      {/* History Section (Notes) */}
      <div className="mt-8 mb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Statements</h2>
          <button className="text-emerald-600 font-medium" onClick={() => onNavigate('history')}>See all</button>
        </div>

        {history.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center mb-5 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <FileText size={24} className="text-emerald-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="font-bold text-gray-800">{new Date(item.date).toLocaleDateString()}</p>
              <p className="text-gray-500 text-xs truncate max-w-[200px]">{item.english.substring(0, 30)}...</p>
            </div>
            <button onClick={() => onNavigate('statement')}><Pencil size={20} className="text-gray-400" /></button>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        className="absolute bottom-24 right-6 bg-gradient-to-r from-emerald-500 to-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg flex"
        onClick={() => onNavigate('wizard')}
      >
        <Plus size={28} color="white" />
      </button>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around py-4 border-t border-gray-100 bg-white/80 backdrop-blur-md z-50">
        <TabItem icon={Clock} label="Recent" onClick={() => onNavigate('history')} />
        <TabItem icon={Home} label="Home" active onClick={() => onNavigate('home')} />
        <TabItem icon={PenTool} label="Your Statement" onClick={() => onNavigate('yourStatement')} />
        <TabItem icon={BookOpen} label="Politics" onClick={() => onNavigate('politicalHistory')} />
        <TabItem icon={User} label="Personal Info" onClick={() => onNavigate('profile')} />
      </div>
    </div>
  );
};

const TabItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button className="items-center flex flex-col" onClick={onClick}>
    <Icon size={20} color={active ? "#059669" : "#9CA3AF"} />
    <span style={{ fontSize: 10, marginTop: 4, color: active ? "#059669" : "#9CA3AF" }}>{label}</span>
  </button>
);

export default Dashboard;
