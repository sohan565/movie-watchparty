'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRoom } from '@/contexts/RoomContext';
import VideoPlayer from '@/components/VideoPlayer';
import Chat from '@/components/Chat';
import ParticipantsList from '@/components/ParticipantsList';
import { FiUsers, FiMessageSquare, FiX, FiCopy } from 'react-icons/fi';
import md5 from 'md5';

export default function RoomPage() {
  const { user, loading: authLoading } = useAuth();
  const { 
    roomId: currentRoomId, 
    joinRoom, 
    leaveRoom, 
    isHost,
    videoUrl,
    participants,
    loading: roomLoading 
  } = useRoom();
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId as string;
  
  const [activePanel, setActivePanel] = useState<'chat' | 'participants' | null>('chat');
  const [isMobile, setIsMobile] = useState(false);
  const [videoHash, setVideoHash] = useState<string | null>(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Calculate video hash when URL changes
  useEffect(() => {
    if (videoUrl) {
      setVideoHash(md5(videoUrl).substring(0, 8));
    } else {
      setVideoHash(null);
    }
  }, [videoUrl]);

  // Join room on load
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && roomId && roomId !== currentRoomId) {
      joinRoom(roomId);
    }

    return () => {
      if (currentRoomId) {
        leaveRoom();
      }
    };
  }, [user, authLoading, roomId, currentRoomId, joinRoom, leaveRoom, router]);

  // Handle copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  if (authLoading || roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (!currentRoomId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Room Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The room you're looking for doesn't exist or you don't have permission to join.</p>
          <button
            onClick={() => router.push('/rooms')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Room header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mr-2">
                {`Room ${roomId.substring(0, 6)}`}
              </h1>
              <button 
                onClick={copyRoomId}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                title="Copy Room ID"
              >
                <FiCopy size={16} />
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-3">
                Host: {participants.find(p => p.isHost)?.displayName || 'Unknown'}
              </span>
              {videoHash && (
                <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                  Hash: {videoHash}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push('/rooms')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-4">
        {/* Video player section */}
        <div className="flex-grow">
          <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
            <VideoPlayer />
          </div>
          
          {/* Mobile tabs for chat/participants */}
          {isMobile && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm focus:outline-none ${activePanel === 'chat' 
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <div className="flex items-center justify-center">
                    <FiMessageSquare className="mr-2" />
                    Chat
                  </div>
                </button>
                <button
                  onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm focus:outline-none ${activePanel === 'participants' 
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <div className="flex items-center justify-center">
                    <FiUsers className="mr-2" />
                    Participants ({participants.length})
                  </div>
                </button>
              </div>
              
              {activePanel === 'chat' && (
                <div className="h-80">
                  <Chat />
                </div>
              )}
              
              {activePanel === 'participants' && (
                <div className="p-4">
                  <ParticipantsList />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop sidebar for chat and participants */}
        {!isMobile && (
          <div className="w-80 flex flex-col space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex-grow flex flex-col">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActivePanel('chat')}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm focus:outline-none ${activePanel === 'chat' 
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <div className="flex items-center justify-center">
                    <FiMessageSquare className="mr-2" />
                    Chat
                  </div>
                </button>
                <button
                  onClick={() => setActivePanel('participants')}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm focus:outline-none ${activePanel === 'participants' 
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <div className="flex items-center justify-center">
                    <FiUsers className="mr-2" />
                    Participants ({participants.length})
                  </div>
                </button>
              </div>
              
              {activePanel === 'chat' ? (
                <div className="flex-grow">
                  <Chat />
                </div>
              ) : (
                <div className="p-4 overflow-y-auto">
                  <ParticipantsList />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}