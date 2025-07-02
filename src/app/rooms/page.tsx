'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CreateRoomForm from '@/components/CreateRoomForm';
import JoinRoomForm from '@/components/JoinRoomForm';
import { FiPlus, FiLogIn } from 'react-icons/fi';

export default function RoomsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Watch Party Rooms
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm focus:outline-none ${activeTab === 'create' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <div className="flex items-center justify-center">
                <FiPlus className="mr-2" />
                Create Room
              </div>
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm focus:outline-none ${activeTab === 'join' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <div className="flex items-center justify-center">
                <FiLogIn className="mr-2" />
                Join Room
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'create' ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Create a new watch party room and invite your friends to join. You'll be the host with full control over the video playback.
                </p>
                <CreateRoomForm />
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Join an existing watch party by entering the room ID shared by the host.
                </p>
                <JoinRoomForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}