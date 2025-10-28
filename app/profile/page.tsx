'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/api';
import { Copy, RefreshCw, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [profilePublic, setProfilePublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setDisplayName(user.displayName);
      setProfilePublic(user.profilePublic);
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await auth.updateProfile({ displayName, profilePublic });
      updateUser({ displayName, profilePublic });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!confirm('Are you sure? Your old API key will stop working.')) return;
    
    setRegenerating(true);
    try {
      const response = await auth.regenerateApiKey();
      updateUser({ apiKey: response.data.apiKey });
      setMessage('API key regenerated successfully!');
    } catch (error) {
      setMessage('Failed to regenerate API key');
    } finally {
      setRegenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage('Copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account settings and API key</p>
      </div>

      {message && (
        <div className="bg-blue-500/10 border border-blue-500 text-blue-500 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="profilePublic"
              checked={profilePublic}
              onChange={(e) => setProfilePublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <label htmlFor="profilePublic" className="text-sm text-gray-300">
              Make my profile public (others can see my gaming stats)
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">API Key</h2>
        <p className="text-gray-400 text-sm mb-4">
          Use this API key in your R36S tracker script to authenticate requests
        </p>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={user?.apiKey || ''}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
          />
          <button
            onClick={() => copyToClipboard(user?.apiKey || '')}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            title="Copy"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleRegenerateApiKey}
          disabled={regenerating}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
          <span>{regenerating ? 'Regenerating...' : 'Regenerate API Key'}</span>
        </button>
        <p className="text-yellow-500 text-xs mt-2">
          ⚠️ Warning: Regenerating will invalidate your current API key
        </p>
      </div>
    </div>
  );
}