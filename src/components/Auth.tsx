import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match! / পাসওয়ার্ড মিলছে না!');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmation is disabled in Supabase, this will log them in
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F9] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {isSignUp ? <UserPlus className="text-emerald-600" size={32} /> : <LogIn className="text-emerald-600" size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Account / অ্যাকাউন্ট তৈরি করুন' : 'Welcome Back / স্বাগতম'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isSignUp ? 'Join the Asylum Assistant / অ্যাসাইলাম অ্যাসিস্ট্যান্টে যোগ দিন' : 'Sign in to continue / চালিয়ে যেতে সাইন ইন করুন'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email Address / ইমেল ঠিকানা</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-gray-900 font-medium"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Password / পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-gray-900 font-medium"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-sm font-bold text-gray-900 mb-2">Confirm Password / পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-gray-900 font-medium"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </motion.div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing... / প্রসেসিং হচ্ছে...' : (isSignUp ? 'Sign Up / সাইন আপ' : 'Sign In / সাইন ইন')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-600 font-medium hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In / অ্যাকাউন্ট আছে? সাইন ইন করুন' : "Don't have an account? Sign Up / অ্যাকাউন্ট নেই? সাইন আপ করুন"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
