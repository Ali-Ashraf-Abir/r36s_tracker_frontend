'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Gamepad2, Clock, Download, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">
          Track Your Gaming Journey
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Monitor gameplay sessions, track statistics, and backup your saves for R36S handheld
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
            Get Started
          </a>
          <a href="/login" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
            Sign In
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
            <Gamepad2 className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Session Tracking</h3>
          <p className="text-gray-400">Automatically track all your gaming sessions</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Play Time Stats</h3>
          <p className="text-gray-400">See detailed statistics for each game</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Save Backups</h3>
          <p className="text-gray-400">Automatic backups of all your game saves</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
          <p className="text-gray-400">Visualize your gaming patterns over time</p>
        </div>
      </div>
    </div>
  );
}