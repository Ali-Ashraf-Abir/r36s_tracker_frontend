'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gameplay, device } from '@/lib/api';
import { Clock, Gamepad2, TrendingUp, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      const [statsRes, devicesRes] = await Promise.all([
        gameplay.getStats(),
        device.list(),
      ]);
      setStats(statsRes.data);
      setDevices(devicesRes.data.devices);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const topGames = Object.values(stats?.byGame || {})
    .sort((a: any, b: any) => b.totalPlaytime - a.totalPlaytime)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.displayName || user?.username}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{formatDuration(stats?.totalPlaytime || 0)}</h3>
          <p className="text-gray-400 text-sm">Total Playtime</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats?.gamesPlayed || 0}</h3>
          <p className="text-gray-400 text-sm">Games Played</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats?.totalSessions || 0}</h3>
          <p className="text-gray-400 text-sm">Total Sessions</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{devices.length}</h3>
          <p className="text-gray-400 text-sm">Devices</p>
        </div>
      </div>

      {/* Top Games */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Top Games</h2>
        <div className="space-y-4">
          {topGames.length > 0 ? (
            topGames.map((game: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium">{game.gameName}</p>
                  <p className="text-sm text-gray-400">{game.platform}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatDuration(game.totalPlaytime)}</p>
                  <p className="text-sm text-gray-400">{game.sessionCount} sessions</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">No games played yet. Start gaming to see statistics!</p>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Sessions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Game</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Platform</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {stats?.sessions?.slice(0, 10).map((session: any, index: number) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-white">{session.gameName}</td>
                  <td className="py-3 px-4 text-gray-400">{session.platform}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {format(new Date(session.startTime), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="py-3 px-4 text-gray-400">{formatDuration(session.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats?.sessions || stats.sessions.length === 0) && (
            <div className="text-center py-8 text-gray-400">No sessions yet</div>
          )}
        </div>
      </div>
    </div>
  );
}