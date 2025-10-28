'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { backup } from '@/lib/api';
import { Download, Trash2, HardDrive } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export default function BackupsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [backups, setBackups] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchBackups();
    }
  }, [user, loading, router]);

  const fetchBackups = async () => {
    try {
      const response = await backup.list();
      setBackups(response.data.backups);
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDownload = async (backupId: string, fileName: string) => {
    try {
      const response = await backup.download(backupId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Failed to download backup');
    }
  };

  const handleDelete = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;

    try {
      await backup.delete(backupId);
      setBackups(backups.filter(b => b._id !== backupId));
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Failed to delete backup');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Save Backups</h1>
        <p className="text-gray-400 mt-2">Manage your game save backups</p>
      </div>

      {backups.length > 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Device</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Size</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b) => (
                  <tr key={b._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4 px-6 text-white">
                      {format(new Date(b.backupDate), 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                    <td className="py-4 px-6 text-gray-400">{b.deviceId}</td>
                    <td className="py-4 px-6 text-gray-400">{formatFileSize(b.fileSize)}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(b._id, b.fileName)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <HardDrive className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No backups yet</h3>
          <p className="text-gray-400 mb-6">
            Your R36S device will automatically create backups when running the tracker script
          </p>
        </div>
      )}
    </div>
  );
}