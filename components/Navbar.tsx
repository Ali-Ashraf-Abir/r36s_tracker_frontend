'use client';
import Link from 'next/link';

import { Gamepad2, User, LogOut, Home, BarChart3, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
              <Gamepad2 className="w-6 h-6 text-blue-500" />
              <span>R36S Tracker</span>
            </Link>
            {user && (
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/stats" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistics</span>
                </Link>
                <Link href="/backups" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <Download className="w-4 h-4" />
                  <span>Backups</span>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user.displayName || user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}