'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gameplay } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/context/AuthContext';

export default function StatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchStats();
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    try {
      const response = await gameplay.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const gameData = Object.values(stats?.byGame || {})
    .sort((a: any, b: any) => b.totalPlaytime - a.totalPlaytime)
    .slice(0, 10)
    .map((game: any) => ({
      name: game.gameName.length > 20 ? game.gameName.substring(0, 20) + '...' : game.gameName,
      hours: Math.round(game.totalPlaytime / 3600 * 10) / 10,
      sessions: game.sessionCount,
    }));

  const dateData = Object.values(stats?.byDate || {})
    .sort((a: any, b: any) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((day: any) => ({
      date: day.date,
      hours: Math.round(day.totalPlaytime / 3600 * 10) / 10,
    }));

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Statistics</h1>
        <p className="text-gray-400 mt-2">Detailed analytics of your gaming sessions</p>
      </div>

      {/* Playtime by Game */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Playtime by Game (Top 10)</h2>
        {gameData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={gameData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9CA3AF" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-8">No game data available yet</p>
        )}
      </div>

      {/* Playtime by Date */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Playtime Over Time (Last 30 Days)</h2>
        {dateData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: '#10B981' }}
              />
              <Bar dataKey="hours" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-8">No daily data available yet</p>
        )}
      </div>

      {/* Game Breakdown */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Games by Sessions</h2>
          {gameData.length > 0 ? (
            <div className="space-y-3">
              {gameData.slice(0, 8).map((game: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-white text-sm truncate">{game.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{game.sessions} sessions</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No session data available</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Platform Distribution</h2>
          {stats?.sessions && stats.sessions.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(
                stats.sessions.reduce((acc: any, session: any) => {
                  acc[session.platform] = (acc[session.platform] || 0) + 1;
                  return acc;
                }, {})
              )
                .sort((a: any, b: any) => b[1] - a[1])
                .slice(0, 8)
                .map(([platform, count]: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-white text-sm">{platform || 'Unknown'}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{count} sessions</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No platform data available</p>
          )}
        </div>
      </div>
    </div>
  );
}