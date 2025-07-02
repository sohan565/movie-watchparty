'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import { FiLink, FiVideo } from 'react-icons/fi';

export default function CreateRoomForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createRoom } = useRoom();
  const router = useRouter();

  const isValidGoogleDriveUrl = (url: string) => {
    // Basic validation for Google Drive URLs
    return (
      url.includes('drive.google.com') ||
      url.includes('docs.google.com') ||
      url.startsWith('https://') ||
      url.startsWith('http://')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!videoUrl.trim()) {
      setError('Please enter a video URL');
      return;
    }

    if (!isValidGoogleDriveUrl(videoUrl)) {
      setError('Please enter a valid video URL');
      return;
    }

    try {
      setIsLoading(true);
      const roomId = await createRoom(videoUrl);
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-indigo-600 dark:bg-indigo-800 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <FiVideo className="mr-2" /> Create Watch Party
        </h2>
        <p className="text-indigo-200 text-sm mt-1">
          Host a synchronized video watching experience with friends
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLink className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={isLoading}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter a Google Drive video link or any direct video URL
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </form>
    </div>
  );
}